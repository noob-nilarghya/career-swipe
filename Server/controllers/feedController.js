
const Recruiter= require('../models/recruiterModel');
const Candidate= require('../models/candidateModel');
const User= require('../models/userModel');
const emailLib= require('../../email');

// {user, body(preference), params(batchSize, offsetLength)}
exports.getFeed= async (req, res) => {
    try{
        const batchSize= parseInt(req.params.batchSize);
        const offset= parseInt(req.params.offsetLength);
        const role= req.user.role;

        // Get all the visitedIDs array from logged in user (req.user.visitedID) [keep a track of prefernce of logged in user with the help of global UI state in frontend]
        const preference= req.body.preference;

        // const visitedID= req.user.visitedID; // --> we can't do like this, as with each right/left swipe, visiterID will be changed which will not get reflected here
        // So we need to fetch it afresh from DB
        const result= await User.findOne({_id: req.user._id}).select('visitedID');
        const visitedID= result.visitedID;

        let finalResult; 
        // search from Candidate/Recruiter schema for those ID which are not visitedID (userCandidate/userRecruiter) and of given preference

        if(role === 'candidate'){
            finalResult= await Recruiter.find({userRecruiter: {$nin: visitedID}, preference: {$in: preference}}).skip(offset).limit(batchSize);
        }
        else if(role === 'recruiter'){
            finalResult= await Candidate.find({userCandidate: {$nin: visitedID}, preference: {$in: preference}}).skip(offset).limit(batchSize);
        }
        
        res.status(200).json({
            status: 'Success',
            data: {
                finalResult
            }
        });
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error getting feed. Please try again...'
        });
    }
}

// {user, body(currentUserID)}
exports.rightSwipe= async (req, res) => {
    // matchedID, rightSwipedID, visitedID
    try{
        const myID= req.user._id.toString();
        const currentUserID= req.body.currentUserID;
        
        // push current user's ID in rightSwipedID array
        let myAcc= await User.findOne({_id: myID});
        myAcc.rightSwipedID.push(currentUserID);

        // push current user's ID in visitedID array
        myAcc.visitedID.push(currentUserID);

        // check if current user's rightSwipedID array contains your ID or not. If yes -> It's a match
        let currentUserAcc= await User.findOne({_id: currentUserID});

        let isItMatched= false;

        for(let i=0; i<currentUserAcc.rightSwipedID.length; i++){
            if(currentUserAcc.rightSwipedID[i].toString() === myID){
                isItMatched= true;

                // If its a match -> (push your ID in current user's matchedID array, and remove your ID from current user's rightSwipedID array) 
                currentUserAcc.matchedID.push(myID);
                currentUserAcc.rightSwipedID= currentUserAcc.rightSwipedID.filter(id => id.toString() !== myID);

                // && (push current user's ID in your matchedID array, and remove current user's ID from your rightSwipedID array)
                myAcc.matchedID.push(currentUserID);
                myAcc.rightSwipedID= myAcc.rightSwipedID.filter(id => id.toString() !== currentUserID);

                break;
            }
        }
        // Temporarily set validateBeforeSave to false
        User.schema.set('validateBeforeSave', false);

        await Promise.all([myAcc.save(), currentUserAcc.save()]);

        // Temporarily set validateBeforeSave to true
        User.schema.set('validateBeforeSave', true);

        if(isItMatched){
            await new emailLib(myAcc).sendNewMatch();
        }
        
        res.status(200).json({
            status: 'Success',
            matched: isItMatched
        });
        
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error making right swipe. Please try again...'
        });
    }
}

// {user, body(currentUserID)}
exports.leftSwipe= async (req, res) => {
    // matchedID, rightSwipedID, visitedID
    try{
        const myID= req.user._id;
        const currentUserID= req.body.currentUserID;
        
        // push current user's ID in visitedID array
        let myAcc= await User.findOne({_id: myID});
        myAcc.visitedID.push(currentUserID);

        // Temporarily set validateBeforeSave to false
        User.schema.set('validateBeforeSave', false);

        await myAcc.save();
        
        // Temporarily set validateBeforeSave to true
        User.schema.set('validateBeforeSave', true);

        res.status(200).json({
            status: 'Success'
        })
        
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error making left swipe. Please try again...'
        });
    }
}