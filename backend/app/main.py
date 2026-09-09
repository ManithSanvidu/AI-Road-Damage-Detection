from fastapi import FastAPI
from app.database.database import Base, engine
from app.routers import auth_router, upload_router, video_router, report_router

Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Road Damage Detection API")

origins = [
    "http://localhost:5173",
    "https://ai-road-damage-detection.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(upload_router.router)
app.include_router(video_router.router)
app.include_router(report_router.router)


@app.get("/")
def read_root():
    return {"message": "Road Damage Detection API is running"}

from fastapi.responses import JSONResponse
from fastapi import Request
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    response = JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error", "details": str(exc), "traceback": traceback.format_exc()}
    )
    # Ensure CORS headers are present even on 500 errors so the frontend can read the error
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response
