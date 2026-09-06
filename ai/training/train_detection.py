import os
from ultralytics import YOLO

def main():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_yaml_path = os.path.abspath(os.path.join(current_dir, '..', '..', 'dataset', 'data.yaml'))

    print(f"Using dataset configuration at: {data_yaml_path}")

    model = YOLO('yolo11n.pt')

    # FIXED: imgsz adjusted to 416 and batch to 2 to prevent CPU Out of Memory crashes
    results = model.train(
        data=data_yaml_path,
        epochs=100,
        imgsz=416,
        batch=2,
        name='rdd_yolov11',
        project='runs/train',
        workers=0,
        patience=20,
        device=''
    )

    print("Training completed. The best weights are saved inside runs/train/rdd_yolov11/weights/best.pt")

if __name__ == '__main__':
    main()