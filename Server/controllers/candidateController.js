
const Candidate= require('../models/candidateModel');
const Company= require('../models/CandidateCVmodel/companyModel');
const Project= require('../models/CandidateCVmodel/projectModel');
const Skill= require('../models/CandidateCVmodel/skillModel');
const Education= require('../models/CandidateCVmodel/educationModel');
const Achievement= require('../models/CandidateCVmodel/achievementModel');
const Profilelink= require('../models/CandidateCVmodel/profilelinkModel');

exports.getCandidate= async (req, res) => {
    try{
        const id= req.user._id;

        const candidate= await Candidate.findOne({userCandidate: id});

        if(!candidate){
            throw new Error('Candidate not found');
        }

        res.status(200).json({
            status: 'Success',
            data: {
                finalCandidate: candidate
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error getting candidate. Please try again...'
        });
    }
}


const filterObj = (obj, ...allowedFields) =>{ // 'obj' is req.body, and 'allowedField' is array of name of field which are supposed to be updated
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

        const id= req.user._id; let candidate;

        if(req.body.type === 'default') {
            const filterField= filterObj(req.body, 'relocate', 'resumeLink', 'preference', 'bio');

            candidate= await Candidate.findOneAndUpdate({userCandidate: id}, filterField, {
                new: true,
                runValidators: true
            });

            if(!candidate){
                throw new Error('Candidate not found');
            }

            return res.status(200).json({
                status: 'Success',
                data: {
                    finalCandidate: candidate
                }   
            });
        }

        else if(req.body.type ==='company'){
            const filterField= filterObj(req.body, 'name', 'from', 'to', 'role', 'description');

            // const company= await Company.create(filterField);
            const company= new Company (filterField);
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.pastCompanies.push(company._id);

            await Promise.all([company.save(), candidate.save()]);
        }

        else if(req.body.type ==='achievement'){
            const filterField= filterObj(req.body, 'description');

            // const achievement= await Achievement.create(filterField);
            const achievement= new Achievement (filterField);
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.achievements.push(achievement._id);

            await Promise.all([achievement.save(), candidate.save()]);
        }

        else if(req.body.type === 'project'){
            const filterField= filterObj(req.body, 'name', 'link', 'description');

            // const project= await Project.create(filterField);
            const project= new Project (filterField);
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.projects.push(project._id);

            await Promise.all([project.save(), candidate.save()]);
        }

        else if(req.body.type === 'skill'){
            const filterField= filterObj(req.body, 'name');

            // const skill= await Skill.create(filterField);
            const skill= new Skill (filterField);
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.skills.push(skill._id);

            await Promise.all([skill.save(), candidate.save()]);
        }

        else if(req.body.type === 'education'){
            const filterField= filterObj(req.body, 'name', 'degree', 'from', 'to', 'major', 'cgpa');

            // const education= await Education.create(filterField);
            const education= new Education (filterField);
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.educations.push(education._id);

            await Promise.all([education.save(), candidate.save()]);
        }

        else if(req.body.type === 'profilelink'){
            const filterField= filterObj(req.body, 'name', 'link');

            // const profilelink= await Profilelink.create(filterField);
            const profilelink= new Profilelink (filterField);
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.profileLinks.push(profilelink._id);

            await Promise.all([profilelink.save(), candidate.save()]);
        }

        else{
            return res.status(400).json({
                status: 'fail',
                message: 'Bad request !' 
            });
        }

        const finalCandidate= await Candidate.findOne({userCandidate: id}); // This time I want to populate all fields

        res.status(201).json({
            status: 'Success',
            data: {
                finalCandidate
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

// {user, body(type, id, other fields)}
exports.editFields= async (req, res) => {
    try{

        const id= req.user._id; 
        const ToBeUpdateFieldId= req.body.id; // of education/project/skill/achievement/profilelink/company

        if(req.body.type==='default'){
            const filterField= filterObj(req.body, 'relocate', 'resumeLink', 'preference', 'bio');

            const candidate= await Candidate.findOneAndUpdate({userCandidate: id}, filterField, {
                new: true,
                runValidators: true
            });

            if(!candidate){
                throw new Error('Candidate not found');
            }

            return res.status(200).json({
                status: 'Success',
                data: {
                    finalCandidate: candidate
                }   
            });
        }

        else if(req.body.type ==='company'){
            const filterField= filterObj(req.body, 'name', 'from', 'to', 'role', 'description');

            await Company.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
                new: true,
                runValidators: true
            });
        }

        else if(req.body.type ==='achievement'){
            const filterField= filterObj(req.body, 'description');

            await Achievement.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
                new: true,
                runValidators: true
            });
        }

        else if(req.body.type === 'project'){
            const filterField= filterObj(req.body, 'name', 'link', 'description');

            await Project.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
                new: true,
                runValidators: true
            });
        }

        else if(req.body.type === 'skill'){
            const filterField= filterObj(req.body, 'name');

            await Skill.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
                new: true,
                runValidators: true
            });
        }

        else if(req.body.type === 'education'){
            const filterField= filterObj(req.body, 'name', 'degree', 'from', 'to', 'major', 'cgpa');

            await Education.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
                new: true,
                runValidators: true
            });
        }

        else if(req.body.type === 'profilelink'){
            const filterField= filterObj(req.body, 'name', 'link');

            await Profilelink.findByIdAndUpdate(ToBeUpdateFieldId, filterField, {
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

        const candidate= await Candidate.findOne({userCandidate: id});

        res.status(200).json({
            status: 'Success',
            data: {
                finalCandidate: candidate
            }   
        });
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
    // Step1: remove from corresponding collection
    // Step2: remove from Candidate array

    try{
        const id= req.user._id; 
        const ToBeUpdateFieldId= req.body.id; // of education/project/skill/achievement/profilelink/company
        let candidate;

        if(req.body.type ==='company'){
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.pastCompanies= candidate.pastCompanies.filter(el => el.toString() !== ToBeUpdateFieldId);

            await Promise.all([Company.deleteOne({_id: ToBeUpdateFieldId}), candidate.save()]);
        }

        else if(req.body.type ==='achievement'){
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.achievements= candidate.achievements.filter(el => el.toString() !== ToBeUpdateFieldId);

            await Promise.all([Achievement.deleteOne({_id: ToBeUpdateFieldId}), candidate.save()]);
        }

        else if(req.body.type === 'project'){
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.projects= candidate.projects.filter(el => el.toString() !== ToBeUpdateFieldId);

            await Promise.all([Project.deleteOne({_id: ToBeUpdateFieldId}), candidate.save()]);
        }

        else if(req.body.type === 'skill'){
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.skills= candidate.skills.filter(el => el.toString() !== ToBeUpdateFieldId);

            await Promise.all([Skill.deleteOne({_id: ToBeUpdateFieldId}), candidate.save()]);
        }

        else if(req.body.type === 'education'){
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.educations= candidate.educations.filter(el => el.toString() !== ToBeUpdateFieldId);

            await Promise.all([Education.deleteOne({_id: ToBeUpdateFieldId}), candidate.save()]);
        }

        else if(req.body.type === 'profilelink'){
            candidate= Candidate.findOne({userCandidate: id});
            candidate._skipMiddleware = true; // for skipping populate functionality in pre query middleware (performance gain)
            candidate = await candidate.exec();
            candidate.profileLinks= candidate.profileLinks.filter(el => el.toString() !== ToBeUpdateFieldId);

            await Promise.all([Profilelink.deleteOne({_id: ToBeUpdateFieldId}), candidate.save()]);
        }

        else{
            return res.status(400).json({
                status: 'fail',
                message: 'Bad request !' 
            });
        }

        const finalCandidate= await Candidate.findOne({userCandidate: id});

        res.status(200).json({
            status: 'Success',
            data: {
                finalCandidate
            }
        });
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error deleting field(s). Please try again...'
        });
    }
}
