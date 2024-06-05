const prisma = require('../utils/prismaClient');

module.exports = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { users: true },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.users.some((user) => user.id === req.userId)) {
      return res.status(403).json({ error: 'You are not authorized to access this resource' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};