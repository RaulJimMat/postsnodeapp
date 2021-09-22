const Post = require('../models/post');
const Review = require('../models/review');

module.exports = {

  async reviewCreate(req,res,next){
    let post = await Post.findById(req.params.id);   
    req.body.review.author = req.user._id;
    let review = await Review.create(req.body.review);
    post.reviews.push(review);
    post.save();
    req.session.success = 'New review created!';
    res.redirect(`/posts/${post.id}`);
  },

  async reviewUpdate(req,res,next){
    await Review.findByIdAndUpdate(req.params.review_id,req.body.review);
    req.session.success = 'Review updated!'
    res.redirect(`/posts/${req.params.id}`);
  },

  async reviewDelete(req,res,next){
    
  }

}
