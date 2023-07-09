var express = require('express');
const UserController = require('../controllers/user.js');
var router = express.Router();

/* GET home page. */
router.get('/', UserController.home_get);

/* GET login page. */
router.get('/login', UserController.login_get);

/* POST login page. */
router.post('/login', UserController.login_post);

/* GET sigup page. */
router.get('/signup', UserController.signup_get);

/* POST signup page. */
router.post('/signup', UserController.signup_post);

/* GET new_post page. */
router.get('/new_post', UserController.new_post_get);

/* POST new_post page. */
router.post('/new_post', () => {
  //GET New Post form
});

router.get('/be_member', UserController.be_member_get);

router.post('/be_member', UserController.be_member_post);

module.exports = router;
