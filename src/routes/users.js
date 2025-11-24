const express = require('express');
const UserController = require('../controllers/users.js');
const router = express.Router();

// Create - Post
router.post('/', UserController.createNewUser);
// Read - Get
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
// Update - Patch 
router.patch('/:id', UserController.updateUser);
// Delete - Delete
router.delete('/:id', UserController.deleteUser);

module.exports = router;