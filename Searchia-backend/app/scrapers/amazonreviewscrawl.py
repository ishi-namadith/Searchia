from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, ProxyConfig
import json

url = "https://www.amazon.com/Soundcore-Auto-Adjustable-Cancelling-Wireless-Headphone/dp/B0B1LVC5VZ/ref=sr_1_35?sr=8-35&xpid=EG9S-2YHDq1mf"

async def extract_amazon_reviews():
    # Create a proper ProxyConfig object instead of a dict
    proxy_config = ProxyConfig(
        server="http://proxy.scrapeops.io:5353",
        username="scrapeops",
        password="b4cdf3a3-634f-4ca9-9ee7-066089cd8725"
    )

    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=False,
        proxy_config=proxy_config,  # Use the ProxyConfig object
        user_agent="http://headers.scrapeops.io/v1/user-agents?api_key=b4cdf3a3-634f-4ca9-9ee7-066089cd8725"
    )

    crawler_config = CrawlerRunConfig(
        js_code="window.scrollTo(0, document.body.scrollHeight);",
        cache_mode=CacheMode.BYPASS,
        page_timeout=120000,
        extraction_strategy=JsonCssExtractionStrategy(
            verbose=True,
            schema={
                "name": "amazon reviews",
                "baseSelector": "#product-summary",
                "fields": [
                    {
                        "name": "reviews",
                        "selector": "span",
                        "type": "text"
                    }
                ]
            }
        )
    )
    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=url, config=crawler_config)
        print(result.extracted_content)
        if result and result.extracted_content:
            reviews = json.loads(result.extracted_content)
            with open("amazon_product_reviews.json", "w", encoding="utf-8") as f:
                json.dump(reviews, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    import asyncio
    asyncio.run(extract_amazon_reviews())