const mongoose = require('mongoose');
const User= require('./userModel');
const Company= require('./CandidateCVmodel/companyModel');
const Project= require('./CandidateCVmodel/projectModel');
const Skill= require('./CandidateCVmodel/skillModel');
const Education= require('./CandidateCVmodel/educationModel');
const Achievement= require('./CandidateCVmodel/achievementModel');
const Profilelink= require('./CandidateCVmodel/profilelinkModel');

const candidateSchema = new mongoose.Schema({
    userCandidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    relocate: {
        type: Boolean,
        default: false
    },
    resumeLink: {
        type: String,
        default: ''
    },
    preference: { // role candidate want to be hired as
        type: String, 
        enum: ['UI/UX designer', 'Cloud Engineer', 'Network Security', 'Consultant/Analyst', 'Software Developer', 'Front-end Engineer', 'Backend Engineer', 'Full-stack Engineer', 'Data Scientist', 'AI/ML Engineer', 'Cloud Engineer', 'Database Administrator', 'Embedded Software Engineer', 'Blog/content writing', 'Financial Analyst', 'Photo/Video Editor'],
        required: [true, 'Role is required'],
        default: 'UI/UX designer'
    },
    bio: {
        type: String,
        default: 'I am a candidate'
    },
    pastCompanies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            default: []
        }
    ],
    projects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            default: []
        }
    ],
    skills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill',
            default: []
        }
    ],
    educations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Education',
            default: []
        }
    ],
    achievements: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Achievement',
            default: []
        }
    ],
    profileLinks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profilelink',
            default: []
        }
    ],
    active: { // active user (who has not deleted (deactivated) his/her account)
        type: Boolean,
        default: true,
        select: false // we can't display this info
    }
}, { minimize: false }); // set minimize to false to preserve empty arrays

// Update the default values using a function
candidateSchema.path('pastCompanies').default(function() { return []; });

candidateSchema.path('projects').default(function() { return []; });

candidateSchema.path('skills').default(function() { return []; });

candidateSchema.path('educations').default(function() { return []; });

candidateSchema.path('achievements').default(function() { return []; });

candidateSchema.path('profileLinks').default(function() { return []; });

candidateSchema.pre(/^find/, function(next) {  // display 'user' without these 2 field embedded in 'tour'
    // in Query middleware, 'this' points to current document (just before await)

    if (this._skipMiddleware) {
        this.find( { active: {$ne: false}} );  // Activated user are those whose active status is undefined or not false
        console.log('middleware skipped! For performance optimization')
        return next(); // Skip middleware if flag is set
    }
  
    this.find( { active: {$ne: false}} )
    .populate({
        path: 'userCandidate',
        select: '-__v -createdAt -updatedAt -password -active -passwordChangedAt -passwordResetToken -passwordResetExpires -rightSwipedID -visitedID -matchedID -messageID -blockedID'
    })
    .populate({
        path: 'pastCompanies',
        select: '-__v'
    })
    .populate({
        path: 'projects',
        select: '-__v'
    })
    .populate({
        path: 'skills',
        select: '-__v'
    })
    .populate({
        path: 'educations',
        select: '-__v'
    })
    .populate({
        path: 'achievements',
        select: '-__v'
    })
    .populate({
        path: 'profileLinks',
        select: '-__v'
    });
    
    next();
});

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;