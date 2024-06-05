const mongoose= require('mongoose');

const achievementSchema= new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Achievement description is required']
    }
});

const Achievement= mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);

module.exports= Achievement;