const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required']
    },
    companySize: Number, // This field is optional, you can remove it if it's not always present
    jobRole: {
        type: String,
        required: [true, 'Job role is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    terms: {
        type: String,
        enum: ['Full time', 'Contractual', 'Internship']
    },
    duration: {
        type: Number
    },
    durationType: {
        type: String,
        enum: ['Month', 'Year']
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required']
    },
    salaryType: {
        type: String,
        enum: ['Per Hour', 'Per Day', 'Per Month', 'Per Annum'],
        required: [true, 'Salary type is required']
    },
    aboutCompany: {
        type: String,
        required: [true, 'About company is required']
    },
    aboutRole: {
        type: String,
        required: [true, 'About role is required']
    },
    responsibilities: {
        type: String,
        required: [true, 'Responsibilities are required']
    },
    requirements: { // any additional requirements (optional)
        type: String,
        default: ''
    }, 
    applyLink: {
        type: String,
        default: ''
    },
    activeTill: Date

}, {timestamps: true}); // for keeping track of job posting date

const Jobdescription = mongoose.models.Jobdescription || mongoose.model('Jobdescription', jobDescriptionSchema);
module.exports = Jobdescription;
