const path = require('path');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: recursive = true });
}

// Handle Base64 file upload (fast, reliable, no external dependencies required)
router.post('/', (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // If it's already a Data URL or external HTTP URL, return as is
    if (image.startsWith('data:image/') || image.startsWith('http://') || image.startsWith('https://')) {
      return res.json({
        message: 'Image processed successfully',
        url: image
      });
    }

    // Save base64 image as file on disk
    const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      return res.json({ url: image });
    }

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;
    return res.json({
      message: 'File uploaded successfully to server',
      url: fileUrl
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    res.status(500).json({ message: 'Server error during file upload' });
  }
});

module.exports = router;
