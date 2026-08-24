import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

SOURCE_IMAGE = r"C:\Users\Ankit\.gemini\antigravity-ide\brain\7d50976b-5857-428e-9163-4c7fbf779c8b\biosphere_favicon_1787540724141.jpg"
WORKSPACE_DIR = r"c:\Users\Ankit\OneDrive\Desktop\All Projects\Biosphere\biosphere"

def main():
    if not os.path.exists(SOURCE_IMAGE):
        print(f"Error: Source image not found at {SOURCE_IMAGE}")
        sys.exit(1)

    img = Image.open(SOURCE_IMAGE).convert("RGBA")
    w, h = img.size

    # Subtle contrast and color enhancement for crisp visibility at small icon sizes
    enhancer = ImageEnhance.Sharpness(img)
    img_sharp = enhancer.enhance(1.3)

    enhancer_color = ImageEnhance.Color(img_sharp)
    img_vibrant = enhancer_color.enhance(1.15)

    # Let's create high quality resized versions
    # Target directories
    app_dir = os.path.join(WORKSPACE_DIR, "src", "app")
    public_dir = os.path.join(WORKSPACE_DIR, "public")
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(app_dir, exist_ok=True)

    # 1. High-res master icon (512x512)
    img_512 = img_vibrant.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save(os.path.join(app_dir, "icon.png"), format="PNG", optimize=True)
    img_512.save(os.path.join(public_dir, "icon.png"), format="PNG", optimize=True)
    img_512.save(os.path.join(public_dir, "android-chrome-512x512.png"), format="PNG", optimize=True)
    img_512.save(os.path.join(public_dir, "favicon.png"), format="PNG", optimize=True)

    # 2. 192x192
    img_192 = img_vibrant.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save(os.path.join(public_dir, "android-chrome-192x192.png"), format="PNG", optimize=True)

    # 3. Apple Touch Icon (180x180)
    img_180 = img_vibrant.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save(os.path.join(app_dir, "apple-icon.png"), format="PNG", optimize=True)
    img_180.save(os.path.join(public_dir, "apple-touch-icon.png"), format="PNG", optimize=True)

    # 4. Standard PNG Favicons (32x32 & 16x16 & 48x48)
    img_48 = img_vibrant.resize((48, 48), Image.Resampling.LANCZOS)
    img_32 = img_vibrant.resize((32, 32), Image.Resampling.LANCZOS)
    img_16 = img_vibrant.resize((16, 16), Image.Resampling.LANCZOS)

    img_32.save(os.path.join(public_dir, "favicon-32x32.png"), format="PNG", optimize=True)
    img_16.save(os.path.join(public_dir, "favicon-16x16.png"), format="PNG", optimize=True)

    # 5. Multi-resolution ICO (16, 32, 48, 64)
    img_64 = img_vibrant.resize((64, 64), Image.Resampling.LANCZOS)
    
    ico_path_app = os.path.join(app_dir, "favicon.ico")
    ico_path_public = os.path.join(public_dir, "favicon.ico")
    
    img_64.save(
        ico_path_app,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=[img_48, img_32, img_16]
    )
    img_64.save(
        ico_path_public,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64)],
        append_images=[img_48, img_32, img_16]
    )

    print("Successfully generated all favicon assets!")

if __name__ == "__main__":
    main()
