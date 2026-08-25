from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class DetectionOut(BaseModel):
    id: int
    x: int
    y: int
    width: int
    height: int
    severity: str
    confidence: Optional[float] = None

    class Config:
        from_attributes = True


class ImageOut(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime
    detections: list[DetectionOut] = []

    class Config:
        from_attributes = True
