const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const mimeType = mime.lookup(file.originalname);
  if (!mimeType) {
    return cb(new Error('Invalid file type'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;