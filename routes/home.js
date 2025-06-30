const express = require('express');
const router = express.Router();
const User = require('../models/user');

function checkLogin(req, res, next) {
  console.log('[DEBUG CHECK LOGIN REQ]: ', req.session);

  if (req.session.logado) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

router.get('/', checkLogin, async (req, res) => {
  try {
    const initial = req.session.initial ?? 'V';
    const username = req.session.username ?? 'visitante';
    const name = req.session.userName ?? 'Usuário';

    const allUsers = await User.find({}).select('-password').sort({ createdAt: -1 });

    return res.render('home', { username, initial, name, users: allUsers });
  } catch (err) {
    return res.render('error', { error: '500', title: 'Erro ao carregar a página inicial', description: err.message });
  }
});

module.exports = router;
