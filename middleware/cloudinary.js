const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_HOST,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "product photos",
        format: async() => "png",
        public_id: (req, file) => file.filename,
        height: 480,
        crop: 'scale'
    },
});

const parser = multer({ storage: storage });

module.exports = parser;