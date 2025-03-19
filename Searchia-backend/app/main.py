from fastapi import FastAPI
from app.api.scraper_routes import router as scraper_router
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI(title="Searchia API")

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allowed origins
    allow_credentials=True,  # Allow cookies and authentication
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)
# Include all scraper routes
app.include_router(scraper_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
