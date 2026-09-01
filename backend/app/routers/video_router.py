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

# Dynamically find the most recent best.pt in the runs directory
search_pattern = os.path.join(BASE_DIR, "ai", "training", "**", "best.pt")
model_files = glob.glob(search_pattern, recursive=True)

if not model_files:
    print("Warning: No best.pt found in the ai/training directory! Falling back to default yolo11n.pt")
    model = YOLO("yolo11n.pt")
else:
    # Sort by modification time to get the most recently trained model
    latest_model_path = max(model_files, key=os.path.getmtime)
    print(f"Loading latest custom YOLO model from: {latest_model_path}")
    try:
        model = YOLO(latest_model_path)
    except Exception as e:
        print(f"Error loading {latest_model_path}: {e}. Falling back to default.")
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
            
        results = model(frame, conf=0.01, iou=0.4, imgsz=640, verbose=False)
        annotated_frame = frame.copy()
        
        # Shrink factor for the bounding boxes to make them fit tighter (e.g. 80% of original size)
        shrink_factor = 0.8
        
        for box in results[0].boxes:
            x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
            conf = float(box.conf[0])
            cls_id = int(box.cls[0])
            name = model.names[cls_id]
            
            # Calculate center and new width/height to make the box tighter
            cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
            w, h = (x2 - x1) * shrink_factor, (y2 - y1) * shrink_factor
            
            nx1, ny1 = int(cx - w / 2), int(cy - h / 2)
            nx2, ny2 = int(cx + w / 2), int(cy + h / 2)
            
            # Draw the tighter custom box and label
            cv2.rectangle(annotated_frame, (nx1, ny1), (nx2, ny2), (0, 165, 255), 2) # Orange box
            cv2.putText(annotated_frame, f"{name} {conf:.2f}", (nx1, ny1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 165, 255), 2)
            
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
