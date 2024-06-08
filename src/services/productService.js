const prisma = require('../utils/prismaClient');
const _ = require('lodash');

exports.createProduct = async (productData) => {
  const {
    name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium, imageUrl,
  } = productData;

  if (!name || !weight || !calories || !fat || !proteins || !carbohydrate || !sugar || !sodium || !potassium || !imageUrl) {
    throw new Error('Please provide all required fields');
  }

  const product = await prisma.product.create({
    data: {
      name,
      weight: parseFloat(weight),
      calories: parseFloat(calories),
      fat: parseFloat(fat),
      proteins: parseFloat(proteins),
      carbohydrate: parseFloat(carbohydrate),
      sugar: parseFloat(sugar),
      sodium: parseFloat(sodium),
      potassium: parseFloat(potassium),
      images: imageUrl,
    },
  });
  return product;
};

exports.getProducts = async () => {
  return await prisma.product.findMany();
};

exports.getProductByName = async (name) => {
  const searchTokens = _.words(name.toLowerCase());
  const product = await prisma.product.findFirst({
    where: {
      name: {
        in: searchTokens,
        mode: 'insensitive',
      },
    },
  });

  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.updateProduct = async (id, productData) => {
  const {
    name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium, imageUrl,
  } = productData;

  const data = {
    name,
    weight: parseFloat(weight),
    calories: parseFloat(calories),
    fat: parseFloat(fat),
    proteins: parseFloat(proteins),
    carbohydrate: parseFloat(carbohydrate),
    sugar: parseFloat(sugar),
    sodium: parseFloat(sodium),
    potassium: parseFloat(potassium),
  };
  if (imageUrl) {
    data.images = imageUrl;
  }

  const product = await prisma.product.update({
    where: { id: parseInt(id, 10) },
    data,
  });
  return product;
};

exports.deleteProduct = async (id) => {
  await prisma.product.delete({
    where: { id: parseInt(id, 10) },
  });
};
