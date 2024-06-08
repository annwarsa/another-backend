const userService = require('../services/userService');
const googleBucket = require('../utils/googleBucket');
const upload = require('../utils/multerConfig');

exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    upload.single('images')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const file = req.file;
      let imageUrl;

      if (file) {
        try {
          imageUrl = await googleBucket.uploadToGoogleBucket(file);
        } catch (uploadError) {
          return res.status(500).json({ error: 'Failed to upload image' });
        }
      }

      const { username, email } = req.body;
      const user = await userService.updateUser(req.params.userId, username, email, imageUrl);
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
