const prisma = require('../utils/prismaClient');

module.exports = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};