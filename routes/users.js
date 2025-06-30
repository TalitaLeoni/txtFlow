const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password, name, bio } = req.body;

  if (!username || !email || !password || !name) {
    return res.render('error', { error: '400', title: 'Error', description: 'Por favor, preencha todos os campos' });
  }

  try {
    let user = await User.findOne({ email: email });
    let userName = await User.findOne({ username: username });

    if (user) {
      return res.render('error', { error: '400', title: 'Error', description: 'Este e-mail já está em uso' });
    }

    if (userName) {
      return res.render('error', { error: '400', title: 'Error', description: 'Este username já está em uso' });
    }

    const initial = name[0].toUpperCase();

    user = new User({
      username,
      email,
      password,
      name,
      initial,
      bio: bio ?? null
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.redirect('/users/login');
  } catch (err) {
    return res.render('error', { error: '500', title: 'Erro no Servidor', description: err.message });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('error', { error: '400', title: 'Error', description: 'Por favor, forneça e-mail e senha' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.render('error', { error: '400', title: 'Error', description: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render('error', { error: '400', title: 'Error', description: 'Credenciais inválidas' });
    }

    req.session.logado = true;
    req.session.initial = user.initial;
    req.session.userName = user.name;
    req.session.username = user.username;

    req.session.save((err) => {
      if (err) {
        return res.render('error', { error: '500', title: 'Erro no Servidor', description: 'Não foi possível salvar a sessão.' });
      }

      console.log('[SESSION AFTER LOGIN]', req.session);
      res.redirect('/home');
    });
  } catch (err) {
    return res.render('error', { error: '500', title: 'Erro no Servidor', description: err.message });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.render('error', { error: '500', title: 'Erro no Servidor', description: err.message });
    }

    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  });
});

module.exports = router;