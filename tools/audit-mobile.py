"""Contrôle mobile d'un template (écran 390 x 844, tactile).
Usage : python3 tools/audit-mobile.py <slug> [<slug> ...]
Sortie : liste des problèmes, puis « OK » ou « À CORRIGER ». Code de retour 1 si un problème bloquant existe.
Capture pleine page enregistrée dans shots/<slug>/mobile.jpg (à regarder avec Read)."""
import asyncio, io, sys
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parent.parent
MAX_SCREENS = 8          # hauteur de page maxi, en écrans de 844 px

CHECK = r"""() => {
  const W = document.documentElement.clientWidth, out = {block: [], warn: []};
  const vis = e => { const s = getComputedStyle(e), r = e.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && !e.closest('[aria-hidden="true"]'); };
  if (document.documentElement.scrollWidth > W + 1) out.block.push(`défilement horizontal : largeur ${document.documentElement.scrollWidth}px pour ${W}px`);
  // Inside a horizontal carousel (overflow-x auto/scroll) is fine
  const inScroller = e => { for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll') return true; } return false; };
  // Text that overflows the screen (decorative SVG excluded)
  document.querySelectorAll('h1,h2,h3,p,li,a,button,label,input,select,textarea,table').forEach(e => {
    if (!vis(e) || e.closest('svg') || inScroller(e)) return; const r = e.getBoundingClientRect();
    if (r.right > W + 1 || r.left < -1) out.block.push(`déborde de l'écran : <${e.tagName.toLowerCase()}> « ${e.textContent.trim().slice(0, 40)} »`);
  });
  // Tap targets
  document.querySelectorAll('a,button,summary,select,input:not([type=hidden]),textarea').forEach(e => {
    if (!vis(e) || e.closest('p,li p') && e.tagName === 'A') return;
    if (e.matches('input[type=checkbox],input[type=radio]')) { const l = e.closest('label'); if (l && l.getBoundingClientRect().height >= 40) return; }
    if (e.matches('input[type=file]')) return;
    const r = e.getBoundingClientRect();
    if (r.height < 44) out.block.push(`zone tactile trop petite (${Math.round(r.height)}px, 44 mini) : <${e.tagName.toLowerCase()}> « ${(e.textContent || e.placeholder || e.name || '').trim().slice(0, 30)} »`);
  });
  // Font sizes
  document.querySelectorAll('input,select,textarea').forEach(e => { if (vis(e) && parseFloat(getComputedStyle(e).fontSize) < 16) out.block.push(`champ de formulaire en ${getComputedStyle(e).fontSize} (16px mini, sinon zoom auto sur iPhone) : ${e.name || e.type}`); });
  document.querySelectorAll('p,li,dd,blockquote,td').forEach(e => { if (vis(e) && e.textContent.trim().length > 30 && parseFloat(getComputedStyle(e).fontSize) < 15) out.warn.push(`texte courant en ${getComputedStyle(e).fontSize} (15px mini conseillé) : « ${e.textContent.trim().slice(0, 30)} »`); });
  // Narrow text columns (side-by-side cards with long text)
  document.querySelectorAll('p').forEach(e => { if (vis(e) && e.textContent.trim().length > 60 && e.getBoundingClientRect().width < (inScroller(e) ? 190 : 230)) out.block.push(`colonne de texte trop étroite (${Math.round(e.getBoundingClientRect().width)}px) : « ${e.textContent.trim().slice(0, 30)} »`); });
  // Quick call action reachable without scrolling
  const call = [...document.querySelectorAll('a[href^="tel:"], a[href="#contact"], a[href*="devis"], a[href*="reserv"]')].some(a => { const r = a.getBoundingClientRect(); return vis(a) && r.top < 844 && r.bottom > 0; });
  // Carousels must hint that there is more (next card partly visible)
  document.querySelectorAll('*').forEach(a => { const o = getComputedStyle(a).overflowX; if ((o === 'auto' || o === 'scroll') && a.scrollWidth > a.clientWidth + 4 && vis(a)) {
    const kids = [...a.children].filter(vis); const second = kids[1]; if (!second) return; const r = second.getBoundingClientRect(), ar = a.getBoundingClientRect();
    if (r.left >= ar.right - 8) out.block.push(`carrousel sans carte suivante visible : on ne devine pas qu'il faut faire glisser (« ${kids[0].textContent.trim().slice(0, 25)} »)`); } });
  if (!call) out.block.push("aucun bouton d'action (appel, devis, réservation, contact) visible dans le premier écran");
  // Sticky mobile action bar
  const sticky = [...document.querySelectorAll('body *')].some(e => { const s = getComputedStyle(e); return (s.position === 'fixed' || s.position === 'sticky') && e.querySelector('a[href^="tel:"], a[href^="#"]') && e.getBoundingClientRect().bottom >= window.innerHeight - 2; });
  if (!sticky) out.block.push("pas de barre d'action fixée en bas de l'écran sur mobile (Appeler / Devis ou Réserver)");
  out.height = document.documentElement.scrollHeight;
  return out;
}"""

async def audit(slug, browser):
    page = await browser.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
    html = ROOT / "templates" / slug / "index.html"
    if not html.exists():
        print(f"{slug} : templates/{slug}/index.html introuvable"); return False
    await page.goto(html.as_uri(), wait_until="networkidle")
    # Le mode édition (ajouté par le build) affiche les cartes : on le charge pour mesurer la vraie page
    await page.add_script_tag(path=str(ROOT / "tools" / "kv-edition.js"))
    await page.evaluate("document.fonts.ready"); await page.wait_for_timeout(300)
    res = await page.evaluate(CHECK)
    # Mobile menu must open
    btn = page.locator('button[aria-controls], button[aria-expanded]').first
    if await btn.count() and await btn.is_visible():
        await btn.click(); await page.wait_for_timeout(350)
        if await btn.get_attribute("aria-expanded") != "true":
            res["block"].append("le bouton du menu mobile ne passe pas aria-expanded à true")
        await btn.click(); await page.wait_for_timeout(200)
    else:
        res["block"].append("aucun bouton de menu mobile visible (button avec aria-expanded)")
    screens = res["height"] / 844
    if screens > MAX_SCREENS:
        res["block"].append(f"page trop longue sur mobile : {screens:.1f} écrans (maxi {MAX_SCREENS}). Condenser : carrousels horizontaux, accordéons, textes plus courts")
    shot = Image.open(io.BytesIO(await page.screenshot(full_page=True))).convert("RGB")
    shot = shot.resize((390, int(shot.height * 390 / shot.width)), Image.LANCZOS)
    out = ROOT / "shots" / slug; out.mkdir(parents=True, exist_ok=True)
    shot.save(out / "mobile.jpg", quality=80)
    await page.close()
    block = list(dict.fromkeys(res["block"])); warn = list(dict.fromkeys(res["warn"]))
    print(f"\n== {slug} : {screens:.1f} écrans de haut ==")
    for b in block[:25]: print("  ✗", b)
    if len(block) > 25: print(f"  … et {len(block) - 25} autres")
    for w in warn[:8]: print("  ! ", w)
    print("  OK" if not block else f"  À CORRIGER ({len(block)} problème(s))")
    return not block

async def main(slugs):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ok = [await audit(s, b) for s in slugs]
        await b.close()
    sys.exit(0 if all(ok) else 1)

if __name__ == "__main__":
    if len(sys.argv) < 2: print(__doc__); sys.exit(2)
    asyncio.run(main(sys.argv[1:]))
