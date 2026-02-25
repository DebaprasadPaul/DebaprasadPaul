import os
from rembg import remove
from PIL import Image
import sys

# We only want to process the three new easter egg images
artifact_dir = r"C:\Users\ranap\.gemini\antigravity\brain\8dc673f9-37da-4f68-9ee1-ad4bafcc1be9"
output_dir = r"a:\PORTFOLIO\src\assets\game"

files_to_process = [
    f for f in os.listdir(artifact_dir) 
    if f.startswith(('pixel_mushroom', 'pixel_bird', 'pixel_cartridge')) and f.endswith('.png')
]

if not files_to_process:
    print("No easter egg files found to process.")
    sys.exit(0)

# Sort by modification time to get the latest generated ones if there are duplicates
files_to_process.sort(key=lambda x: os.path.getmtime(os.path.join(artifact_dir, x)), reverse=True)

processed = set()
for filename in files_to_process:
    base_name = filename.split('_')[1] # mushroom, bird, cartridge
    if base_name in processed:
        continue # Skip older versions
    
    input_path = os.path.join(artifact_dir, filename)
    
    # We want consistent names in the src/assets/game folder
    if base_name == 'mushroom':
        output_filename = "SecretMushroom.png"
    elif base_name == 'bird':
        output_filename = "SecretBird.png"
    elif base_name == 'cartridge':
        output_filename = "SecretCartridge.png"
    else:
        continue
        
    output_path = os.path.join(output_dir, output_filename)
    
    print(f"Processing {filename} -> {output_filename}...")
    try:
        input_image = Image.open(input_path)
        # Using rembg to handle the background removal
        output_image = remove(input_image)
        output_image.save(output_path)
        processed.add(base_name)
    except Exception as e:
        print(f"Error processing {filename}: {e}")

print("Done processing easter egg backgrounds.")
