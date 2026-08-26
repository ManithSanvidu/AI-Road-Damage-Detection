import os
import argparse
from ultralytics import YOLO

def main(image_path,model_path):
    if not os.path.exist(image_path):
        return 

    if not os.path.exists(model_path):
        print(f"Error: Model weights not found at {model_path}")
        print("Please ensure you have trained the model first!")
        return

    print(f"Loading YOLO model from {model_path}...")
    model=YOLO(model_path)

    print(f"Running inference on {image_path}...")

    results=model.predict(
        source=image_path,
        conf=0.25,
        save=True,
        project='runs/predict',
        name='rdd_inference' 
    )

    for result in results:
        boxes=result.boxes
        if len(boxes)==0:
            print("\nResult: No road damage detected.")
        else:
            print(f"\nResult: Detected {len(boxes)} damage(s)")

            for box in boxes:
                cls_id=int(box.cls[0])
                conf=float(box.conf[0])
                class_name=model.names[cls_id]
                print(f"-{class_name}: {conf*100:.2f}% confidence")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Test YOLOv11 Road Damage Detection Model")
    
    parser.add_argument('--image', type=str, required=True, 
                        help='Path to the test image')

    parser.add_argument('--weights', type=str, default='../training/runs/train/rdd_yolov11/weights/best.pt', 
                        help='Path to the trained YOLO weights (best.pt)')
    
    args = parser.parse_args()
    main(args.image, args.weights)