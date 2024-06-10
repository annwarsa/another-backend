const prisma = require('../utils/prismaClient');
const _ = require('lodash');

exports.createProduct = async (productData) => {
  const {
    name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium, imageUrl,
  } = productData;

  const requiredFields = [
    name, weight, calories, fat, proteins, carbohydrate, sugar, sodium, potassium, imageUrl,
  ];
  const missingFields = requiredFields.filter(field => field === undefined || field === null);

  if (missingFields.length > 0) {
    throw new Error(`Please provide all required fields: ${missingFields.join(', ')}`);
  }

  // Check if a product with the same name already exists
  const existingProduct = await prisma.product.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  });

  if (existingProduct) {
    throw new Error(`Product with name '${name}' already exists`);
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