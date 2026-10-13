"""Generate catalog images for one template.
Usage: python3 tools/shots.py <index.html> <out_dir>
Writes thumb.jpg (800x600, top of page) and full.jpg (full page, 1000px wide)."""
import sys, asyncio, io
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

async def main(src, out):
    out = Path(out); out.mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 1440, "height": 1080})
        await pg.goto(Path(src).resolve().as_uri(), wait_until="networkidle")
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(300)
        top = Image.open(io.BytesIO(await pg.screenshot()))
        top.convert("RGB").resize((800, 600), Image.LANCZOS).save(out / "thumb.jpg", quality=82, optimize=True)
        full = Image.open(io.BytesIO(await pg.screenshot(full_page=True))).convert("RGB")
        w, h = full.size
        full.resize((1000, int(h * 1000 / w)), Image.LANCZOS).save(out / "full.jpg", quality=78, optimize=True, progressive=True)
        await b.close()

asyncio.run(main(sys.argv[1], sys.argv[2]))
