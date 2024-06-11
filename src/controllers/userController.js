const userService = require('../services/userService');
const googleBucket = require('../utils/googleBucket');
const upload = require('../utils/multerConfig');
const fs = require('fs').promises;
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');

const uploadMiddleware = upload.single('images');

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(400).json({ error: err.message });
    }

    const imageFile = req.file;
    const { username, email } = req.body;

    console.log('Request data:', req.body);
    console.log('File:', imageFile);

    if (!imageFile) {
      console.error('Error: Please provide an image');
      return res.status(400).json({ error: 'Please provide an image' });
    }

    try {
      const imageUrl = await googleBucket.uploadToGoogleBucket(imageFile, uploadsDir, imageFile.filename);
      await fs.unlink(path.join(uploadsDir, imageFile.filename));

      const user = await userService.updateUser(req.params.userId, username, email, imageUrl);
      console.log('User updated:', user);
      res.status(200).json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: error.message });
    }
  });
};