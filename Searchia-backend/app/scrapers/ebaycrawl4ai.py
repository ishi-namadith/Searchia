from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, ProxyConfig
import json

async def extract_ebay_products(product):

    url = f"https://www.ebay.com/sch/i.html?_nkw={product}&_sacat=0&_from=R40&_trksid=p4432023.m570.l1313"

    proxy_config = ProxyConfig(
        server="http://proxy.scrapeops.io:5353",
        username="scrapeops",
        password="5ac468ac-6d92-4426-9338-64fbef1794bd"
    )

    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=True,
        proxy_config=proxy_config,
        user_agent="http://headers.scrapeops.io/v1/user-agents?api_key=5ac468ac-6d92-4426-9338-64fbef1794bd",
        light_mode= True
    )

    crawler_config = CrawlerRunConfig(
        cache_mode=CacheMode.BYPASS,
        page_timeout= 120000,
        extraction_strategy=JsonCssExtractionStrategy(
            verbose=True,
            schema={
                "name": "Ebay products",
                "baseSelector": "ul.srp-results li.s-item",  
                "fields": [
                    {
                        "name": "title",
                        "selector": "div.s-item__title span", 
                        "type": "text"
                    },
                    {
                        "name": "image",
                        "selector": "div.s-item__image-wrapper img", 
                        "type": "attribute",
                        "attribute": "src"
                    },
                    {
                        "name": "rating",
                        "selector": "div.x-star-rating span",  
                        "type": "text"
                    },
                    {
                        "name": "price",
                        "selector": "span.s-item__price", 
                        "type": "text"
                    },
                    {
                        "name": "reviews_count",
                        "selector": "span.s-item__reviews-count span", 
                        "type": "text"
                    },
                    {
                        "name": "product_url",
                        "selector": "a.s-item__link",  
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
            for idx, product in enumerate(products, start=20):
                product["id"] = idx
            return products
            
        else:
            print("No results extracted.")
            if result:
                print("Response status:", result.status)
                print("Error message:", result.error_message if hasattr(result, 'error_message') else "None")
            
        


