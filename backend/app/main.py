from fastapi import FastAPI
from app.database.database import Base, engine
from app.routers import auth_router, upload_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Road Damage Detection API")

app.include_router(auth_router.router)
app.include_router(upload_router.router)


@app.get("/")
def read_root():
    return {"message": "Road Damage Detection API is running"}
