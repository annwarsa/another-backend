const userService = require('../services/userService');
const googleBucket = require('../utils/googleBucket');
const upload = require('../utils/multerConfig');


exports.getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.userId);
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
      if (!file) {
        return res.status(400).json({ error: 'Please provide an image' });
      }

      const imageUrl = await googleBucket.uploadToGoogleBucket(file);
      const { username, email } = req.body;
      const user = await userService.updateUser(req.userId, username, email, imageUrl);
      res.status(200).json(user)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};