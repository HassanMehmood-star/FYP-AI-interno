const express = require('express');
const  adminLogin = require('../controller/AdminController');

const router = express.Router();

// Admin Login Route
router.post('/login', adminLogin);

module.exports = router;
