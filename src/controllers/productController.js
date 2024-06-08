const Busboy = require('busboy');
const productService = require('../services/productService');
const googleBucket = require('../utils/googleBucket');

exports.createProduct = async (req, res) => {
  try {
    const busboy = new Busboy({ headers: req.headers });
    let fields = {};
    let fileData = null;

    busboy.on('file', (fieldname, file, _filename, _encoding, _mimetype) => {
      if (fieldname === 'images') {
        const chunks = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });
        file.on('end', () => {
          fileData = Buffer.concat(chunks);
        });
      } else {
        file.resume();
      }
    });

    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on('finish', async () => {
      const { name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium } = fields;
      if (!name || !weight || !calories || !fat || !proteins || !carbohydrate || !sugar || !sodium || !potassium) {
        return res.status(400).json({ error: 'Please provide all required fields' });
      }

      if (!fileData) {
        return res.status(400).json({ error: 'Please provide an image' });
      }

      const imageUrl = await googleBucket.uploadToGoogleBucket(fileData);
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
    });

    busboy.on('error', (err) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    req.pipe(busboy);
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
    const busboy = new Busboy({ headers: req.headers });
    let fields = {};
    let fileData = null;

    busboy.on('file', (fieldname, file, _filename, _encoding, _mimetype) => {
      if (fieldname === 'images') {
        const chunks = [];
        file.on('data', (chunk) => {
          chunks.push(chunk);
        });
        file.on('end', () => {
          fileData = Buffer.concat(chunks);
        });
      } else {
        file.resume();
      }
    });

    busboy.on('field', (fieldname, value) => {
      fields[fieldname] = value;
    });

    busboy.on('finish', async () => {
      const { name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium } = fields;
      let imageUrl;
      if (fileData) {
        imageUrl = await googleBucket.uploadToGoogleBucket(fileData);
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
    });

    busboy.on('error', (err) => {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    req.pipe(busboy);
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