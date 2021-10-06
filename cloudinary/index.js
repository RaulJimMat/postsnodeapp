const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'rulopk',
  api_key: '456278375981731',
  api_secret: process.env.CLOUDINARY_SECRET
});
const {CloudinaryStorage} = require('multer-storage-cloudinary');
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req,file) => {
    let buf = crypto.randomBytes(16);
    buf = buf.toString('hex');
    let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
	  uniqFileName += buf;
    return{
      folder: 'surf-shop',
      format: 'jpeg',
      public_id: uniqFileName
    };
  }
});

module.exports = {
  cloudinary,
  storage
}
