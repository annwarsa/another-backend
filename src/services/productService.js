const prisma = require('../utils/prismaClient');
const _ = require('lodash');

exports.createProduct = async (
  name,
  weight,
  calories,
  fat,
  proteins,
  carbohydrate,
  sugar,
  sodium,
  potassium,
  imageUrl
) => {
  if (!name || !weight || !calories || !fat || !proteins || !carbohydrate || !sugar || !sodium || !potassium || !imageUrl) {
    throw new Error('Please provide all required fields');
  }

  const product = await prisma.product.create({
    data: {
      name,
      weight,
      calories,
      fat,
      proteins,
      carbohydrate,
      sugar,
      sodium,
      potassium,
      images: imageUrl
    }
  });
  return product;
};

exports.getProducts = async () => {
  const products = await prisma.product.findMany();
  return products;
};

exports.getProductByName = async (name) => {
  const searchTokens = _.words(name.toLowerCase());
  const product = await prisma.product.findFirst({
    where: { 
      name: {
        in : searchTokens,
        mode: 'insensitive'
      }
     }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

exports.getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product;
};

exports.updateProduct = async (
  id,
  name,
  weight,
  calories,
  fat,
  proteins,
  carbohydrate,
  sugar,
  sodium,
  potassium,
  imageUrl
) => {
  const product = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
      name,
      weight,
      calories,
      fat,
      proteins,
      carbohydrate,
      sugar,
      sodium,
      potassium,
      images: imageUrl | undefined
    },
  });
  return product;
};

exports.deleteProduct = async (id) => {
  await prisma.product.deleteMany({
    where: { id: parseInt(id) },
  });
};