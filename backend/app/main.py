from fastapi import FastAPI
from app.database.database import Base, engine
from app.routers import auth_router, upload_router, video_router

Base.metadata.create_all(bind=engine)

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Road Damage Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(upload_router.router)
app.include_router(video_router.router)


@app.get("/")
def read_root():
    return {"message": "Road Damage Detection API is running"}
