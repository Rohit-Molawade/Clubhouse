const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Avatar = require('../models/Avatar.js');
const { body, validationResult } = require('express-validator');
const async = require('async');
const crypt = require('bcrypt');
const saltrounds = 10;

exports.home_get = function (req, res, next) {
  Post.find()
    .sort({ timestamp: -1 })
    .populate('author')
    .then((result) => {
      res.render('index', {
        title: 'Home Page',
        posts: result,
      });
    })
    .catch((err) => {
      return next(err);
    });
  return;
};

exports.login_get = function (req, res, next) {};
exports.login_post = function (req, res, next) {
  //controller for Login Post
};

exports.signup_get = function (req, res, next) {
  Avatar.find()
    .then((names) => {
      res.render('signup', {
        title: 'SignUp Page',
        url: req.url,
        imgs: names,
      });
      return;
    })
    .catch((err) => next(err));
};

exports.signup_post = [
  body('first_name').trim().notEmpty().isString().escape().withMessage('First name must be specified'),
  body('last_name').trim().notEmpty().isString().escape().withMessage('Last name must be specified'),
  body('email').trim().notEmpty().isEmail().escape().withMessage('Email is invalid'),
  body('password').trim().isLength({ min: 1 }).isStrongPassword().withMessage('Password is invalid'),
  body('confirm_password').trim().isLength({ min: 1 }).isStrongPassword().withMessage('Confirm password is invalid'),
  body('avatar').isString().trim().notEmpty().optional().escape(),
  async (req, res, next) => {
    const error_list = validationResult(req);
    async.parallel(
      {
        user(callback) {
          User.findOne({ email: req.body.email }).exec(callback);
        },
        avatar(callback) {
          Avatar.find({}).exec(callback);
        },
      },
      (err, result) => {
        //Return error while querying database
        if (err) return next(err);

        //Return Validation errors
        if (!error_list.isEmpty()) {
          res.render('signup', {
            title: 'SignUp Page',
            url: req.url,
            error: error_list.array(),
            user: req.body,
            imgs: result.avatar,
          });
          return;
          //Return email error
        } else if (result.user !== null) {
          const error = [{ msg: 'Email already in use. Try again with diffrent email' }];
          res.render('signup', {
            title: 'SignUp Page',
            url: req.url,
            error: error,
            user: req.body,
            imgs: result.avatar,
          });
          //Return password not same error
        } else if (req.body.password !== req.body.confirm_password) {
          const error = [{ msg: 'Both Passwords should match' }];
          res.render('signup', {
            title: 'SignUp Page',
            url: req.url,
            error: error,
            user: req.body,
            imgs: result.avatar,
          });
          //Save user
        } else {
          const user_object = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            avatar_url: req.body.avatar,
            membership_status: 'member',
          };

          //Generate hashed password
          try {
            (async () => {
              const hash = await crypt.hash(req.body.password, saltrounds);

              user_object.password = hash;
              const user = new User(user_object);

              user.save((err) => {
                if (err) return next(err);
                res.redirect('/');
              });
            })();
          } catch (error) {
            return next(err);
          }
        }
      }
    );
  },
];

exports.new_post_get = function (req, res, next) {
  //controller for New post Get
};
exports.new_post_post = function (req, res, next) {
  //controller for new Post Post
};
