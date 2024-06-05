const Recruiter= require('../models/recruiterModel');
const Jobdescription= require('../models/RecruiterJDmodel/jobdescriptionModel');

exports.getRecruiter= async (req, res) => {
    try{
        const id= req.user._id; 
        const userRecruiter= await Recruiter.findOne({userRecruiter: id});

        if(!userRecruiter){
            throw new Error('Recruiter not found');
        }

        res.status(200).json({
            status: 'Success',
            data: {
                finalRecruiter: userRecruiter
            }
        });
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Recruiter not found'
        }); 
    }
}

const filterObj = (obj, ...allowedFields) =>{ 
    // 'obj' is req.body, and 'allowedField' is array of name of field which are supposed to be updated
    const newObj = {};
    Object.keys(obj).forEach( function(el){
        if(allowedFields.includes(el) === true) {
            newObj[el]= obj[el];
        }
    });

    return newObj;
}

// {user, body(type, other fields)}
exports.addFields= async (req, res) => {
    try{
        const id= req.user._id; let recruiter;
        console.log(req.body);

        if(req.body.type === 'default') {
            const filterField= filterObj(req.body, 'preference', 'bio');

            recruiter= await Recruiter.findOneAndUpdate({userRecruiter: id}, filterField, {
                new: true,
                runValidators: true
            });

            if(!recruiter){
                throw new Error('Recruiter not found');
            }

            return res.status(200).json({
                status: 'Success',
                data: {
                    finalRecruiter: recruiter
                }   
            });
        }

        else if(req.body.type ==='jd'){
            const filterField= filterObj(req.body, 'company', 'companySize', 'jobRole', 'location', 'terms', 'duration', 'durationType', 'salary', 'salaryType', 'aboutCompany', 'aboutRole', 'responsibilities', 'requirements', 'applyLink', 'activeTill');

            // const jobdescription= await Jobdescription.create(filterField);
            const jobdescription= new Jobdescription(filterField);
            recruiter= Recruiter.findOne({userRecruiter: id});
            recruiter._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            recruiter = await recruiter.exec();
            recruiter.jobDescription= jobdescription._id;

            await Promise.all([jobdescription.save(), recruiter.save()]);
        }

        else{
            return res.status(400).json({
                status: 'fail',
                message: 'Bad request !' 
            });
        }

        const finalRecruiter= await Recruiter.findOne({userRecruiter: id}); // This time I want to populate all fields

        res.status(200).json({
            status: 'Success',
            data: {
                finalRecruiter
            }
        });
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error adding field(s). Please try again...'
        });
    }
}

// {user, body(id, type, other fields)}
exports.editFields= async (req, res) => {
    try{
        const id= req.user._id; 
        const ToBeUpdateFieldId= req.body.id; // of jobdescription

        if(req.body.type === 'default') {
            const filterField= filterObj(req.body, 'preference', 'bio');

            const recruiter= await Recruiter.findOneAndUpdate({userRecruiter: id}, filterField, {
                new: true,
                runValidators: true
            });

            if(!recruiter){
                throw new Error('Recruiter not found');
            }

            return res.status(200).json({
                status: 'Success',
                data: {
                    finalRecruiter: recruiter
                }   
            });
        }

        else if(req.body.type ==='jd'){
            const filterField= filterObj(req.body, 'company', 'companySize', 'jobRole', 'location', 'terms', 'duration', 'durationType', 'salary', 'salaryType', 'aboutCompany', 'aboutRole', 'responsibilities', 'requirements', 'applyLink', 'activeTill');

            await Jobdescription.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
                new: true,
                runValidators: true
            });
        }

        else{
            return res.status(400).json({
                status: 'fail',
                message: 'Bad request !' 
            });
        }

        const finalRecruiter= await Recruiter.findOne({userRecruiter: id}); // This time I want to populate all fields

        res.status(200).json({
            status: 'Success',
            data: {
                finalRecruiter
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error updating field(s). Please try again...'
        });
    }
}

// {user, body(type, id)}
exports.deleteFields= async (req, res) => {
    // Step1: remove from corresponding collection (jd)
    // Step2: remove from Recruiter array

    try{
        const id= req.user._id; 
        const ToBeUpdateFieldId= req.body.id; // of education/project/skill/achievement/profilelink/company
        let recruiter;

        if(req.body.type ==='jd'){
            recruiter= Recruiter.findOne({userRecruiter: id});
            recruiter._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            recruiter = await recruiter.exec();
            recruiter.jobDescription= null;

            await Promise.all([Jobdescription.deleteOne({_id: ToBeUpdateFieldId}), recruiter.save()]);
        }

        else{
            return res.status(400).json({
                status: 'fail',
                message: 'Bad request !' 
            });
        }

        const finalRecruiter= await Recruiter.findOne({userRecruiter: id}); // This time I want to populate all fields

        res.status(200).json({
            status: 'Success',
            data: {
                finalRecruiter
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error deleting job description. Please try again...'
        });
    }
}
