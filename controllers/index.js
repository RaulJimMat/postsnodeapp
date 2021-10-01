const passport = require('passport');
const User = require('../models/user');
const Post = require('../models/post');
const mapBoxToken = process.env.MAPBOX_TOKEN;

module.exports = {
  async landingPage(req,res, next){
    const postsArr = await Post.find({});
    res.render('index', {postsArr, mapBoxToken, title: 'Surf Shop - Home' });
  },
  async postRegister(req, res, next) {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      image: req.body.image
    });

    await User.register(newUser, req.body.password);
    res.redirect('/');
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
