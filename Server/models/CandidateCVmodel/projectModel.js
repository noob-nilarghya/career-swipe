const mongoose= require('mongoose');

const projectSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required']
    },
    link: {
        type: String,
        required: [true, 'Project link is required']
    },
    description: {
        type: String,
        required: [true, 'Project description is required']
    }
});

const Project= mongoose.models.Project || mongoose.model('Project', projectSchema);

module.exports= Project;