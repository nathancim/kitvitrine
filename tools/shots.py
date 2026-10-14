"""Generate catalog images for one template.
Usage: python3 tools/shots.py <index.html> <out_dir> [<fond_hex>] [<accent_hex>]
Writes:
  thumb.jpg  800x600, top of the page on a desktop screen
  full.jpg   full desktop page, 1000px wide
  phone.jpg  800x600, the top of the page on a phone, framed, on a coloured background
  phone-full.jpg  full phone page, 390px wide"""
import sys, asyncio, io
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
from playwright.async_api import async_playwright

def hex2rgb(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

def phone_card(shot, bg, accent):
    W, H = 800, 600
    card = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(card)
    # soft accent disc behind the phone
    d.ellipse((W - 520, -160, W + 140, 500), fill=accent)
    # phone body
    pw, ph, r = 268, 560, 40
    x, y = (W - pw) // 2, 40
    shadow = Image.new('L', (W, H), 0)
    ImageDraw.Draw(shadow).rounded_rectangle((x + 6, y + 18, x + pw + 6, y + ph + 18), r, fill=110)
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    card.paste((20, 24, 32), (0, 0), shadow)
    d.rounded_rectangle((x, y, x + pw, y + ph + 60), r, fill=(22, 27, 38))
    # screen
    sx, sy, sw = x + 10, y + 10, pw - 20
    sh = int(sw * shot.height / shot.width)
    screen = shot.resize((sw, sh), Image.LANCZOS).crop((0, 0, sw, ph + 50))
    mask = Image.new('L', screen.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, screen.width, screen.height + 40), r - 10, fill=255)
    card.paste(screen, (sx, sy), mask)
    return card

async def main(src, out, bg, accent):
    out = Path(out); out.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 1080})
        await pg.goto(Path(src).resolve().as_uri(), wait_until="networkidle")
        await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(300)
        top = Image.open(io.BytesIO(await pg.screenshot()))
        top.convert("RGB").resize((800, 600), Image.LANCZOS).save(out / "thumb.jpg", quality=82, optimize=True)
        full = Image.open(io.BytesIO(await pg.screenshot(full_page=True))).convert("RGB")
        w, h = full.size
        full.resize((1000, int(h * 1000 / w)), Image.LANCZOS).save(out / "full.jpg", quality=78, optimize=True, progressive=True)
        m = await b.new_page(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True, device_scale_factor=2)
        await m.goto(Path(src).resolve().as_uri(), wait_until="networkidle")
        await m.evaluate("document.fonts.ready"); await m.wait_for_timeout(300)
        mtop = Image.open(io.BytesIO(await m.screenshot())).convert("RGB")
        phone_card(mtop, hex2rgb(bg), hex2rgb(accent)).save(out / "phone.jpg", quality=84, optimize=True)
        mfull = Image.open(io.BytesIO(await m.screenshot(full_page=True))).convert("RGB")
        mfull.resize((390, int(mfull.height * 390 / mfull.width)), Image.LANCZOS).save(out / "phone-full.jpg", quality=78, optimize=True, progressive=True)
        await b.close()

asyncio.run(main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else '#EEF1F3', sys.argv[4] if len(sys.argv) > 4 else '#DDE2E7'))
