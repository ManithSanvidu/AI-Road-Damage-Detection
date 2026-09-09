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


class DamageReportCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    damage_type: str
    severity: str
    description: Optional[str] = None
    status: Optional[str] = "Reported"


class DamageReportUpdate(BaseModel):
    status: str


class DamageReportOut(DamageReportCreate):
    id: int
    reported_at: datetime

    class Config:
        from_attributes = True
