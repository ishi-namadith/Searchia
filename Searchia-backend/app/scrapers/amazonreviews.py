import agentql
from playwright.async_api import async_playwright
import asyncio
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv("SCRAPEOPS_API_KEY")

async def extract_amazon_reviews(url):
    REVIEWS_QUERY = """
    {
        reviews[] {
            review
        } 
    }
    """

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(
            headless=False,
            proxy={
                "server": "http://proxy.scrapeops.io:5353",
                "username": "scrapeops",
                "password": API_KEY,
            }
        )

        context = await browser.new_context(
            ignore_https_errors=True,
            user_agent="http://headers.scrapeops.io/v1/user-agents?api_key={API_KEY}",
        )

        page = await agentql.wrap_async(context.new_page())
        await page.goto(url, wait_until="domcontentloaded", timeout=120000)
        await page.wait_for_timeout(2000)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight);")

        response = await page.query_elements(query=REVIEWS_QUERY)
        print(await response.to_data())
        return await response.to_data()

