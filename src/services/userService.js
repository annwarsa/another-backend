const prisma = require('../utils/prismaClient');

exports.getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { products: true, images: true },
  });
  return user;
};

exports.updateUser = async (userId, username, email, avatar_src) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { username, email, avatar_src },
  });
  return user;
};