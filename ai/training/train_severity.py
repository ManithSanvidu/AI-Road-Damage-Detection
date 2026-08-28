"""
train_severity.py
-----------------
Trains a Random Forest classifier to predict road damage severity (Low, Medium, High)
based on extracted geometric and visual features.

Saves the trained model to ai/models/severity_model.joblib.

Usage:
    python train_severity.py
"""

import os
import sys
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PREPROCESSING_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "preprocessing"))
CSV_PATH = os.path.join(PREPROCESSING_DIR, "severity_features.csv")
MODELS_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "models"))
MODEL_PATH = os.path.join(MODELS_DIR, "severity_model.joblib")

FEATURE_COLUMNS = [
    "width",
    "height",
    "area",
    "aspect_ratio",
    "mean_intensity",
    "std_intensity",
]


def generate_synthetic_dataset(num_samples=300):
    """Generate realistic synthetic feature data for demonstration if CSV is not available."""
    np.random.seed(42)
    rows = []

    # Low severity: small area, lower variance
    for _ in range(num_samples // 3):
        w = np.random.randint(20, 100)
        h = np.random.randint(20, 100)
        area = w * h
        aspect_ratio = round(w / h, 3)
        mean_int = round(np.random.uniform(90, 160), 2)
        std_int = round(np.random.uniform(10, 30), 2)
        rows.append({
            "filename": "synth_low.jpg",
            "width": w,
            "height": h,
            "area": area,
            "aspect_ratio": aspect_ratio,
            "mean_intensity": mean_int,
            "std_intensity": std_int,
            "severity": "Low"
        })

    # Medium severity: moderate area & intensity variance
    for _ in range(num_samples // 3):
        w = np.random.randint(80, 250)
        h = np.random.randint(80, 250)
        area = w * h
        aspect_ratio = round(w / h, 3)
        mean_int = round(np.random.uniform(70, 140), 2)
        std_int = round(np.random.uniform(25, 55), 2)
        rows.append({
            "filename": "synth_medium.jpg",
            "width": w,
            "height": h,
            "area": area,
            "aspect_ratio": aspect_ratio,
            "mean_intensity": mean_int,
            "std_intensity": std_int,
            "severity": "Medium"
        })

    # High severity: large area, high intensity contrast/variance
    for _ in range(num_samples // 3):
        w = np.random.randint(200, 550)
        h = np.random.randint(200, 550)
        area = w * h
        aspect_ratio = round(w / h, 3)
        mean_int = round(np.random.uniform(40, 120), 2)
        std_int = round(np.random.uniform(50, 95), 2)
        rows.append({
            "filename": "synth_high.jpg",
            "width": w,
            "height": h,
            "area": area,
            "aspect_ratio": aspect_ratio,
            "mean_intensity": mean_int,
            "std_intensity": std_int,
            "severity": "High"
        })

    return pd.DataFrame(rows)


def load_dataset():
    """Load extracted CSV or fallback to automated extraction/synthetic data."""
    if os.path.exists(CSV_PATH):
        df = pd.read_csv(CSV_PATH)
        if not df.empty and "severity" in df.columns:
            print(f"Loaded {len(df)} samples from {CSV_PATH}")
            return df

    # Try running extract_features script first if CSV doesn't exist yet
    sys.path.append(PREPROCESSING_DIR)
    try:
        import extract_features
        print("CSV not found. Attempting to extract features from dataset...")
        extract_features.main()
        if os.path.exists(CSV_PATH):
            df = pd.read_csv(CSV_PATH)
            if not df.empty:
                return df
    except Exception as e:
        print(f"Feature extraction note: {e}")

    print("Generating synthetic feature dataset for initial training...")
    df = generate_synthetic_dataset()
    return df


def main():
    os.makedirs(MODELS_DIR, exist_ok=True)
    df = load_dataset()

    X = df[FEATURE_COLUMNS]
    y = df["severity"]

    print(f"\nDataset Severity Distribution:\n{y.value_counts()}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y if len(y.unique()) > 1 else None
    )

    print("\nTraining Random Forest Severity Classifier...")
    clf = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight="balanced"
    )
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n--- Model Evaluation ---")
    print(f"Accuracy: {accuracy * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    print("Feature Importances:")
    for col, imp in zip(FEATURE_COLUMNS, clf.feature_importances_):
        print(f"  {col:15s}: {imp:.4f}")

    # Save model artifact bundle
    model_bundle = {
        "model": clf,
        "feature_columns": FEATURE_COLUMNS,
        "classes": clf.classes_.tolist()
    }
    joblib.dump(model_bundle, MODEL_PATH)
    print(f"\nTrained model successfully saved to:\n  {MODEL_PATH}")


if __name__ == "__main__":
    main()
