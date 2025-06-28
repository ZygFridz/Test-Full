const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);

module.exports = app;
