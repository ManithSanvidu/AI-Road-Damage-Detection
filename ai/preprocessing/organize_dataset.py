import os 
import glob
import xml.etree.ElementTree as ET
import shutil
from sklearn.model_selection import train_test_split

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_IMAGE_DIR = os.path.join(BASE_DIR, '..', '..', 'dataset', 'raw_images')
RAW_XML_DIR = os.path.join(BASE_DIR, '..', '..', 'dataset', 'raw_annotations')
OUTPUT_BASE = os.path.join(BASE_DIR, '..', '..', 'dataset')

CLASS_MAPPING = {
    'D00': 0, # Longitudinal Crack
    'D10': 1, # Transverse Crack
    'D20': 2, # Alligator Crack
    'D40': 3  # Pothole
}

def convert_to_yolo(size,box):
    dw=1./size[0]
    dh=1./size[1]

    x_center = (box[0] + box[1]) / 2.0
    y_center = (box[2] + box[3]) / 2.0
    w = box[1] - box[0]
    h = box[3] - box[2]

    x = x_center * dw
    w = w * dw
    y = y_center * dh
    h = h * dh
    
    return (x, y, w, h)

def process_xml(xml_file, output_txt_path):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    size = root.find('size')
    w = int(size.find('width').text)
    h = int(size.find('height').text)
    
    yolo_annotations = []
    
    for obj in root.iter('object'):
        cls_name = obj.find('name').text
        if cls_name not in CLASS_MAPPING:
            continue
            
        cls_id = CLASS_MAPPING[cls_name]
        xmlbox = obj.find('bndbox')
        b = (float(xmlbox.find('xmin').text), float(xmlbox.find('xmax').text), 
             float(xmlbox.find('ymin').text), float(xmlbox.find('ymax').text))
             
        yolo_box = convert_to_yolo((w, h), b)
        yolo_annotations.append(f"{cls_id} {' '.join([str(a) for a in yolo_box])}\n")
        
    with open(output_txt_path, 'w') as f:
        f.writelines(yolo_annotations)
        
def setup_directories():
    """Creates the YOLO images and labels folder structures"""
    for split in ['train', 'val']:
        for dtype in ['images', 'labels']:
            os.makedirs(os.path.join(OUTPUT_BASE, dtype, split), exist_ok=True)
def main():
    setup_directories()

    xml_files = glob.glob(os.path.join(RAW_XML_DIR, '*.xml'))
    if not xml_files:
        print("No XML files found. Check your RAW_XML_DIR.")
        return
        
    # Split 80% train / 20% validation
    train_files, val_files = train_test_split(xml_files, test_size=0.2, random_state=42)
    
    def process_split(files, split_name):
        for xml_path in files:
            base_name = os.path.basename(xml_path).replace('.xml', '')
       
            img_path = os.path.join(RAW_IMAGE_DIR, f"{base_name}.jpg") 
            
            if not os.path.exists(img_path):
                print(f"Warning: Image not found for {xml_path}")
                continue
                
            out_label = os.path.join(OUTPUT_BASE, 'labels', split_name, f"{base_name}.txt")
            out_image = os.path.join(OUTPUT_BASE, 'images', split_name, f"{base_name}.jpg")
            
            process_xml(xml_path, out_label)
            shutil.copy(img_path, out_image)
            
    print("Processing training data...")
    process_split(train_files, 'train')
    
    print("Processing validation data...")
    process_split(val_files, 'val')
    
    print("Dataset organization complete! Data is ready for YOLO format.")
if __name__ == '__main__':
    main()