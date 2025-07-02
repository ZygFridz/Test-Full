const userService = require('../services/userServices');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//createUser
const createUser = async (req, res) => {
  const { username, email, role } = req.body;
  const user = await userService.createUser({ username, email, role });
  res.status(201).json(user);
};

//getUser
const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers()
  res.json(users);
};

//updateUser
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, email } = req.body;

  const user = await userService.updateUser(id, { username, email });
  res.json(user);
};

//deleteUser
const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  await userService.deleteUser(id);
  res.json({ message: 'User deleted' });
};

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
}