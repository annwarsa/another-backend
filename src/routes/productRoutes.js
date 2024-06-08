const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../utils/multerConfig'); 

const router = express.Router();

router.post('/', upload.single('file'), productController.createProduct);
router.get('/', productController.getProducts);
router.get('/id/:id', productController.getProductById);
router.get('/name/:name', productController.getProductByName);
router.put('/:id', upload.single('file'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
