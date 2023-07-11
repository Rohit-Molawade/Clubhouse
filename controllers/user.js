const Post = require('../models/Post.js');
const User = require('../models/User.js');
const Avatar = require('../models/Avatar.js');
const { body, validationResult } = require('express-validator');
const async = require('async');
const crypt = require('bcrypt');
const passport = require('passport');
const date = require('date-fns');
const intlFormat = require('date-fns/intlFormat');
const saltrounds = 10;

exports.home_get = function (req, res, next) {
	Post.find()
		.sort({ timestamp: -1 })
		.populate('author')
		.then((result) => {
			res.render('index', {
				title: 'Home Page',
				posts: result,
				user: req.user,
			});
		})
		.catch((err) => {
			return next(err);
		});
	return;
};

exports.login_get = function (req, res, next) {
	if (!req.user) {
		res.render('login', {
			title: 'Login Page',
			url: req.url,
			error: req.flash('message'),
		});
	} else {
		res.send('User is already logged In');
	}
};

exports.login_post = [
	body('email').trim().notEmpty().isEmail().toLowerCase().escape().withMessage('Email is invalid'),
	body('password').trim().isLength({ min: 1 }).escape().withMessage('Password is invalid'),
	(req, res, next) => {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			res.render('login', {
				title: 'Login Page',
				url: req.url,
				email: req.email,
				error: error.array(),
			});
			return;
		}
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true,
		})(req, res, next);
	},
];

exports.signup_get = function (req, res, next) {
	if (!req.user) {
		Avatar.find()
			.then((names) => {
				res.render('signup', {
					title: 'SignUp Page',
					url: req.url,
					imgs: names,
					user: req.user,
				});
				return;
			})
			.catch((err) => next(err));
	} else {
		res.send('User is already logged in');
	}
};

exports.signup_post = [
	body('first_name').trim().notEmpty().isString().escape().withMessage('First name must be specified'),
	body('last_name').trim().notEmpty().isString().escape().withMessage('Last name must be specified'),
	body('email').trim().notEmpty().isEmail().toLowerCase().escape().withMessage('Email is invalid'),
	body('password').trim().isLength({ min: 1 }).isStrongPassword().escape().withMessage('Password is invalid'),
	body('confirm_password').trim().isLength({ min: 1 }).isStrongPassword().escape().withMessage('Confirm password is invalid'),
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
						membership_status: 'visitor',
					};

					//Generate hashed password
					try {
						(async () => {
							const hash = await crypt.hash(req.body.password, saltrounds);

							user_object.password = hash;
							const user = new User(user_object);

							user.save((err) => {
								if (err) return next(err);
								const userinformation = {
									id: user.id,
									first_name: user.first_name,
									last_name: user.last_name,
									email: user.email,
									avatar: user.avatar,
									membership: user.membership_status,
								};
								req.login(userinformation, (err) => {
									if (err) return next(err);
									res.redirect('/');
								});
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

exports.be_member_get = function (req, res, next) {
	if (!req.user) {
		res.send('Login before accesing this Link.');
	} else {
		res.render('be_member', {
			title: 'Be a member',
		});
	}
};

exports.be_member_post = [
	body('secret_keyword').trim().notEmpty().withMessage('Secret keyword cannot be empty').isString().escape().withMessage('Only String permitted'),
	(req, res, next) => {
		const error_list = validationResult(req);
		if (!error_list.isEmpty()) {
			res.render('be_member', {
				title: 'Be a Member',
				error: error_list.array(),
			});
		}

		if (req.body.secret_keyword === 'SKULLY') {
			User.findByIdAndUpdate(req.user.id, { membership_status: 'member' })
				.then(() => {
					console.log('Membership upgraded');
					return;
				})
				.catch((err) => next(err));
		} else {
			const error = [{ msg: 'Keyword does not match' }];
			res.render('be_member', {
				title: 'Be a Member',
				error: error,
			});
		}
		res.redirect('/');
	},
];

exports.new_post_get = function (req, res, next) {
	if (req.user && req.user.membership_status === 'member') {
		res.render('new_post', {
			title: 'Create new message',
			user: req.user,
		});
	} else {
		res.send('You have to be a member before Posting');
	}
};

exports.new_post_post = [
	body('title')
		.trim()
		.notEmpty()
		.withMessage('Title cannot be empty')
		.isLength({ max: 32 })
		.withMessage('Max length is 32')
		.isString()
		.escape()
		.withMessage('Title should be string'),
	body('content')
		.trim()
		.notEmpty()
		.withMessage('content cannot be empty')
		.isLength({ max: 100 })
		.withMessage('Max length is 100')
		.isString()
		.escape()
		.withMessage('Title should be string'),
	(req, res, next) => {
		const error_list = validationResult(req);
		if (!error_list.isEmpty()) {
			res.render('new_post', {
				title: 'Create new message',
				error: error_list.array(),
				params: req.body,
			});
		}
		const post = new Post({
			author: req.user.id,
			timestamp: Date.now(),
			title: req.body.title,
			content: req.body.content,
		});

		post.save((err) => {
			if (err) return next(err);
			console.log('post created');
		});
		res.redirect('/');
	},
];

exports.logout_post = function (req, res, next) {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect('/');
	});
};
