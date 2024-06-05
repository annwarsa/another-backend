const imageService = require('../services/imageService');

exports.uploadImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const imageUrl = await imageService.uploadImage(req.file, productId, req.userId);
    res.status(201).json({ url: imageUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const images = await imageService.getImages(productId, req.userId);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    await imageService.deleteImage(id, req.userId);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};