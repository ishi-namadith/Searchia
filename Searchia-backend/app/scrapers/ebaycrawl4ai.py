from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, ProxyConfig
import json
import asyncio
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv("SCRAPEOPS_API_KEY")

async def extract_ebay_products(product):

    url = f"https://www.ebay.com/sch/i.html?_nkw={product}&_sacat=0&_from=R40&_trksid=p4432023.m570.l1313"

    proxy_config = ProxyConfig(
        server="http://proxy.scrapeops.io:5353",
        username="scrapeops",
        password= API_KEY,
    )

    browser_config = BrowserConfig(
        browser_type="chromium",
        headless=True,
        proxy_config=proxy_config,
        user_agent="http://headers.scrapeops.io/v1/user-agents?api_key={API_KEY}", 
        light_mode= True,
        use_persistent_context=True,
        use_managed_browser=True
    )

    crawler_config = CrawlerRunConfig(
        js_code="window.scrollTo(0, document.body.scrollHeight);",
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
        session_id = "ebay_session"
        result = await crawler.arun(url=url, config=crawler_config)

        # result = await asyncio.wait_for(
        #          crawler.arun(url=url, config=crawler_config), timeout=1600
        #     )

        if result and result.extracted_content:
            products = json.loads(result.extracted_content)
            for idx, product in enumerate(products, start=100):
                product["id"] = idx

            print("product search done ebay")
            #await crawler.crawler_strategy.kill_session(session_id)
            return products
            
        else:
            #await crawler.crawler_strategy.kill_session(session_id)

            print("No results extracted.")
            if result:
                print("Response status:", result.status)
                print("Error message:", result.error_message if hasattr(result, 'error_message') else "None")
            
        
    return ""

