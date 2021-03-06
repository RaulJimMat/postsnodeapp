const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } =  require('../cloudinary');
const upload = multer({storage});
const { 
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  landingPage,
  getProfile,
  updateProfile,
  getForgotPw,
  putForgotPw,
  getReset,
  putReset } = require('../controllers/index')
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword } = require('../middleware');

/* GET home page. */
router.get('/', asyncErrorHandler(landingPage));

/* GET /register */
router.get('/register', getRegister);

/* POST /register */
router.post('/register', upload.single('image'), asyncErrorHandler(postRegister));

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
  upload.single('image'),
  asyncErrorHandler(isValidPassword),
  asyncErrorHandler(changePassword),
  asyncErrorHandler(updateProfile)
);

/* GET /forgot-pw */
router.get('/forgot-password', getForgotPw);

/* PUT /forgot-pw */
router.put('/forgot-password', asyncErrorHandler(putForgotPw));

/* GET /reset-pw */
router.get('/reset/:token', asyncErrorHandler(getReset));

/* PUT /reset-pw/:token */
router.put('/reset/:token', asyncErrorHandler(putReset));


module.exports = router;
