const productService = require('../services/productService');
const googleBucket = require('../utils/googleBucket');

const validateProductFields = (fields) => {
  const requiredFields = ['name', 'weight', 'calories', 'fat', 'proteins', 'carbohydrate', 'sugar', 'sodium', 'potassium'];
  for (const field of requiredFields) {
    if (!fields[field]) {
      return false;
    }
  }
  return true;
};

exports.createProduct = async (req, res) => {
  try {
    const { file, body } = req;
    if (!validateProductFields(body)) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }
    if (!file) {
      return res.status(400).json({ error: 'Please provide an image' });
    }

    const imageUrl = await googleBucket.uploadToGoogleBucket(file);
    const product = await productService.createProduct({ ...body, imageUrl });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { file, body } = req;

    let imageUrl;
    if (file) {
      imageUrl = await googleBucket.uploadToGoogleBucket(file);
    }

    const product = await productService.updateProduct(id, { ...body, imageUrl });
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
