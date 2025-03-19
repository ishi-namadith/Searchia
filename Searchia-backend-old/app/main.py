from fastapi import FastAPI
from app.api.scraper_routes import router as scraper_router

app = FastAPI(title="Searchia API")

# Include all scraper routes
app.include_router(scraper_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
