from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import DamageReport
from app.schemas.schemas import DamageReportCreate, DamageReportOut
from typing import List

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("", response_model=DamageReportOut)
def create_report(report: DamageReportCreate, db: Session = Depends(get_db)):
    new_report = DamageReport(
        latitude=report.latitude,
        longitude=report.longitude,
        damage_type=report.damage_type,
        severity=report.severity,
        description=report.description
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("", response_model=List[DamageReportOut])
def get_reports(db: Session = Depends(get_db)):
    return db.query(DamageReport).all()
