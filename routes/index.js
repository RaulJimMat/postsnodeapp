const express = require('express');
const router = express.Router();
const { 
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  landingPage } = require('../controllers/index')
const { asyncErrorHandler, checkIfUserExists } = require('../middleware');

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', asyncErrorHandler(checkIfUserExists), asyncErrorHandler(postRegister));

/* GET /login */
router.get('/login', getLogin);

/* POST /login */
router.post('/login',  postLogin);

/* GET /logout */
router.get('/logout', getLogout);

/* GET /profile */
router.get('/profile', (req, res, next) => {
  res.send('GET /profile');
});

/* PUT /profile/:user_id */
router.put('/profile/:user_id', (req, res, next) => {
  res.send('PUT /profile/:user_id');
});

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
