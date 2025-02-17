import asyncio
from playwright.async_api import async_playwright

async def take_screenshot(url, path):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(url)
        await page.screenshot(path=path)
        await browser.close()
        print(f"Screenshot saved to {path}")

if __name__ == "__main__":
    asyncio.run(take_screenshot("https://github.com", "github_screenshot.png")) 