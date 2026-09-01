"""
extract_features.py
--------------------
Reads Pascal VOC XML annotations (dataset: annotated-potholes-with-severity-levels),
crops each labeled pothole region out of its source image, extracts numeric
features from the crop, and writes everything to a CSV ready for training.

Supported folder layouts (auto-detected relative to repo root/dataset):
  - dataset/raw_annotations / dataset/raw_images
  - dataset/annotations / dataset/images
  - ai/dataset/annotations / ai/dataset/images

Usage:
    python extract_features.py
"""

import os
import cv2
import numpy as np
import xml.etree.ElementTree as ET
import csv

# ---- paths ----
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))

# Search locations for annotations & images
ANNOTATION_CANDIDATES = [
    os.path.join(PROJECT_ROOT, "dataset", "raw_annotations"),
    os.path.join(PROJECT_ROOT, "dataset", "annotations"),
    os.path.join(SCRIPT_DIR, "..", "dataset", "annotations"),
]

IMAGE_CANDIDATES = [
    os.path.join(PROJECT_ROOT, "dataset", "raw_images"),
    os.path.join(PROJECT_ROOT, "dataset", "images"),
    os.path.join(SCRIPT_DIR, "..", "dataset", "images"),
]

OUTPUT_CSV = os.path.join(SCRIPT_DIR, "severity_features.csv")

# maps the XML <name> value to the severity label we'll train on
SEVERITY_MAP = {
    "minor_pothole": "Low",
    "medium_pothole": "Medium",
    "major_pothole": "High",
}

FEATURE_COLUMNS = [
    "width",
    "height",
    "area",
    "aspect_ratio",
    "mean_intensity",
    "std_intensity",
]


def resolve_paths():
    """Locate existing annotations and images directories."""
    ann_dir = None
    img_dir = None

    for candidate in ANNOTATION_CANDIDATES:
        if os.path.isdir(candidate) and len(os.listdir(candidate)) > 0:
            ann_dir = candidate
            break

    for candidate in IMAGE_CANDIDATES:
        if os.path.isdir(candidate) and len(os.listdir(candidate)) > 0:
            img_dir = candidate
            break

    return ann_dir, img_dir


def extract_features_from_crop(crop):
    """Given a cropped BGR image region, return a dict of numeric features."""
    if crop is None or crop.size == 0:
        return {
            "width": 0,
            "height": 0,
            "area": 0,
            "aspect_ratio": 0.0,
            "mean_intensity": 0.0,
            "std_intensity": 0.0,
        }

    h, w = crop.shape[:2]
    area = h * w
    aspect_ratio = w / h if h > 0 else 0.0

    if len(crop.shape) == 3:
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
    else:
        gray = crop

    mean_intensity = float(np.mean(gray))
    std_intensity = float(np.std(gray))

    return {
        "width": int(w),
        "height": int(h),
        "area": int(area),
        "aspect_ratio": round(aspect_ratio, 3),
        "mean_intensity": round(mean_intensity, 2),
        "std_intensity": round(std_intensity, 2),
    }


def extract_features_from_bbox(image, bbox):
    """
    Extract features from an image given bounding box coordinates.
    bbox format: (xmin, ymin, xmax, ymax)
    """
    xmin, ymin, xmax, ymax = map(int, bbox)
    h, w = image.shape[:2]

    # Clip coordinates to image boundary
    xmin = max(0, min(xmin, w - 1))
    ymin = max(0, min(ymin, h - 1))
    xmax = max(xmin + 1, min(xmax, w))
    ymax = max(ymin + 1, min(ymax, h))

    crop = image[ymin:ymax, xmin:xmax]
    return extract_features_from_crop(crop)


def process_annotation(xml_path, images_dir):
    """Parse one XML file, return a list of feature-rows (one per <object>)."""
    try:
        tree = ET.parse(xml_path)
        root = tree.getroot()
    except Exception as e:
        print(f"  [error] XML parse error {xml_path}: {e}")
        return []

    filename_elem = root.find("filename")
    if filename_elem is None or not filename_elem.text:
        return []

    filename = filename_elem.text
    image_path = os.path.join(images_dir, filename)

    if not os.path.exists(image_path):
        # Try finding image with common extensions
        base_name = os.path.splitext(filename)[0]
        found = False
        for ext in [".jpg", ".png", ".jpeg"]:
            alt_path = os.path.join(images_dir, base_name + ext)
            if os.path.exists(alt_path):
                image_path = alt_path
                filename = base_name + ext
                found = True
                break
        if not found:
            return []

    image = cv2.imread(image_path)
    if image is None:
        return []

    rows = []
    for obj in root.findall("object"):
        name_elem = obj.find("name")
        if name_elem is None:
            continue
        class_name = name_elem.text
        severity = SEVERITY_MAP.get(class_name)
        if severity is None:
            continue

        bnd = obj.find("bndbox")
        if bnd is None:
            continue

        xmin = int(float(bnd.find("xmin").text))
        ymin = int(float(bnd.find("ymin").text))
        xmax = int(float(bnd.find("xmax").text))
        ymax = int(float(bnd.find("ymax").text))

        crop = image[ymin:ymax, xmin:xmax]
        if crop.size == 0:
            continue

        features = extract_features_from_crop(crop)
        features["filename"] = filename
        features["severity"] = severity
        rows.append(features)

    return rows


def main():
    ann_dir, img_dir = resolve_paths()

    if not ann_dir or not img_dir:
        print(f"Error: Could not find annotations and images directories.")
        print(f"Checked annotation candidates: {ANNOTATION_CANDIDATES}")
        print(f"Checked image candidates: {IMAGE_CANDIDATES}")
        return

    print(f"Using annotations from: {ann_dir}")
    print(f"Using images from:      {img_dir}")

    xml_files = [f for f in os.listdir(ann_dir) if f.endswith(".xml")]
    print(f"Found {len(xml_files)} annotation files")

    all_rows = []
    for i, xml_file in enumerate(xml_files, 1):
        xml_path = os.path.join(ann_dir, xml_file)
        rows = process_annotation(xml_path, img_dir)
        all_rows.extend(rows)
        if i % 100 == 0:
            print(f"  processed {i}/{len(xml_files)} files...")

    print(f"\nExtracted {len(all_rows)} labeled pothole regions total")

    if not all_rows:
        print("No rows extracted — check annotations.")
        return

    fieldnames = ["filename"] + FEATURE_COLUMNS + ["severity"]
    with open(OUTPUT_CSV, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"Saved features to {OUTPUT_CSV}")

    from collections import Counter
    counts = Counter(r["severity"] for r in all_rows)
    print("Severity distribution:", dict(counts))


if __name__ == "__main__":
    main()