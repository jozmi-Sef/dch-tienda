"""Normaliza las fotos de producto: cuadrado 640x640, relleno con el color del borde, webp liviano.

Uso:  python optimize-images.py
"""
import glob
import os
from PIL import Image

SIZE = 640
FOLDER = os.path.join(os.path.dirname(__file__), "..", "site", "img", "p")


def edge_color(image):
    """Color promedio de los bordes de la imagen (para rellenar sin que se note)."""
    width, height = image.size
    samples = []
    for x in range(0, width, max(1, width // 40)):
        samples.append(image.getpixel((x, 0)))
        samples.append(image.getpixel((x, height - 1)))
    for y in range(0, height, max(1, height // 40)):
        samples.append(image.getpixel((0, y)))
        samples.append(image.getpixel((width - 1, y)))
    return tuple(sum(channel) // len(samples) for channel in zip(*samples))


def process(path):
    image = Image.open(path).convert("RGB")
    background = edge_color(image)
    image.thumbnail((SIZE, SIZE), Image.LANCZOS)

    canvas = Image.new("RGB", (SIZE, SIZE), background)
    canvas.paste(image, ((SIZE - image.width) // 2, (SIZE - image.height) // 2))
    canvas.save(path, "WEBP", quality=80, method=6)


total_before = total_after = 0
for file in sorted(glob.glob(os.path.join(FOLDER, "*.webp"))):
    total_before += os.path.getsize(file)
    process(file)
    total_after += os.path.getsize(file)

print(f"{total_before // 1024} KB -> {total_after // 1024} KB")
