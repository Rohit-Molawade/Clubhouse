var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypt = require('bcrypt');
const User = require('./models/User');
require('dotenv').config();

var indexRouter = require('./routes/index');
const flash = require('connect-flash');

//MongoDB connection
mongo_connect().catch((err) => console.log('Mongo Connection not possible'));

mongoose.set('strictQuery', false);
async function mongo_connect() {
  await mongoose.connect(process.env.Mongo_URL);
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: process.env.session_secret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, req.flash('message', 'Email or Password is invalid'));
      }
      crypt.compare(password, user.password, (err, result) => {
        if (result) {
          return done(null, user, req.flash('message', 'Login Successful'));
        } else {
          return done(null, false, req.flash('message', 'Email or Password is invalid 222'));
        }
      });
    } catch (error) {
      return done(error, req.flash('message', 'Some error occured'));
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await User.findById(id);
    const userinformation = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar: user.avatar,
      membership: user.membership_status,
    };
    done(null, userinformation);
  } catch (err) {
    done(err);
  }
});

app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
