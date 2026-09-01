import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import Image
from app.schemas.schemas import ImageOut

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("", response_model=ImageOut)
def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_image = Image(
        filename=file.filename,
        filepath=file_path,
        owner_id=None,
    )
    db.add(new_image)
    db.commit()
    db.refresh(new_image)

    return new_image
