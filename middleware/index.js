const Review = require('../models/review');
const User = require('../models/user');
const Post = require('../models/post');
const { cloudinary } = require('../cloudinary');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const middleware = {
  asyncErrorHandler: (fn) =>
    (req,res,next) => {
      Promise.resolve(fn(req, res, next))
        .catch(next);
    },
  isReviewAuthor: async(req, res, next) => {
    let review = await Review.findById(req.params.review_id);
    if(review.author.equals(req.user._id)){
      return next();
    }
    req.session.error = "Bye!";
    return res.redirect('/');
  },

  isLoggedIn: (req, res , next) => {
    if(req.isAuthenticated()) return next();
    req.session.error = 'Ypu need to be logged in to do that!';
    req.session.redirectTo = req.originalUrl;
    res.redirect('/login')
  },

  isAuthor: async(req, res, next) => {
    const post = await Post.findById(req.params.id);
    if(post.author.equals(req.user._id)){
      res.locals.post = post;
      return next();
    }
    req.session.error = 'Access denied!';
    res.redirect('back');
  },

  isValidPassword: async (req, res, next) => {
    const { user } = await User.authenticate()(req.user.username, req.body.currentPassword);
    if(user){
      res.locals.user = user;
      next();
    } else {
      middleware.deleteProfileImage(req);
      req.session.error = 'Incorrect Current Password!';
      return res.redirect('/profile');
    }
  },

  changePassword: async (req, res, next) => {
    const { 
            newPassword,
            passwordConfirmation
    } = req.body;
    if( newPassword && !passwordConfirmation ){
     middleware.deleteProfileImage(req);
     req.session.error = 'Missing password confirmation!';
      return res.redirect('/profile');
    } else if( newPassword && passwordConfirmation ){
      const {user} = res.locals;
      if( newPassword === passwordConfirmation ){
        await user.setPassword(newPassword);
        next();
      } else {
        middleware.deleteProfileImage(req);
        req.session.error = 'New passwords must match!';
        return res.redirect('/profile');
      }
    } else{
      next();
    }
  },

  deleteProfileImage: async req => {
    if(req.file) await cloudinary.uploader.destroy(req.file.public_id);
  },

  async searchAndFilterPosts(req,res,next){
    const queryKeys = Object.keys(req.query);

    if(queryKeys.length){
      const dbQueries = [];
      let { search, price, avgRating, location, distance } = req.query;

      if(search){
        search = new RegExp(escapeRegExp(search),'gi');

        //create a db query object and push it to the array
        dbQueries.push( { $or: [
          { title: search },
          { description: search },
          { location: search }
        ]});
      }

      if(location){
        let coordinates;
        try{
          if(typeof JSON.parse(location) === 'number'){
            throw new Error;
          }
          location = JSON.parse(location);
          coordinates = location;
        } catch (err){
          const response = await geocodingClient
            .forwardGeocode({
              query: location,
              limit: 1
            })
            .send();
          coordinates = response.body.features[0].geometry.coordinates;
        }
        let maxDistance = distance || 25;
        maxDistance /= 111.2; //Convert to kilometers
        dbQueries.push({
          geometry: {
            $geoWithin: {
              $center: [coordinates, maxDistance]
            }    
          }
        });
      }

      if(price){
        if(price.min) dbQueries.push({ price: { $gte: Number(price.min) } });
        if(price.max) dbQueries.push({ price: { $lte: Number(price.max) } });
      }

      if(avgRating){
        dbQueries.push({ avgRating: { $in: avgRating } });
      }

      res.locals.dbQuery = dbQueries.length ? { $and:  dbQueries  } : {};
    }
    res.locals.query = req.query;
    queryKeys.splice(queryKeys.indexOf('page'),1);
    const delimiter = queryKeys.length ? '&' : '?';
    res.locals.paginateUrl = req.originalUrl.replace(/(\?|\&)page=\d+/g, '') + `${delimiter}page=`;
    next();
  }
};


module.exports = middleware;
