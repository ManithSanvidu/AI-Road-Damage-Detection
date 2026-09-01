"""
predict_severity.py
-------------------
Inference script for predicting road damage severity (Low, Medium, High)
given a cropped damage image or an image with bounding box coordinates.

Usage:
    # Test execution:
    python predict_severity.py --test

    # Run on image + bounding box (xmin ymin xmax ymax):
    python predict_severity.py --image path/to/image.jpg --bbox 100 150 400 350
"""

import os
import sys
import argparse
import cv2
import joblib
import pandas as pd
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PREPROCESSING_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "preprocessing"))
MODELS_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "models"))
DEFAULT_MODEL_PATH = os.path.join(MODELS_DIR, "severity_model.joblib")

sys.path.append(PREPROCESSING_DIR)
from extract_features import extract_features_from_crop, extract_features_from_bbox, FEATURE_COLUMNS


class SeverityPredictor:
    """Predictor class for loading the severity model and performing inference."""

    def __init__(self, model_path=DEFAULT_MODEL_PATH):
        self.model_path = model_path
        self.model = None
        self.feature_columns = FEATURE_COLUMNS
        self.classes = ["Low", "Medium", "High"]
        self._load_model()

    def _load_model(self):
        if not os.path.exists(self.model_path):
            print(f"Model file not found at {self.model_path}. Attempting to train model first...")
            training_dir = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "training"))
            sys.path.append(training_dir)
            try:
                import train_severity
                train_severity.main()
            except Exception as e:
                raise FileNotFoundError(f"Could not load or train severity model: {e}")

        bundle = joblib.load(self.model_path)
        if isinstance(bundle, dict):
            self.model = bundle["model"]
            self.feature_columns = bundle.get("feature_columns", FEATURE_COLUMNS)
            self.classes = bundle.get("classes", self.classes)
        else:
            self.model = bundle

    def predict_crop(self, crop):
        """Predict severity for a cropped BGR image array."""
        features = extract_features_from_crop(crop)
        return self._predict_from_features(features)

    def predict_bbox(self, image, bbox):
        """Predict severity given full BGR image and bbox=(xmin, ymin, xmax, ymax)."""
        features = extract_features_from_bbox(image, bbox)
        return self._predict_from_features(features)

    def _predict_from_features(self, features):
        df_feat = pd.DataFrame([features])[self.feature_columns]
        prediction = self.model.predict(df_feat)[0]

        confidence = 1.0
        probabilities = {}
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(df_feat)[0]
            confidence = float(np.max(probs))
            probabilities = {cls: round(float(p), 4) for cls, p in zip(self.model.classes_, probs)}

        return {
            "severity": str(prediction),
            "confidence": round(confidence, 4),
            "probabilities": probabilities,
            "features": features
        }


def run_test():
    """Run test predictions on mock damage crops of varying sizes."""
    print("\n--- Running Severity Predictor Diagnostic Test ---")
    predictor = SeverityPredictor()

    test_crops = {
        "Small Pothole (Expected: Low)": np.full((35, 40, 3), 130, dtype=np.uint8),
        "Medium Pothole (Expected: Medium)": np.full((140, 160, 3), 90, dtype=np.uint8),
        "Large Pothole (Expected: High)": np.full((350, 400, 3), 60, dtype=np.uint8),
    }

    for name, crop in test_crops.items():
        result = predictor.predict_crop(crop)
        print(f"\n[Test Case] {name}")
        print(f"  Predicted Severity: {result['severity']} (Confidence: {result['confidence'] * 100:.1f}%)")
        print(f"  Class Probabilities: {result['probabilities']}")
        print(f"  Features: {result['features']}")

    print("\nPredictor diagnostic test passed successfully!")


def main():
    parser = argparse.ArgumentParser(description="Road Damage Severity Classifier Inference")
    parser.add_argument("--image", type=str, help="Path to input image")
    parser.add_argument("--bbox", type=int, nargs=4, metavar=("XMIN", "YMIN", "XMAX", "YMAX"),
                        help="Bounding box coordinates: xmin ymin xmax ymax")
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL_PATH, help="Path to trained model.joblib")
    parser.add_argument("--test", action="store_true", help="Run automated test suite")

    args = parser.parse_args()

    if args.test:
        run_test()
        return

    if not args.image:
        print("Usage error: Please provide --image and --bbox, or run with --test.")
        print("Example: python predict_severity.py --test")
        return

    if not os.path.exists(args.image):
        print(f"Error: Image file not found at {args.image}")
        return

    image = cv2.imread(args.image)
    if image is None:
        print(f"Error: Unable to load image {args.image}")
        return

    predictor = SeverityPredictor(model_path=args.model)

    if args.bbox:
        result = predictor.predict_bbox(image, args.bbox)
        print(f"\nImage: {args.image}")
        print(f"BBox: {args.bbox}")
        print(f"Severity Prediction: {result['severity']} ({result['confidence'] * 100:.1f}% confidence)")
        print(f"Probabilities: {result['probabilities']}")
        print(f"Features: {result['features']}")
    else:
        # Predict on entire image crop
        result = predictor.predict_crop(image)
        print(f"\nImage: {args.image} (Full Image Crop)")
        print(f"Severity Prediction: {result['severity']} ({result['confidence'] * 100:.1f}% confidence)")
        print(f"Probabilities: {result['probabilities']}")


if __name__ == "__main__":
    main()
