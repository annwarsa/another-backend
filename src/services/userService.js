const prisma = require('../utils/prismaClient');

exports.getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to retrieve user');
  }
};

exports.updateUser = async (userId, username, email, imageUrl) => {
  try {
    if (!username || !email) {
      throw new Error('Username and email are required');
    }

    const data = { username, email };
    if (imageUrl) {
      data.avatar = imageUrl;
    }

    const user = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data,
    });

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};