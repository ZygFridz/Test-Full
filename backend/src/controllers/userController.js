const userService = require('../services/userServices');

//createUser
const createUser = async (req, res) => {
  const { name, email, role } = req.body;
  const user = await userService.createUser({ name, email, role });
  res.status(201).json(user);
};

//getUser
const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

//updateUser
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const user = await userService.updateUser(id, { name, email });
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