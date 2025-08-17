const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.userRegister);

// Login route
router.post('/login', authController.userLogin);

module.exports = router;