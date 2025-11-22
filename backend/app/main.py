from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, prescriptions

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PharmaBot API",
    description="AI-powered prescription scanning and analysis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(prescriptions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to PharmaBot API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
