from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig
import json

url = "https://www.aliexpress.com/w/wholesale-iphone-11.html?spm=a2g0o.productlist.search.0"

async def extract_aliexpress_products():
    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=True,
        proxy_config={
            "server": "http://proxy.scrapeops.io:5353",
            "username": "scrapeops",
            "password": "6a4520ff-a331-4368-8384-07ff8ecc175f"
        },
        user_agent="http://headers.scrapeops.io/v1/user-agents?api_key=6a4520ff-a331-4368-8384-07ff8ecc175f"
    )

    crawler_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        extraction_strategy=JsonCssExtractionStrategy(
            verbose=True,
            schema={
                "name": "aliexpress products",
                "baseSelector": "#card-list",  
                "fields": [
                    {
                        "name": "title",
                        "selector": "h3 .kb_jl",  
                        "type": "text"
                    },
                    {
                        "name": "image",
                        "selector": "img .19_be", 
                        "type": "attribute",
                        "attribute": "src"
                    },
                    {
                        "name": "rating",
                        "selector": ".kb_ku",  
                        "type": "text"
                    },
                    {
                        "name": "price",
                        "selector": ".kb_j3",
                        "type": "text"
                    },
                    {
                        "name": "product_url",
                        "selector": "a.kb_b io_it search-card-item",  
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
                    
                with open("aliexpress_products.json", "w", encoding="utf-8") as f:
                    json.dump(products, f, ensure_ascii=False, indent=4)
                print("\nResults saved to aliexpress_products.json")
            except json.JSONDecodeError as e:
                print("Error decoding JSON:", e)
                print("Raw content:", result.extracted_content)
        else:
            print("No results extracted.")
            if result:
                print("Response status:", result.status)
                print("Error message:", result.error_message if hasattr(result, 'error_message') else "None")

if __name__ == "__main__":
    import asyncio
    asyncio.run(extract_aliexpress_products())