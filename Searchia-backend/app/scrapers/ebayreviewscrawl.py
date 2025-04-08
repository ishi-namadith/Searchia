from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig
import json

url = "https://www.ebay.com/itm/274788823286?_skw=earbuds&epid=2319679599&itmmeta=01JPSPV1EEXN4DSXZPKC3KHVZH&hash=item3ffab0b0f6:g:qw0AAOSwyNlmdUlm&itmprp=enc%3AAQAKAAAA4FkggFvd1GGDu0w3yXCmi1eP6MuaLf5bkaG2X3NPMim1jWiYbsnUN%2BJoqGs5FGTuK0TtATBuLQ4TrT8HOLsua0KLhg7ozu2iXVk0zC4vHPzIZeRRHwERC1GHw6vDAz4RnxQD6dB%2BXT7sm%2Bvcpzz1R3Kq4a8zv8TQgwM0ZaTbOmpYv%2FXjVd1GPC4HEwTTU5IqyutLU1xvsI0zQB%2B6acgvB3%2BeRCT6l5UGUCWBPGdW7Epgax6Xxu1xiyk0t9f%2BKxGFNr6R6Y3J%2FTbpDLVqjL8oj45k2pYSwsxRncLMvBI8Y4uX%7Ctkp%3ABFBM0JfstrZl"

async def extract_ebay_reviews():
    browser_config = BrowserConfig(
        browser_type= "chromium",
        headless = True,
        proxy_config={
            "server": "http://proxy.scrapeops.io:5353",
            "username": "scrapeops",
            "password": "5ac468ac-6d92-4426-9338-64fbef1794bd"
        },
        user_agent= "http://headers.scrapeops.io/v1/user-agents?api_key=5ac468ac-6d92-4426-9338-64fbef1794bd"
    )

    crawler_config = CrawlerRunConfig(
        js_code="window.scrollTo(0, document.body.scrollHeight);",
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=JsonCssExtractionStrategy(
            verbose=True,
            schema={
                "name": "amazon reviews",
                "baseSelector": "ul.fdbk-detail-list_cards",
                "fields": [
                    {
                        "name": "reviews",
                        "selector": "li div.fdbk-container_details_comment span",
                        "type": "text"
                    }
                ]
            }
        )
    )
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=url, config=crawler_config)
        print (result.extracted_content)
        if result and result.extracted_content:
            reviews = json.loads(result.extracted_content)
            with open("ebay_product_reviews.json", "w", encoding="utf-8") as f:
                json.dump(reviews, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    import asyncio
    asyncio.run(extract_ebay_reviews())