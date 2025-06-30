const express = require('express');
const router = express.Router();

function checkLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    res.render('index');
  }
}

router.get('/', checkLogin, (req, res) => {
  res.redirect('/home');
});

module.exports = router;
