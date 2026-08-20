const path = require('path');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const os = require('os');

// Safely resolve upload directory (handling Vercel read-only filesystem vs local env)
const getUploadsDir = () => {
  try {
    const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const baseDir = isVercel ? os.tmpdir() : path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    return baseDir;
  } catch (err) {
    console.warn('[Uploads Directory Warning] Using temp directory fallback:', err.message);
    return os.tmpdir();
  }
};

// Handle Base64 file upload (fast, reliable, serverless-safe)
router.post('/', (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'No image data provided' });
    }

    // Return Data URLs or HTTP/HTTPS URLs directly (100% serverless safe, no disk write needed)
    if (typeof image === 'string' && (image.startsWith('data:image/') || image.startsWith('http://') || image.startsWith('https://'))) {
      return res.json({
        message: 'Image processed successfully',
        url: image
      });
    }

    // Attempt saving file to temp/uploads folder safely
    const matches = typeof image === 'string' ? image.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/) : null;
    if (!matches) {
      return res.json({ url: image });
    }

    const ext = matches[1];
    const data = matches[2];
    const buffer = Buffer.from(data, 'base64');
    const fileName = `img_${Date.now()}_${Math.floor(Math.random() * 1000)}.${ext}`;
    
    const targetDir = getUploadsDir();
    const filePath = path.join(targetDir, fileName);

    try {
      fs.writeFileSync(filePath, buffer);
    } catch (writeErr) {
      console.warn('[Upload Write Warning] File write fallback to base64 URL:', writeErr.message);
      return res.json({
        message: 'Image processed as Data URL',
        url: image
      });
    }

    const fileUrl = `/uploads/${fileName}`;
    return res.json({
      message: 'File uploaded successfully',
      url: fileUrl
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    res.status(500).json({ message: 'Server error during file upload', error: error.message });
  }
});

module.exports = router;
