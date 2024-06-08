const productService = require('../services/productService');
const googleBucket = require('../utils/googleBucket');
const formidable = require('formidable');

exports.createProduct = async (req, res) => {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('Error creating product:', err);
        return res.status(400).json({ error: err.message });
      }

      const { file } = files;
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
      } = fields;

      console.log('Request data:', fields);
      console.log('File:', file);

      if (!name || !weight || !calories || !fat || !proteins || !carbohydrate || !sugar || !sodium || !potassium) {
        return res.status(400).json({ error: 'Please provide all required fields' });
      }

      if (!file) {
        return res.status(400).json({ error: 'Please provide an image' });
      }

      const imageUrl = await googleBucket.uploadToGoogleBucket(file);
      const product = await productService.createProduct(
        name,
        parseFloat(weight),
        parseFloat(calories),
        parseFloat(fat),
        parseFloat(proteins),
        parseFloat(carbohydrate),
        parseFloat(sugar),
        parseFloat(sodium),
        parseFloat(potassium),
        imageUrl
      );
      console.log('Product created:', product);
      res.status(200).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: error.message });
    }
  });
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
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(400).json({ error: err.message });
      }

      const { id } = req.params;
      const { file } = files;
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
      } = fields;

      console.log('Request data:', fields);
      console.log('File:', file);

      let imageUrl;
      if (file) {
        imageUrl = await googleBucket.uploadToGoogleBucket(file);
      }

      const product = await productService.updateProduct(
        id,
        name,
        parseFloat(weight),
        parseFloat(calories),
        parseFloat(fat),
        parseFloat(proteins),
        parseFloat(carbohydrate),
        parseFloat(sugar),
        parseFloat(sodium),
        parseFloat(potassium),
        imageUrl
      );
      console.log('Product updated:', product);
      res.status(200).json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(400).json({ error: error.message });
    }
  });
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