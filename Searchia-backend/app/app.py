from flask import Flask, jsonify, request
from flask_cors import CORS
from scrapers.ebaycrawl4ai import extract_ebay_products
from scrapers.amazoncrawl4ai import extract_amazon_products
from scrapers.ebayreviewsagentQL import extract_ebay_reviews
import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Create thread-local storage for event loops
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

@app.route('/')
def index():
    return "Hello, Searchia!"

@app.route('/ebay')
def ebay():
    product = request.args.get("product")
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400
    try:
        with ThreadPoolExecutor() as executor:
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
        with ThreadPoolExecutor() as executor:
            future = executor.submit(run_async_task, extract_amazon_products, product)
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
        return jsonify(reviews)
    except Exception as e:
        app.logger.error(f"Error in /ebayreviews endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True, threaded=True)