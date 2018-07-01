const express = require('express');
const router  = express.Router();
const flash = require("connect-flash");

const User = require("../models/user-model.js");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

module.exports = router;
