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

import glob

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

# Automatically download and use a professionally pre-trained YOLOv8 pothole model from HuggingFace
# This gives instant high accuracy without needing to wait for local training!
PRETRAINED_MODEL_URL = "https://huggingface.co/peterhdd/pothole-detection-yolov8/resolve/main/best.pt"

print(f"Loading highly-accurate pre-trained YOLO model from: {PRETRAINED_MODEL_URL}")
try:
    model = YOLO(PRETRAINED_MODEL_URL)
    # The pre-trained model might use '0' as the class name, override it for a better UI
    model.names = {0: 'Pothole'}
except Exception as e:
    print(f"Error loading pretrained model: {e}. Falling back to default.")
    model = YOLO("yolo11n.pt")

import yt_dlp

def get_direct_stream_url(source):
    if isinstance(source, str) and ("youtube.com" in source or "youtu.be" in source):
        ydl_opts = {'format': 'best[ext=mp4]/best', 'quiet': True}
        try:
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(source, download=False)
                return info['url']
        except Exception as e:
            print(f"Error extracting YouTube URL: {e}")
            return source
    return source

def generate_frames(source):
    # If source is a YouTube link, extract the raw video stream first
    actual_source = get_direct_stream_url(source)
    cap = cv2.VideoCapture(actual_source)
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break
            
        # Let YOLO use its native, mathematically perfect drawing engine
        results = model(frame, conf=0.15, iou=0.4, verbose=False)
        annotated_frame = results[0].plot()
        
        # Add a scanning overlay so the user knows the AI is running
        if len(results[0].boxes) == 0:
            cv2.putText(annotated_frame, "AI Scanning: No damage detected yet...", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        else:
            cv2.putText(annotated_frame, f"Damages Found: {len(results[0].boxes)}", (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            
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

@router.get("/stream_file")
def stream_file(filename: str):
    """Stream an uploaded video file with YOLO detection"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return {"error": "File not found"}
    return StreamingResponse(generate_frames(file_path), media_type="multipart/x-mixed-replace; boundary=frame")

@router.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file to be streamed back with detections"""
    input_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"message": "Video uploaded successfully", "filename": file.filename}
