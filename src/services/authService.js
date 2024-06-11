const prisma = require('../utils/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Mailgun = require('mailgun.js');
const formData = require('form-data');
const crypto = require('crypto');

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  public_key: process.env.MAILGUN_PUBLIC_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
  return token;
};

exports.register = async (username, email, password) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
  return user;
};

exports.forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const resetToken = crypto.randomBytes(20).toString('hex');
  const resetExpiration = new Date(Date.now() + 3600000); // 1 hour expiration

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetExpiration },
  });

  const data = {
    from: process.env.MAILGUN_FROM_EMAIL,
    to: email,
    subject: 'Password Reset Request',
    text: `You are receiving this email because you (or someone else) have requested the reset of your password. Please click on the following link, or copy and paste it into your browser to complete the process: \n\nhttp://${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
  };

  await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
};

exports.resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetExpiration: { gt: new Date() } },
  });
  if (!user) throw new Error('Invalid or expired reset token');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetToken: null, resetExpiration: null },
  });
};