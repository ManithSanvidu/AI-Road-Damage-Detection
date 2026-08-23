from fastapi import FastAPI

app = FastAPI(title="Road Damage Detection API")


@app.get("/")
def read_root():
    return {"message": "Road Damage Detection API is running"}