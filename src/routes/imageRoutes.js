const express = require('express');
const multer = require('multer');
const imageController = require('../controllers/imageController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/:productId', upload.single('image'), imageController.uploadImage);
router.get('/:productId', imageController.getImages);
router.delete('/:id', imageController.deleteImage);

module.exports = router;