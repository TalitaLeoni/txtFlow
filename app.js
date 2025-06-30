require('dotenv').config();

const http = require('http');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const homeRouter = require('./routes/home');
const notFoundRouter = require('./routes/notFound');

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

const sessionTimeInSeconds = 14 * 24 * 60 * 60;
const sessionTimeInMilliseconds = 14 * 24 * 60 * 60;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions',
      ttl: sessionTimeInSeconds
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: sessionTimeInMilliseconds
    }
  })
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
app.use('/not-found', notFoundRouter);

http.createServer(app).listen(4000);

module.exports = app;
