const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const mapBoxToken = process.env.MAPBOX_TOKEN;

module.exports = {
  async landingPage(req,res, next){
    const postsArr = await Post.find({});
    res.render('index', {postsArr, mapBoxToken, title: 'Surf Shop - Home' });
  },

  getRegister(req,res,next){
    res.render('register', { title: 'Register' });
  },

  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image
    });

    let user = await User.register(newUser, req.body.password);
    req.login(user, function(err){
      if(err){
        return next(err);
      }
      req.session.success = `Welcome to Surf Shop, ${user.username}!`;
      res.redirect('/');
    });
  },

  getLogin(req,res,next){
    res.render('login', { title: 'Login' });
  },

 postLogin(req,res,next){
     passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' })(req,res,next);
  },

  getLogout(req,res,next){
    req.logout();
    res.redirect('/');
  }
}
