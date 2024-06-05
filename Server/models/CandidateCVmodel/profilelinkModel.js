const mongoose= require('mongoose');

const profilelinkSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Profile website name is required']
    },
    link: {
        type: String,
        required: [true, 'Profile account link is required']
    }
});

const Profilelink= mongoose.models.Profilelink || mongoose.model('Profilelink', profilelinkSchema);

module.exports= Profilelink;