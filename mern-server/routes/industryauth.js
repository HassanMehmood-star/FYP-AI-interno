const express = require('express');
const { industrypartnersignup, industrypartnerlogin } = require('../controller/IndustryPartnerController');

const router = express.Router();

router.post('/signup', industrypartnersignup);

router.post('/login', industrypartnerlogin);


module.exports = router;
