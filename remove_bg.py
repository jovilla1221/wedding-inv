from PIL import Image

def remove_background(input_path, output_path, tolerance=50):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # Assume the top-left pixel is the background color
    bg_color = data[0]
    
    new_data = []
    for item in data:
        # Check if pixel is close to background color
        if abs(item[0] - bg_color[0]) < tolerance and \
           abs(item[1] - bg_color[1]) < tolerance and \
           abs(item[2] - bg_color[2]) < tolerance:
            # Change background to transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_background("src/assets/cakra_jawa.png", "src/assets/cakra_jawa.png")
print("Background removed successfully.")
