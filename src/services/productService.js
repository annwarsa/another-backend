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
  imageUrl
) => {
  if (!name || !ukuran || !kalori || !lemak || !protein || !karbohidrat || !gula || !garam || !kalium || !imageUrl) {
    throw new Error('Please provide all required fields');
  }

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
      images: { create: { url: imageUrl } }
    }
  });
  return product;
};

exports.getProducts = async () => {
  const products = await prisma.product.findMany({
    include: { images: true },
  });
  return products;
};

exports.getProductByName = async (name) => {
  const product = await prisma.product.findFirst({
    where: { name },
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
  kalium
) => {
  const product = await prisma.product.updateMany({
    where: { id: parseInt(id) },
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

exports.deleteProduct = async (id) => {
  await prisma.product.deleteMany({
    where: { id: parseInt(id) },
  });
};