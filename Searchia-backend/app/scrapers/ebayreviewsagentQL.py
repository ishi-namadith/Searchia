import agentql
from playwright.async_api import async_playwright
import asyncio

async def extract_ebay_reviews():
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
                "password": "b4cdf3a3-634f-4ca9-9ee7-066089cd8725",
            }
        )

        context = await browser.new_context(
            ignore_https_errors=True,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
        )

        page = await agentql.wrap_async(context.new_page())
        await page.goto("https://www.ebay.com/itm/274788823286?_skw=earbuds&epid=2319679599&itmmeta=01JPSPV1EEXN4DSXZPKC3KHVZH&hash=item3ffab0b0f6:g:qw0AAOSwyNlmdUlm&itmprp=enc%3AAQAKAAAA4FkggFvd1GGDu0w3yXCmi1eP6MuaLf5bkaG2X3NPMim1jWiYbsnUN%2BJoqGs5FGTuK0TtATBuLQ4TrT8HOLsua0KLhg7ozu2iXVk0zC4vHPzIZeRRHwERC1GHw6vDAz4RnxQD6dB%2BXT7sm%2Bvcpzz1R3Kq4a8zv8TQgwM0ZaTbOmpYv%2FXjVd1GPC4HEwTTU5IqyutLU1xvsI0zQB%2B6acgvB3%2BeRCT6l5UGUCWBPGdW7Epgax6Xxu1xiyk0t9f%2BKxGFNr6R6Y3J%2FTbpDLVqjL8oj45k2pYSwsxRncLMvBI8Y4uX%7Ctkp%3ABFBM0JfstrZl",
                        wait_until="domcontentloaded", timeout=120000)
        await page.wait_for_timeout(1000)
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight);")

        response = await page.query_elements(query=REVIEWS_QUERY)
        print(await response.to_data())

asyncio.run(extract_ebay_reviews())
