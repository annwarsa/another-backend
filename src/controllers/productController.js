const productService = require('../services/productService');
const googleBucket = require('../utils/googleBucket');
const upload = require('../utils/multerConfig');
const fs = require('fs').promises;
const path = require('path');

// Define the fixed upload path
const uploadsDir = path.join(__dirname, '..', 'uploads');

exports.createProduct = async (req, res) => {
  try {
    upload.single('images')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(400).json({ error: err.message });
      }

      const imageFile = req.file;
      const {
        name,
        weight,
        calories,
        fat,
        proteins,
        carbohydrate,
        sugar,
        sodium,
        potassium,
      } = req.body;

      console.log('Request data:', req.body);
      console.log('File:', imageFile);

      // Validate required fields
      const requiredFields = { name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          return res.status(400).json({ error: `Please provide ${key}` });
        }
      }

      if (!imageFile) {
        return res.status(400).json({ error: 'Please provide an image' });
      }

      // Pass the correct file path to the uploadToGoogleBucket function
      const imageUrl = await googleBucket.uploadToGoogleBucket(imageFile, uploadsDir, imageFile.filename);
      const product = await productService.createProduct({
        name,
        weight: parseFloat(weight),
        calories: parseFloat(calories),
        fat: parseFloat(fat),
        proteins: parseFloat(proteins),
        carbohydrate: parseFloat(carbohydrate),
        sugar: parseFloat(sugar),
        sodium: parseFloat(sodium),
        potassium: parseFloat(potassium),
        imageUrl,
      });
      console.log('Product created:', product);

      await fs.unlink(path.join(uploadsDir, imageFile.filename));

      res.status(200).json(product);
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts();
    console.log('Products:', products);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const product = await productService.getProductByName(name);
    console.log('Product:', product);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product by name:', error);
    res.status(404).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    console.log('Product:', product);
    res.status(200).json(product);
  } catch (error) {
    console.error('Error getting product by id:', error);
    res.status(404).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    upload.single('images')(req, res, async (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(400).json({ error: err.message });
      }

      const { id } = req.params;
      const imageFile = req.file;
      const {
        name,
        weight,
        calories,
        fat,
        proteins,
        carbohydrate,
        sugar,
        sodium,
        potassium,
      } = req.body;

      console.log('Request data:', req.body);
      console.log('File:', imageFile);

      let imageUrl;
      if (imageFile) {
        imageUrl = await googleBucket.uploadToGoogleBucket(imageFile, uploadsDir, imageFile.filename);
        await fs.unlink(path.join(uploadsDir, imageFile.filename));
      }

      const product = await productService.updateProduct(
        id,
        {
          name,
          weight: parseFloat(weight),
          calories: parseFloat(calories),
          fat: parseFloat(fat),
          proteins: parseFloat(proteins),
          carbohydrate: parseFloat(carbohydrate),
          sugar: parseFloat(sugar),
          sodium: parseFloat(sodium),
          potassium: parseFloat(potassium),
          imageUrl,
        }
      );
      console.log('Product updated:', product);
      res.status(200).json(product);
    });
  } catch (error) {
    console.error('Error updating product:', error);
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
    console.log('Product deleted:', id);
    res.status(204).json();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(400).json({ error: error.message });
  }
};
