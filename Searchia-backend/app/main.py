from flask import Flask, jsonify, request
from flask_cors import CORS
from scrapers.ebaycrawl4ai import extract_ebay_products
from scrapers.amazoncrawl4ai import extract_amazon_products
import asyncio
import threading
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

def run_async_task(async_func, product):
    return asyncio.run(async_func(product))

@app.route('/')
def index():
    return "Hello, Searchia!"

@app.route('/ebay')
def ebay():
    product = request.args.get("product", type=str)
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400
    try:
        with ThreadPoolExecutor() as executor:
            future = executor.submit(run_async_task, extract_ebay_products, product)
            products = future.result()  # This will wait for the task to complete
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/amazon')
def amazon():
    product = request.args.get("product", type=str)
    if not product:
        return jsonify({"error": "Product parameter is required"}), 400
    
    try:
        with ThreadPoolExecutor() as executor:
            # Submit the task and wait for the result
            future = executor.submit(run_async_task, extract_amazon_products, product)
            products = future.result()  # This will wait for the task to complete
        return jsonify(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)