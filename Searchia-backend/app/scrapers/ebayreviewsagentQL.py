import agentql
from playwright.async_api import async_playwright
import asyncio

async def extract_ebay_reviews(url):
    REVIEWS_QUERY = """
    {
        reviews[] {
            review
        }  
    }
    """

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=True,
            proxy={
                "server": "http://proxy.scrapeops.io:5353",
                "username": "scrapeops",
                "password": "5ac468ac-6d92-4426-9338-64fbef1794bd",
            }
        )

        context = await browser.new_context(
            ignore_https_errors=True,
            user_agent="http://headers.scrapeops.io/v1/user-agents?api_key=5ac468ac-6d92-4426-9338-64fbef1794bd"
        )

        page = await agentql.wrap_async(context.new_page())
        await page.goto(url, wait_until="domcontentloaded", timeout=120000)
        await page.wait_for_timeout(1000)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight);")

        response = await page.query_elements(query=REVIEWS_QUERY)
        print(await response.to_data())
        return await response.to_data()

