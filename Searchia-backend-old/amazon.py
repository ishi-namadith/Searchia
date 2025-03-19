import requests
from urllib.parse import urlencode
from bs4 import BeautifulSoup
import json
import logging, os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_KEY = '6a4520ff-a331-4368-8384-07ff8ecc175f'

def search_products(product_name: str retries=3):
    tries = 0
    success = False

    while tries < retries and not success:
        try:
            url = f"https://www.amazon.com/s?k={product_name}"
            response = requests.get(url)

            if response.status_code == 200:
                logger.info("Request successful")
                soup = BeautifulSoup(response.text, 'html.parser')

                divs = soup.find_all('div')

                last_title = ""

                for div in divs:
                    parsable = True if div is not None else False
                    h2 = div.find('h2')
                    if h2 and h2.text.strip() and h2.text.strip() != last_title and parsable:
                        title = h2.text.strip()
                        a = h2.find('a')
                        product_url = a.get('href') if a else ""
                        ad_status = False
                        if "sspa" in product_url:
                            ad_status = True
                        asin = div.get('data-asin')    
                        image = div.find("img")
                        if image:
                            image_url = image.get("src")
                        else:
                            image_url = None
                        symbol_element = div.find("span", class_="a-price-symbol")
                        symbol_presence = symbol_element.text if symbol_element else None
                        if symbol_presence is not None:
                            pricing_unit = symbol_presence
                            prices = div.find_all("span", class_="a-offscreen")

                            rating_element = div.find("span", class_= "a-icon-alt")
                            rating_present = rating_element.text[0:3] if rating_element else "0.0"
                            rating = float(rating_present)

                            price_present = prices[0].text.replace (pricing_unit, "").replace(",","")
                            price = float(price_present) if price_present else 0.0

                            real_price = float(prices[1].text.replace(pricing_unit, "").replace(",","")) if len(prices) > 1 else price

                        if symbol_presence and rating_present and price_present:
                            product = {
                                "title": title,
                                "url": product_url,
                                "is_ad": ad_status,
                                "name": asin,
                                "rating": rating,
                                "price": price,
                                "real_price": real_price,
                                "image_url": image_url
                            }
                            print(product)
                        
                        last_title = title
                    
                    else:
                        continue
                
                success = True

            else:
                raise Exception(f"Failed to fetch data from Amazon: {response.status_code}")

        except Exception as e:
            logger.warning(f"Failed to fetch data from Amazon: {e}")
            tries += 1


