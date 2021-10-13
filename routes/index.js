const express = require('express');
const router = express.Router();
const { 
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  landingPage,
  getProfile,
  updateProfile } = require('../controllers/index')
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword } = require('../middleware');

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login',  asyncErrorHandler(postLogin));

/* GET /logout */
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile/:user_id */
router.put('/profile',
  isLoggedIn,
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile)
);

/* GET /forgot-pw */
router.get('/forgot-pw', (req, res, next) => {
  res.send('GET /forgot-pw');
});

/* PUT /forgot-pw */
router.put('/forgot-pw', (req, res, next) => {
  res.send('PUT /forgot-pw');
});

/* GET /reset-pw */
router.get('/reset-pw/:token', (req, res, next) => {
  res.send('GET /reset-pw/:token');
});

/* PUT /reset-pw/:token */
router.put('/reset-pw/:token', (req, res, next) => {
  res.send('PUT /reset-pw/:token');
});


module.exports = router;
