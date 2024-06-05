const mongoose= require('mongoose');

const educationSchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of school/college is required']
    },
    degree: {
        type: String,
        required: [true, 'Degree is required']
    },
    from: {
        type: Number,
        required: [true, 'From date is required']
    },
    to: {
        type: Number,
        required: [true, 'To date is required']
    },
    major: {
        type: String,
        required: [true, 'Major is required']
    },
    cgpa: {
        type: Number,
        required: [true, 'CGPA is required']
    }
});

const Education= mongoose.models.Education || mongoose.model('Education', educationSchema);

module.exports= Education;