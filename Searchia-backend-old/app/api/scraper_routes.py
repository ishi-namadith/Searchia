from fastapi import APIRouter, HTTPException
from app.scrapers.ebaycrawl4ai import extract_ebay_products

router = APIRouter()

@router.get("/scrapers/ebay")
async def scrape_ebay(query: str):
    """Scrapes eBay for products matching the query."""
    products = await extract_ebay_products(query)
    
    if "error" in products:
        raise HTTPException(status_code=500, detail=products["error"])

    return {"products": products}
