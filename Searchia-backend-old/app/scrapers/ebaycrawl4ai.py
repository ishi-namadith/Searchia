from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig
import json


async def extract_ebay_products(query: str):

    url = f"https://www.ebay.com/sch/i.html?_nkw={query.replace(' ', '+')}&_sacat=0&_from=R40&_trksid=p4432023.m570.l1313"

    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=True,
        proxy_config={
            "server": "http://proxy.scrapeops.io:5353",
            "username": "scrapeops",
            "password": "6a4520ff-a331-4368-8384-07ff8ecc175f"
        },
        user_agent="http://headers.scrapeops.io/v1/user-agents?api_key=6a4520ff-a331-4368-8384-07ff8ecc175f",
        light_mode= True
    )

    crawler_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=JsonCssExtractionStrategy(
            verbose=True,
            schema={
                "name": "Ebay products",
                "baseSelector": "ul.srp-results li.s-item",  # Changed to target individual items
                "fields": [
                    {
                        "name": "title",
                        "selector": "div.s-item__title span",  # Corrected selector
                        "type": "text"
                    },
                    {
                        "name": "image",
                        "selector": "div.s-item__image-wrapper img",  # Added div prefix
                        "type": "attribute",
                        "attribute": "src"
                    },
                    {
                        "name": "rating",
                        "selector": "div.x-star-rating span",  # Added div prefix
                        "type": "text"
                    },
                    {
                        "name": "price",
                        "selector": "span.s-item__price",  # Fixed selector
                        "type": "text"
                    },
                    {
                        "name": "reviews_count",
                        "selector": "span.s-item__reviews-count span",  # Fixed selector
                        "type": "text"
                    },
                    {
                        "name": "product_url",
                        "selector": "a.s-item__link",  # Fixed selector
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
            try:
                products = json.loads(result.extracted_content)
                print(f"Found {len(products)} products")
                for product in products:
                    print("\n------- Product -------")
                    print(f"Title: {product.get('title')}")
                    print(f"Image: {product.get('image')}")
                    print(f"Rating: {product.get('rating')}")
                    print(f"Price: {product.get('price')}")
                    print(f"Reviews count: {product.get('reviews_count')}")
                    print(f"Product URL: {product.get('product_url')}")
                    
                with open("ebay_products.json", "w", encoding="utf-8") as f:
                    json.dump(products, f, ensure_ascii=False, indent=4)
                print("\nResults saved to ebay_products.json")
                return products
            except json.JSONDecodeError as e:
                print("Error decoding JSON:", e)
                print("Raw content:", result.extracted_content)
        else:
            print("No results extracted.")
            if result:
                print("Response status:", result.status)
                print("Error message:", result.error_message if hasattr(result, 'error_message') else "None")

# if __name__ == "__main__":
#     import asyncio
#     asyncio.run(extract_ebay_products())