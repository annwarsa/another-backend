const productService = require('../services/productService');
const googleBucket = require('../utils/googleBucket');

exports.createProduct = async (req, res) => {
  try {
    const { name, ukuran, kalori, lemak, protein, karbohidrat, gula, garam, kalium } = req.body;
    const file = req.file;
    const imageUrl = await googleBucket.uploadToGoogleBucket(file);
    const product = await productService.createProduct(
      name,
      ukuran,
      kalori,
      lemak,
      protein,
      karbohidrat,
      gula,
      garam,
      kalium,
      imageUrl
    );
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await productService.getProductByName(name);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ukuran, kalori, lemak, protein, karbohidrat, gula, garam, kalium } = req.body;
    const file = req.file;
    let imageUrl;
    if (file) {
      imageUrl = await googleBucket.uploadToGoogleBucket(file);
    }
    const product = await productService.updateProduct(
      id,
      name,
      ukuran,
      kalori,
      lemak,
      protein,
      karbohidrat,
      gula,
      garam,
      kalium,
      imageUrl
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (product.images) {
      await googleBucket.deleteFromGoogleBucket(product.images);
    }
    await productService.deleteProduct(id);
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};