const multer= require('multer');
const sharp= require('sharp');

const multerStorage= multer.memoryStorage();

const multerFilter= (req, file, callback) => {
    if(file.mimetype.split('/')[0] === 'image'){
        callback(null, true);
    }
    else{
        callback(new Error("Not an image! Please upload only image"), false);
    }
}

const upload= multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadPhoto= upload.single('photo');

exports.userPhotoProcessing= async (req, res, next) => {
    if(!req.file){ console.log("File not found"); return next(); }
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(450,450)
        .toFormat('jpeg')
        .jpeg({ quality: 50 })
        .toFile(`Server/userPic/${req.file.filename}`);

    next();
}