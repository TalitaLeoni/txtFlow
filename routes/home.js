const express = require('express');
const router = express.Router();

function checkLogin(req, res, next) {
  if (req.session.logado) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

router.get('/', checkLogin, (req, res) => {
  const initial = req.session.userName ? req.session.userName[0] : 'T';
  const username = req.session.username ?? 'pecorario';
  const name = req.session.userName ?? 'Taynara Pecorario';

  res.render('home', { username, initial, name });
});

module.exports = router;
