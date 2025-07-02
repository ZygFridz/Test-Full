const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/authenticateToken');
const { isAdmin, isSelfOrAdmin } = require('../middlewares/role');

router.get('/', authenticateToken, userController.getAllUsers);
router.post('/', authenticateToken, isAdmin, userController.createUser);
router.put('/:id', authenticateToken, isSelfOrAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);

module.exports = router;