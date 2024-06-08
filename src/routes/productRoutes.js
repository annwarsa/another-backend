const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../utils/multerConfig');

const router = express.Router();

router.post('/', productController.createProduct, upload.single('imageUrl'), (req, res) => {
    console.log('Body:', req.body); // Check form fields
    console.log('File:', req.file); // Check uploaded file
    res.send('File uploaded successfully!');
  });
router.get('/', productController.getProducts);
router.get('/id/:id', productController.getProductById);
router.get('/name/:name', productController.getProductByName);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
