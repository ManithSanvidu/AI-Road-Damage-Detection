import cv2
import os
import shutil
from fastapi import APIRouter, File, UploadFile, BackgroundTasks
from fastapi.responses import StreamingResponse
from ultralytics import YOLO

router = APIRouter(prefix="/video", tags=["Video Analysis"])

UPLOAD_DIR = "uploaded_videos"
OUTPUT_DIR = "processed_videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

MODEL_PATH = "../../ai/training/runs/train/rdd_yolov11/weights/best.pt"
try:
    model = YOLO(MODEL_PATH)
except Exception:
    model = YOLO("yolo11n.pt") # Fallback if training isn't done

def generate_frames(source):
    cap = cv2.VideoCapture(source)
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
            
        results = model(frame, conf=0.25, verbose=False)
        annotated_frame = results[0].plot()
        
        ret, buffer = cv2.imencode('.jpg', annotated_frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
               
    cap.release()

@router.get("/stream_camera")
def stream_camera():
    """Stream live webcam feed with YOLO detection"""
    return StreamingResponse(generate_frames(0), media_type="multipart/x-mixed-replace; boundary=frame")

@router.get("/stream_url")
def stream_url(url: str):
    """Stream video from URL with YOLO detection"""
    return StreamingResponse(generate_frames(url), media_type="multipart/x-mixed-replace; boundary=frame")

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file for background processing"""
    input_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    output_folder = os.path.join(OUTPUT_DIR, "video_results")
    
    model.predict(
        source=input_path,
        save=True,
        project=OUTPUT_DIR,
        name="video_results",
        exist_ok=True
    )
    
    return {"message": "Video processed successfully", "output_folder": output_folder}
