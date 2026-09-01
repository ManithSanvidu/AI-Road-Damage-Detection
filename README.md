[README.md](https://github.com/user-attachments/files/31698053/README.md)
# 🛣️ AI Road Damage Detection System

An end-to-end Machine Learning and web application designed to automatically detect and classify road damages (like potholes and alligator cracks) using computer vision. 

The system processes static images, pre-recorded videos, live camera feeds, and network streams, providing a modern dashboard to visualize the health of road infrastructure on a real-time geographical map.

---

## 🌟 Features

* **Real-time YOLOv11 Object Detection**: Fast, high-accuracy detection of various road damages.
* **Modern React Dashboard**: A beautiful, macOS-inspired UI built with TailwindCSS.
* **Live Video & Camera Analysis**: Stream your webcam directly to the AI to see bounding boxes drawn in real-time, or upload MP4 videos for background processing.
* **Interactive Map View**: Uses `react-leaflet` to geographically pinpoint where damages were detected, allowing city planners to prioritize repairs.
* **Image Analysis**: Drag and drop static images to receive instant AI predictions.
* **RESTful FastAPI Backend**: Extremely fast Python backend handling model inference, streaming multipart responses, and database management.

---

## 🏗️ Architecture

The project is split into three main components:

1. **`frontend/` (React + Vite)**
   * Built with React, TailwindCSS, React-Router, and Leaflet.
   * Provides the user interface, sidebar navigation, and interactive dashboards.
2. **`backend/` (FastAPI + OpenCV)**
   * Exposes API endpoints for image/video uploading and real-time MJPEG streaming.
   * Manages user authentication and database storage using SQLAlchemy.
   * Loads the trained YOLO model via the `ultralytics` package to run inference.
3. **`ai/` (Training Pipeline)**
   * Contains the scripts used to prepare the dataset, convert VOC XML annotations to YOLO format, and train the custom YOLOv11 model.

---

## 🚀 Getting Started

To run the full system on your local machine, you need to start the backend and frontend separately.

### 1. Start the Backend (FastAPI)
Open a terminal and run:
```powershell
# Navigate to the project root
cd AI-Road-Damage-Detection

# Activate the Python virtual environment
.\.venv\Scripts\activate

# Move into the backend folder
cd backend

# Start the FastAPI server
uvicorn app.main:app --reload
```
*The API will be available at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.*

### 2. Start the Frontend (React)
Open a **second** terminal window and run:
```powershell
# Navigate to the frontend folder
cd AI-Road-Damage-Detection\frontend

# Install dependencies (if you haven't already)
npm install

# Start the development server
npm run dev
```
*The web dashboard will be available at `http://localhost:5173`.*

---

## 🧠 AI Training Pipeline

If you want to retrain the AI model with new data:
1. Place your images in `dataset/raw_images` and XML annotations in `dataset/raw_annotations`.
2. Run `python ai/preprocessing/organize_dataset.py` to automatically generate the YOLO `.txt` label files and split the data into `train/` and `val/` folders.
3. Run `python ai/training/train_detection.py` to begin training the YOLOv11 model. The best weights will be saved to `ai/training/runs/train/.../weights/best.pt`.

---

## 🛠️ Tech Stack

* **Machine Learning**: Ultralytics (YOLOv11), OpenCV, PyTorch
* **Backend**: Python, FastAPI, SQLAlchemy, Uvicorn
* **Frontend**: React, Vite, TailwindCSS, Lucide-React, React-Leaflet
