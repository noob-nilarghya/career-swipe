const mongoose= require('mongoose');
const Jobdescription= require('../models/RecruiterJDmodel/jobdescriptionModel');
const User= require('../models/userModel');

const recruiterSchema= new mongoose.Schema({
    userRecruiter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bio: {
        type: String,
        default: 'I am a recruiter'
    },
    preference: { // role recruiter want to hire for
        type: String, 
        enum: ['UI/UX designer', 'Cloud Engineer', 'Network Security', 'Consultant/Analyst', 'Software Developer', 'Front-end Engineer', 'Backend Engineer', 'Full-stack Engineer', 'Data Scientist', 'AI/ML Engineer', 'Cloud Engineer', 'Database Administrator', 'Embedded Software Engineer', 'Blog/content writing', 'Financial Analyst', 'Photo/Video Editor'],
        required: [true, 'Role is required'],
        default: 'UI/UX designer'
    },
    jobDescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jobdescription',
        default: null
    },
    active: { // active user (who has not deleted (deactivated) his/her account)
        type: Boolean,
        default: true,
        select: false // we can't display this info
    }
}, { minimize: false }); // set minimize to false to preserve empty arrays

// Update the default values using a function
recruiterSchema.path('jobDescription').default(function() { return null; });

recruiterSchema.pre(/^find/, function(next) {
    if (this._skipMiddleware) {
        this.find( { active: {$ne: false}} );  // Activated user are those whose active status is undefined or not false
        console.log('middleware skipped! For performance optimization')
        return next(); // Skip middleware if flag is set
    }

    this.find( { active: {$ne: false}} )
    .populate({
        path: 'userRecruiter',
        select: '-__v -createdAt -updatedAt -password -active -passwordChangedAt -passwordResetToken -passwordResetExpires -rightSwipedID -visitedID -matchedID -messageID -blockedID'
    })
    .populate({
        path: 'jobDescription',
        select: '-__v'
    });

    next();
});

const Recruiter = mongoose.models.Recruiter || mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter;