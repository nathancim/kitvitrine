"""Usage: python3 shoot.py <html_path> <out_prefix> [full]"""
import sys, asyncio
from playwright.async_api import async_playwright
async def main(path, out, full):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, w, h in [("desktop", 1440, 900), ("mobile", 390, 844)]:
            pg = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
            await pg.goto("file://" + path if not path.startswith("http") else path, wait_until="networkidle")
            await pg.wait_for_timeout(400)
            await pg.screenshot(path=f"{out}-{name}.png", full_page=full)
        await b.close()
asyncio.run(main(sys.argv[1], sys.argv[2], len(sys.argv) > 3))
