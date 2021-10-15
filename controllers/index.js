const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  async landingPage(req,res, next){
    const postsArr = await Post.find({});
    res.render('index', {postsArr, mapBoxToken, title: 'Surf Shop - Home' });
  },

  getRegister(req,res,next){
    res.render('register', { title: 'Register', username: '', email: '' });
  },

  async postRegister(req, res, next) {
	try {
    if(req.file){
      const { path, filename } = req.file;
      req.body.image = {
        path,
        filename
      }
    }
		const user = await User.register(new User(req.body), req.body.password);
		req.login(user, function(err) {
			if (err) return next(err);
			req.session.success = `Welcome to Surf Shop, ${user.username}!`;
			res.redirect('/');
		});
	} catch(err) {
    deleteProfileImage(req);
		const { username, email } = req.body;
		let error = err.message;
    eval(require('locus'));
		if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
			error = 'A user with the given email is already registered';
		}
		res.render('register', { title: 'Register', username, email, error })
	}
},

  getLogin(req,res,next){
    if(req.isAuthenticated()) return res.redirect('/');
    if(req.query.returnTo) req.session.redirectTo = req.headers.referer;
      res.render('login', { title: 'Login' });
  },

 async postLogin(req,res,next){
   const { username, password } = req.body;
   const { user, error } = await User.authenticate()(username, password);
   if( !user && error ) return next(error);
   req.login(user, function(err) {
     if(err) return next(err);
     req.session.success = `Welcome back ${username}!`;
     const redirectUrl = req.session.redirectTo || '/';
     delete req.session.redirectTo;
     res.redirect(redirectUrl);
   })
  },

  getLogout(req,res,next){
    req.logout();
    res.redirect('/');
  },

  async getProfile(req, res, next){
    const posts = await Post.find().where('author').equals(req.user._id).limit(10).exec();
    res.render('profile', { posts });
  },

  async updateProfile(req, res, next){
    const { username, email } = req.body;
    const { user } = res.locals;
    if(username) user.username = username;
    user.email = email ? email : user.email;
    if(req.file){
      if(user.image.filename) await cloudinary.uploader.destroy(user.image.filename);
      const { path, filename } = req.file;
      user.image = { path, filename };
    }
    await user.save();
    const login = util.promisify(req.login.bind(req));
    await login(user);
    req.session.success = "Profile successfully updated!";
    res.redirect('/profile');
  },

  getForgotPw(req, res next){
    res.render('users/forgot');
  },

  async putForgotPw(req,res,next){
    const token = await crypto.randomBytes(20).toString('hex');
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
      req.session.error('No account with that email.');
      return res.redirect('forgot-password');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    const msg = {
      to: email,
      from: 'Surf Shop <rauljimmat@gmail.com>',
      subject: 'Surf Shop - Forgot Password / Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/reset/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/			/g, ''),
    };
    await sgMail.send(msg);

    req.session.success = `An email has been sent to ${email} with further instructions.`;
    res.redirect('/forgot-password');
  }

  async getReset(req, res, next){
    
  },

  async putReset(req, res, next){

  }
}
