import os
from ultralytics import YOLO

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_yaml_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'dataset', 'data.yaml'))

    print(f"Using dataset configuration at: {data_yaml_path}")

    model = YOLO('yolo11n.pt')

    # FIXED: imgsz MUST be at least 640 for road damages, and epochs should be at least 50
    results = model.train(
        data=data_yaml_path,
        epochs=100,
        imgsz=640,
        batch=16,
        name='rdd_yolov11',
        project='runs/train',
        workers=4,
        patience=20,
        device=''
    )

    print("Training completed. The best weights are saved inside runs/train/rdd_yolov11/weights/best.pt")

if __name__ == '__main__':
    main()