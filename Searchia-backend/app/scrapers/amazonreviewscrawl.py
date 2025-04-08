from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, ProxyConfig
import json

async def extract_amazon_reviews(url):
    # Create a proper ProxyConfig object instead of a dict
    proxy_config = ProxyConfig(
        server="http://proxy.scrapeops.io:5353",
        username="scrapeops",
        password="5ac468ac-6d92-4426-9338-64fbef1794bd"
    )

    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=False,
        proxy_config=proxy_config,  # Use the ProxyConfig object
        user_agent="http://headers.scrapeops.io/v1/user-agents?api_key=5ac468ac-6d92-4426-9338-64fbef1794bd"
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

        if result and result.extracted_content:
            reviews = json.loads(result.extracted_content)
            return reviews
            
        else:
            print("No results extracted.")
            if result:
                print("Response status:", result.status)
                print("Error message:", result.error_message if hasattr(result, 'error_message') else "None")
            return []

                
