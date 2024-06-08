const prisma = require('../utils/prismaClient');

exports.getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

exports.updateUser = async (userId, username, email, imageUrl) => {
  const data = { username, email };
  if (imageUrl) {
    data.avatar = imageUrl;
  }

  const user = await prisma.user.update({
    where: { id: parseInt(userId, 10) },
    data,
  });

  return user;
};
