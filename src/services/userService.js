const prisma = require('../utils/prismaClient');

exports.getUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  return user;
};

exports.updateUser = async (userId, username, email, imageUrl) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { username, email, avatar: imageUrl | undefined},
  });
  return user;
};