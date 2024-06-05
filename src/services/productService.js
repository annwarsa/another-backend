const prisma = require('../utils/prismaClient');

exports.createProduct = async (
  name,
  ukuran,
  kalori,
  lemak,
  protein,
  karbohidrat,
  gula,
  garam,
  kalium,
  userId
) => {
  const product = await prisma.product.create({
    data: {
      name,
      ukuran,
      kalori,
      lemak,
      protein,
      karbohidrat,
      gula,
      garam,
      kalium,
      users: { connect: { id: userId } },
    },
  });
  return product;
};

exports.getProducts = async (userId) => {
  const products = await prisma.product.findMany({
    where: { users: { some: { id: userId } } },
    include: { images: true },
  });
  return products;
};

exports.getProductByName = async (name, userId) => {
  const product = await prisma.product.findFirst({
    where: {
      name,
      users: { some: { id: userId } },
    },
    include: { images: true },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

exports.updateProduct = async (
  id,
  name,
  ukuran,
  kalori,
  lemak,
  protein,
  karbohidrat,
  gula,
  garam,
  kalium,
  userId
) => {
  const product = await prisma.product.updateMany({
    where: { id: parseInt(id), users: { some: { id: userId } } },
    data: {
      name,
      ukuran,
      kalori,
      lemak,
      protein,
      karbohidrat,
      gula,
      garam,
      kalium,
    },
  });
  return product;
};

exports.deleteProduct = async (id, userId) => {
  await prisma.product.deleteMany({
    where: { id: parseInt(id), users: { some: { id: userId } } },
  });
};