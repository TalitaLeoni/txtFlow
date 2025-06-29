require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

const mongoURL = process.env.MONGODB_URL;

mongoose.connect(mongoURL)
  .then(() => {
    console.log('Conexão com o MongoDB Atlas estabelecida com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao conectar com o MongoDB Atlas:');
    console.error(err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 3600000 // 1 hora
    }
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(4000);

module.exports = app;
