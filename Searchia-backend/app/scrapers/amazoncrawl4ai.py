from crawl4ai import AsyncWebCrawler, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from crawl4ai.async_configs import BrowserConfig, CrawlerRunConfig, ProxyConfig
import json
import asyncio
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv("SCRAPEOPS_API_KEY")

async def extract_amazon_products(product):

    url = f"https://www.amazon.com/s?k={product}"
    print("ext - amzn url", url)

    proxy_config = ProxyConfig(
        server="http://proxy.scrapeops.io:5353",
        username="scrapeops",
        password= API_KEY,
    )

    browser_config = BrowserConfig(
        browser_type= "chromium",
        headless = True,
        proxy_config=proxy_config,
        user_agent= "http://headers.scrapeops.io/v1/user-agents?api_key={API_KEY}",
        light_mode= True,
        use_persistent_context=True,
        use_managed_browser= True
    )

    crawler_config = CrawlerRunConfig(
        js_code="window.scrollTo(0, document.body.scrollHeight);",
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
        session_id = "amzn_session"
        result = await crawler.arun(url=url, config=crawler_config)

        # result = await asyncio.wait_for(
        #          crawler.arun(url=url, config=crawler_config), timeout=1600
        #     )

        if result and result.extracted_content:
            products = json.loads(result.extracted_content)
            for idx, product in enumerate(products, start=1):
                product["id"] = idx
            #await crawler.crawler_strategy.kill_session(session_id)
            print("product search done amzn")
            return products
        else:
            #await crawler.crawler_strategy.kill_session(session_id)

            print("No results extracted.")
            if result:
                print(result.extracted_content)
            return []

