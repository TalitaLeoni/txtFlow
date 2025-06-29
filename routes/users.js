var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/user');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, email, password, name, bio } = req.body;

  // TO DO: express-validator
  if (!username || !email || !password || !name) {
    return res.status(400).json({ msg: 'Por favor, preencha todos os campos.' });
  }

  try {
    let user = await User.findOne({ email: email });
    let userName = await User.findOne({ username: username });

    if (user) {
      return res.status(400).json({ msg: 'Este e-mail já está em uso.' });
    }

    if (userName) {
      return res.status(400).json({ msg: 'Este username já está em uso.' });
    }

    user = new User({
      username,
      email,
      password,
      name,
      bio: bio ?? null
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.redirect('/users/login');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: 'Por favor, forneça e-mail e senha.' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas.' });
    }

    req.session.logado = true;
    req.session.userId = user.id;
    req.session.userName = user.name;

    res.redirect('/');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Erro ao fazer logout.');
    }

    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  });
});

module.exports = router;