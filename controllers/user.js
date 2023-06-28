exports.home_get = function (req, res, next) {
	res.render('index', {
		title: 'Home Page',
	});
	return;
};

exports.login_get = function (req, res, next) {
	//controller for Login get
};
exports.login_post = function (req, res, next) {
	//controller for Login Post
};
exports.signup_get = function (req, res, next) {
	//controller for Signup Get
};
exports.signup_post = function (req, res, next) {
	//controller for Signup Post
};
exports.new_post_get = function (req, res, next) {
	//controller for New post Get
};
exports.new_post_post = function (req, res, next) {
	//controller for new Post Post
};
