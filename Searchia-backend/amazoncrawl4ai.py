from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig
import json

url = "https://www.amazon.com/s?k=earbuds"

async def extract_amazon_products():
    browser_config = BrowserConfig(
        browser_type= "chromium",
        headless = True,
        proxy_config={
            "server": "http://proxy.scrapeops.io:5353",
            "username": "scrapeops",
            "password": "6a4520ff-a331-4368-8384-07ff8ecc175f"
        },
        user_agent= "http://headers.scrapeops.io/v1/user-agents?api_key=6a4520ff-a331-4368-8384-07ff8ecc175f"
    )

    crawler_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
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
                        "selector": "[data-csa-c-func-deps=aui-da-a-popover]",
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
            for product in products:
                print(f"title:{product.get('title')}")
                print(f"image:{product.get('image')}")
                print(f"rating:{product.get('rating')}")
                print(f"price:{product.get('price')}")
                print(f"reviews_count:{product.get('reviews_count')}")
                print(f"product_url:{product.get('product_url')}")
            with open("amazon_products.json", "w", encoding="utf-8") as f:
                json.dump(products, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    import asyncio
    asyncio.run(extract_amazon_products())