var express = require('express');
var router = express.Router();

function checkLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

router.get('/', checkLogin, (req, res) => {
  res.render('index', { title: req.session.userName });
});

module.exports = router;
