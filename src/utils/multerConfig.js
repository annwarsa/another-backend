const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileType = require('file-type'); 

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
  mimetype: async (req, file, cb) => {
    const fileData = await fileType.fromBuffer(file.buffer);
    cb(null, fileData ? fileData.mime : 'application/octet-stream');
  },
});

// Create the Multer instance
const upload = multer({ storage });

module.exports = upload;