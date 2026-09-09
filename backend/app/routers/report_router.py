from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models import models
from app.schemas import schemas

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("", response_model=schemas.DamageReportOut)
def create_report(report: schemas.DamageReportCreate, db: Session = Depends(get_db)):
    new_report = models.DamageReport(
        latitude=report.latitude,
        longitude=report.longitude,
        damage_type=report.damage_type,
        severity=report.severity,
        description=report.description,
        status=report.status
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.get("", response_model=List[schemas.DamageReportOut])
def get_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = db.query(models.DamageReport).offset(skip).limit(limit).all()
    return reports

@router.patch("/{report_id}", response_model=schemas.DamageReportOut)
def update_report_status(report_id: int, report_update: schemas.DamageReportUpdate, db: Session = Depends(get_db)):
    db_report = db.query(models.DamageReport).filter(models.DamageReport.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db_report.status = report_update.status
    db.commit()
    db.refresh(db_report)
    return db_report
