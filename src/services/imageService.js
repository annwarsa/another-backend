const prisma = require('../utils/prismaClient');
const { uploadToGoogleBucket, deleteFromGoogleBucket } = require('../utils/googleBucket');

exports.uploadImage = async (file, productId, userId) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { users: true },
  });

  if (!product || !product.users.some((user) => user.id === userId)) {
    throw new Error('You are not authorized to upload images for this product');
  }

  const imageUrl = await uploadToGoogleBucket(file);
  const image = await prisma.productImage.create({
    data: {
      url: imageUrl,
      product_id: parseInt(productId),
    },
  });
  return image.url;
};

exports.getImages = async (productId, userId) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(productId) },
    include: { users: true, images: true },
  });

  if (!product || !product.users.some((user) => user.id === userId)) {
    throw new Error('You are not authorized to view images for this product');
  }

  return product.images;
};

exports.deleteImage = async (id, userId) => {
  const image = await prisma.productImage.findUnique({
    where: { id: parseInt(id) },
    include: { product: { include: { users: true } } },
  });

  if (!image || !image.product.users.some((user) => user.id === userId)) {
    throw new Error('You are not authorized to delete this image');
  }

  await deleteFromGoogleBucket(image.url);
  await prisma.productImage.delete({ where: { id: parseInt(id) } });
};