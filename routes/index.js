const express = require('express');
const router = express.Router();

function checkLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    return res.render('index');
  }
}

router.get('/', checkLogin, (req, res) => {
  return res.redirect('/home');
});

module.exports = router;
