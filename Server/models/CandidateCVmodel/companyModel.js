const mongoose= require('mongoose');

const companySchema= new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Company name is required']
    },
    from: {
        type: Number,
        required: [true, 'From date is required']
    },
    to: {
        type: Number,
        // NOT required coz it could be candidate's present company 
        default: 2099
    },
    role: {
        type: String,
        required: [true, 'Role is required']
    },
    description: {
        type: String,
        required: [true, 'Company Job description is required']
    }
});

const Company= mongoose.models.Company || mongoose.model('Company', companySchema);

module.exports= Company;