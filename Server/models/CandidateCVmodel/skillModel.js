const mongoose= require('mongoose');

const skillSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of skill is required']
    }
});

const Skill= mongoose.models.Skill || mongoose.model('Skill', skillSchema);

module.exports= Skill;