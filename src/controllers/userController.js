const userService = require('../services/userService');

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
    const { username, email, avatar_src } = req.body;
    const user = await userService.updateUser(req.userId, username, email, avatar_src);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};