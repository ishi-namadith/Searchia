from flask import Flask, jsonify, request
from flask_cors import CORS
from scrapers.ebaycrawl4ai import extract_ebay_products
from scrapers.amazoncrawl4ai import extract_amazon_products
from scrapers.ebayreviewsagentQL import extract_ebay_reviews
from scrapers.amazonAgentQL import extract_amazon_reviews
from scrapers.rag import review_summarize
# from scrapers.amazonreviewscrawl import extract_amazon_reviews
from scrapers.rag import compare_products
import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor
from multiprocessing import Process, Queue
import asyncio

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"], 
                           "methods": ["GET", "POST", "OPTIONS"],
                           "allow_headers": ["Content-Type", "Authorization"]}})

thread_local = threading.local()

def get_event_loop():
    """Get or create an event loop for the current thread"""
    if not hasattr(thread_local, "loop"):
        thread_local.loop = asyncio.new_event_loop()
        asyncio.set_event_loop(thread_local.loop)
    return thread_local.loop

def run_async_task(async_func, *args):
    """Run an async function in the current thread's event loop"""
    loop = get_event_loop()
    return loop.run_until_complete(async_func(*args))



#new-async impl
def run_browser_task(q, product,extract_site):
    try:
        match extract_site:
            case "ebay":
                result = asyncio.run(extract_ebay_products(product))
            case "amazon":
                result = asyncio.run(extract_amazon_products(product))
            case _:
                result = {"error": f"Unsupported site: {extract_site}"}

        q.put(result)
        print(f"Scraping done, result count: {len(result)}")
        
    except Exception as e:
        q.put({"error": str(e)})

def run_browser_task_reviews(url, extract_site, q):
    try:
        match extract_site:
            case "ebayreviews":
                result = asyncio.run(extract_ebay_reviews(url))
            case "amazonreviews":
                result = asyncio.run(extract_amazon_reviews(url))
            case _:
                result = {"error": f"Unsupported site: {extract_site}"}

        print(f"Scraping done, result count: {len(result)}")
        q.put(result)

    except Exception as e:
        print(f"Error: {str(e)}")
        q.put({"error": str(e)})

@app.route('/')
def index():
    return "Hello, Searchia!"

@app.route('/search')
def search():
    print("search starting -->")
    product = request.args.get("product")
    product = request.args.get("product")
    if product and " " in product:
        product_new = product.replace(" ", "+")
    else:
        product_new = product
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400

    q = Queue()
    p_amzn = Process(target=run_browser_task, args=(q, product_new, "ebay"))
    p_ebay = Process(target=run_browser_task, args=(q, product , "amazon"))
    p_amzn.start()
    p_ebay.start()


    results = [q.get(), q.get()]


    #merge
    print("mergine processes")
    p_amzn.join()  
    print("after amzn join")
    p_ebay.join() 
    print("after ebay join")

    all_products = []
    for r in results:
        if isinstance(r, dict) and "error" in r:
            continue
        all_products.extend(r)
    

    return jsonify(all_products)


@app.route('/ebay-tmp')
def ebaytmp():
    product = request.args.get("product")
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400

    try:
        q = Queue()
        p = Process(target=run_browser_task, args=(q, product, "ebay"))
        p.start()
        print("after start")
        p.join() 
        print("after join")
        if not q.empty():
            products = q.get()
        else:
            raise Exception("No data returned from child process")
        
        print(f"Done extrcting ebay products - {len(products)}")

        return jsonify(products)
    except Exception as e:
        app.logger.error(f"Error in /ebay endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500 

@app.route('/ebay-old')
def ebayold():
    product = request.args.get("product")
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400
    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(run_async_task, extract_ebay_products, product)
            products = future.result()
        return jsonify(products)
    except Exception as e:
        app.logger.error(f"Error in /ebay endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/amazon')
def amazon():
    product = request.args.get("product")
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400
    try:
        q = Queue()
        p = Process(target=run_browser_task, args=(q, product , "amazon"))
        p.start()
        print("after start")
        p.join()  
        print("after join") 
        if not q.empty():
            products = q.get()
        else:
            raise Exception("No data returned from child process")

        return jsonify(products)
    except Exception as e:
        app.logger.error(f"Error in /amazon endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500   

@app.route('/amazon-old')
def amazonold():
    product = request.args.get("product")
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400
    
    try:
        with ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(run_async_task, extract_amazon_products, product)
            print("wait - executor")
            products = future.result()
        return jsonify(products)
    except Exception as e:
        app.logger.error(f"Error in /amazon endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/ebayreviews')
def ebayreviews():
    url = request.args.get("url", type=str)
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400
    
    try:
        with ThreadPoolExecutor() as executor:
            future = executor.submit(run_async_task, extract_ebay_reviews, url)
            reviews = future.result()
            print(f"Done extrcting ebay reviews - {(reviews)}")
        return jsonify(reviews)
    except Exception as e:
        app.logger.error(f"Error in /ebayreviews endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/amazonreviews')
def amazonereviewss():
    url = request.args.get("url", type=str)
    if not url:
        return jsonify({"error": "URL parameter is required"}), 400
    
    try:
        with ThreadPoolExecutor() as executor:
            future = executor.submit(run_async_task, extract_amazon_reviews, url)
            reviews = future.result()
            print(f"Done extrcting amazone reviews - {(reviews)}")
        return jsonify(reviews)
    except Exception as e:
        app.logger.error(f"Error in /amazonreviews endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

# @app.route('/amazonreviews')
# def amazonreviews():
#     url = request.args.get("url", type=str)
#     print(f"extracting reviews from --> {url}")
#     if not url:
#         return jsonify({"error": "URL parameter is required"}), 400

#     try:
#         q = Queue()
#         p = Process(target=run_browser_task_reviews, args=(url, "amazonreviews", q))
#         p.start()
#         print("after start")
#         p.join()
#         print("after join")

#         if not q.empty():
#             result = q.get()
#         else:
#             result = {"error": "No result returned from scraper"}

#         return jsonify(result)

#     except Exception as e:
#         app.logger.error(f"Error in /amazonreviews endpoint: {str(e)}")
#         return jsonify({"error": str(e)}), 5000
    
@app.route('/review-summarize')
def reviewsummarize():
    reviews = request.args.get("reviews")
    if not reviews:
        return jsonify({"error": "Reviews parameter is required"}), 400
    summery = review_summarize(reviews)
    return jsonify(summery)

@app.route('/compare', methods=['POST'])
def compare():
    try:
        # The products are inside the "products" key of the request body
        data = request.json.get("products")
        if not data:
            return jsonify({"error": "Products data is required"}), 400
        
        result = compare_products(data)
        return jsonify(result)
    except Exception as e:
        app.logger.error(f"Error in /compare endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True, threaded=True, use_reloader=False)