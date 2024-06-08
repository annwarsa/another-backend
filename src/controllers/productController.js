const productService = require('../services/productService');
const googleBucket = require('../utils/googleBucket');
const upload = require('../utils/multerConfig');

exports.createProduct = async (req, res) => {
  upload.single('images')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { file } = req;
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
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
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
  upload.single('images')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const { id } = req.params;
      const { file } = req;
      const { name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium } = req.body;

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
      res.status(200).json(product);
    } catch (error) {
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
    res.status(204).json();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
