const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

const corsMiddleware = require('./middlewares/corsMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();

app.use(express.json());
app.use(cors());
app.use(corsMiddleware);

app.use('/auth', authRoutes);
app.use('/users', authMiddleware, userRoutes);
app.use('/products', authMiddleware, productRoutes);

module.exports = app;