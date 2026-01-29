const fs = require('fs');
const path = require('path');

// Create a simple ICO file with a medical cross icon
// ICO format: Header + Directory Entry + Image Data

function createMedicalIcon() {
    const size = 256;
    const bpp = 32; // bits per pixel (RGBA)
    
    // Create RGBA pixel data
    const pixels = [];
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let r, g, b, a;
            
            // Medical blue background
            r = 33;
            g = 150;
            b = 243;
            a = 255;
            
            // White cross
            const isVerticalBar = x >= 96 && x < 160 && y >= 48 && y < 208;
            const isHorizontalBar = x >= 48 && x < 208 && y >= 96 && y < 160;
            
            if (isVerticalBar || isHorizontalBar) {
                r = 255;
                g = 255;
                b = 255;
                a = 255;
            }
            
            // Add rounded corners for modern look
            const centerX = 128;
            const centerY = 128;
            const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            
            if (distFromCenter > 120) {
                a = Math.max(0, 255 - (distFromCenter - 120) * 10);
            }
            
            pixels.push(b, g, r, a); // BMP format is BGRA
        }
    }
    
    // Create BMP data
    const imageDataSize = pixels.length;
    const fileSize = 14 + 40 + imageDataSize; // File header + Info header + Image data
    
    const bmpData = Buffer.alloc(fileSize);
    let offset = 0;
    
    // BMP File Header (14 bytes)
    bmpData.write('BM', offset); offset += 2; // Signature
    bmpData.writeUInt32LE(fileSize, offset); offset += 4; // File size
    bmpData.writeUInt32LE(0, offset); offset += 4; // Reserved
    bmpData.writeUInt32LE(54, offset); offset += 4; // Pixel data offset
    
    // BMP Info Header (40 bytes)
    bmpData.writeUInt32LE(40, offset); offset += 4; // Header size
    bmpData.writeInt32LE(size, offset); offset += 4; // Width
    bmpData.writeInt32LE(size * 2, offset); offset += 4; // Height (doubled for ICO)
    bmpData.writeUInt16LE(1, offset); offset += 2; // Planes
    bmpData.writeUInt16LE(bpp, offset); offset += 2; // Bits per pixel
    bmpData.writeUInt32LE(0, offset); offset += 4; // Compression
    bmpData.writeUInt32LE(imageDataSize, offset); offset += 4; // Image size
    bmpData.writeInt32LE(0, offset); offset += 4; // X pixels per meter
    bmpData.writeInt32LE(0, offset); offset += 4; // Y pixels per meter
    bmpData.writeUInt32LE(0, offset); offset += 4; // Colors used
    bmpData.writeUInt32LE(0, offset); offset += 4; // Important colors
    
    // Write pixel data (bottom-up)
    for (let i = pixels.length - size * 4; i >= 0; i -= size * 4) {
        for (let j = 0; j < size * 4; j++) {
            bmpData[offset++] = pixels[i + j];
        }
    }
    
    // Create ICO file
    const icoSize = 6 + 16 + bmpData.length; // ICO header + directory + image
    const icoData = Buffer.alloc(icoSize);
    offset = 0;
    
    // ICO Header (6 bytes)
    icoData.writeUInt16LE(0, offset); offset += 2; // Reserved
    icoData.writeUInt16LE(1, offset); offset += 2; // Type (1 = ICO)
    icoData.writeUInt16LE(1, offset); offset += 2; // Number of images
    
    // ICO Directory Entry (16 bytes)
    icoData.writeUInt8(0, offset); offset += 1; // Width (0 = 256)
    icoData.writeUInt8(0, offset); offset += 1; // Height (0 = 256)
    icoData.writeUInt8(0, offset); offset += 1; // Color palette
    icoData.writeUInt8(0, offset); offset += 1; // Reserved
    icoData.writeUInt16LE(1, offset); offset += 2; // Color planes
    icoData.writeUInt16LE(bpp, offset); offset += 2; // Bits per pixel
    icoData.writeUInt32LE(bmpData.length, offset); offset += 4; // Image size
    icoData.writeUInt32LE(22, offset); offset += 4; // Image offset
    
    // Copy BMP data
    bmpData.copy(icoData, offset);
    
    return icoData;
}

// Generate and save the icon
const iconData = createMedicalIcon();
const iconPath = path.join(__dirname, 'icon.ico');

fs.writeFileSync(iconPath, iconData);
console.log('✅ Medical icon created successfully at:', iconPath);
console.log('📏 Size: 256x256 pixels');
console.log('🎨 Design: Blue background with white medical cross');
