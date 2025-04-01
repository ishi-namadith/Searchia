from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, ProxyConfig
import json


async def extract_amazon_products(product):

    url = f"https://www.amazon.com/s?k={product}"

    proxy_config = ProxyConfig(
        server="http://proxy.scrapeops.io:5353",
        username="scrapeops",
        password="b4cdf3a3-634f-4ca9-9ee7-066089cd8725"
    )

    browser_config = BrowserConfig(
        browser_type= "chromium",
        headless = False,
        proxy_config=proxy_config,
        user_agent= "http://headers.scrapeops.io/v1/user-agents?api_key=b4cdf3a3-634f-4ca9-9ee7-066089cd8725"
    )

    crawler_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        page_timeout=120000,
        extraction_strategy=JsonCssExtractionStrategy(
            verbose=True,
            schema={
                "name": "Amazon products",
                "baseSelector": "[data-component-type='s-search-result']",
                "fields": [
                    {
                        "name": "title",
                        "selector": "h2 span",
                        "type": "text"
                    },
                    {
                        "name": "image",
                        "selector": "img.s-image",
                        "type": "attribute",
                        "attribute": "src"
                    },
                    {
                        "name": "rating",
                        "selector": ".a-icon-star-small .a-icon-alt",
                        "type": "text"
                    },
                    {
                        "name": "price",
                        "selector": ".a-price span.a-offscreen",
                        "type": "text"
                    },
                    {
                        "name": "reviews_count",
                        "selector": "span.a-size-base",
                        "type": "text"
                    },
                    {
                        "name": "product_url",
                        "selector": ".a-link-normal",
                        "type": "attribute",
                        "attribute": "href"
                    }
                ]
            }
        )
    )


    async with AsyncWebCrawler(config=browser_config) as crawler:
        result = await crawler.arun(url=url, config=crawler_config)

        if result and result.extracted_content:
            products = json.loads(result.extracted_content)
            for idx, product in enumerate(products, start=1):
                product["id"] = idx
            return products
        else:
            print("No results extracted.")
            if result:
                print(result.extracted_content)
            return []

