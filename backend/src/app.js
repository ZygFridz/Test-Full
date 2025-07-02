require("dotenv").config();

const express = require('express');
const app = express();
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

module.exports = app;
