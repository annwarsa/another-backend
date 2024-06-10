// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

// Create the uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
  mimetype: (req, file, cb) => {
    const mimetype = mime.lookup(file.originalname) || 'application/octet-stream';
    cb(null, mimetype);
  },
});

// Create the Multer instance
const upload = multer({ storage });

module.exports = upload;