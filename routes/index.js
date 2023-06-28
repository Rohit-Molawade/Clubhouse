var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', () => {
    //Get Home page
});

/* GET login page. */
router.get('/login', () => {
    //GET Login Page
});

/* POST login page. */
router.post('/login', () => {
    //POST Login Page
});

/* GET sigup page. */
router.get('/signup', () => {
    //GET signup Page
});

/* POST signup page. */
router.post('/signup', () => {
    //POST Signup Page
});

/* GET new_post page. */
router.get('/new_post', () => {
    //GET New Post form
});

/* POST new_post page. */
router.post('/new_post', () => {
    //GET New Post form
});

module.exports = router;
