const express = require('express');
const { loginUser, userSignup , verifyEmail} = require('../controller/UserController');

const router = express.Router();

router.post('/signup', userSignup);

router.post('/login', loginUser);

router.get('/verify-email/:token', verifyEmail);

module.exports = router;
