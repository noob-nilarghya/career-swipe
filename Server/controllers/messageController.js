
const Message= require('../models/messageModel');
const Conversation= require('../models/conversationModel');
const User= require('../models/userModel');
const Blockedconversation= require('../models/blockedConversation');
const Candidate = require('../models/candidateModel');
const Recruiter = require('../models/recruiterModel');
const { getRecieverSocketId, io } = require('../socket/socket');

exports.getListOfMatchedUser= async (req, res) => {
    try{
        // const matchedID= req.user.messageID; // --> we can't do like this, as with each block user, messageID will be changed which will not get reflected here
        // So we need to fetch it afresh from DB
        const result= await User.findOne({_id: req.user._id}).select('matchedID');
        const matchedID= result.matchedID;

        let arrToBeResolved= []; // array of pending promised. --> To be resolved all at once using Promise.all
        for(let i=0; i<matchedID.length; i++){
            arrToBeResolved.push( User.findOne({_id: matchedID[i]}).select('username age photo') );
        }

        let listOfMatchedUser= await Promise.all(arrToBeResolved);
        listOfMatchedUser= listOfMatchedUser.filter((user)=> user!==null);

        res.status(200).json({
            status: 'Success',
            data: {
                userArray: listOfMatchedUser
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error getting list of conversation. Please try again...'
        });
    }
}

exports.getListOfConversation= async (req, res) => {
    try{
        // const matchedID= req.user.messageID; // --> we can't do like this, as with each block user, messageID will be changed which will not get reflected here
        // So we need to fetch it afresh from DB
        const result= await User.findOne({_id: req.user._id}).select('messageID blockedID');
        const messageID= result.messageID;
        const blockedID= result.blockedID;

        let arrToBeResolved= []; // array of pending promised. --> To be resolved all at once using Promise.all
        for(let i=0; i<messageID.length; i++){
            arrToBeResolved.push( User.findOne({_id: messageID[i]}).select('username age photo') );
        }

        let blockedArrToBeResolved=[];
        for(let i=0; i<blockedID.length; i++){
            blockedArrToBeResolved.push( User.findOne({_id: blockedID[i]}).select('username age photo') );
        }

        let listOfConversation= await Promise.all(arrToBeResolved);
        listOfConversation= listOfConversation.filter((user) => user!==null);
        let blockedUser= await Promise.all(blockedArrToBeResolved);
        blockedUser= blockedUser.filter((user) => user!==null);

        res.status(200).json({
            status: 'Success',
            data: {
                userArray: listOfConversation,
                blockedArray: blockedUser
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error getting list of conversation. Please try again...'
        });
    }
}

exports.getRoleInfo= async (req, res) => {
    try{
        const id= req.body.otherUserID; const role= req.body.role;
        let roleInfo;

        if(role === 'candidate') roleInfo= await Candidate.findOne({userCandidate: id});
        else if(role === 'recruiter') roleInfo= await Recruiter.findOne({userRecruiter: id});

        if(!roleInfo){
            throw new Error(`${role} not found`);
        }

        res.status(200).json({
            status: 'Success',
            data: {
                finalRoleUser: roleInfo
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: `Error getting user's info. Please try again...`
        });
    }
}


//{user, body(message), params(recieverID)}
exports.firstSendMessage= async (req, res) => {
    try{
        const myID= req.user._id.toString();
        const currentUserID= req.params.recieverID;
        const message= req.body.message;

        const PromiseArr= await Promise.all([
            Blockedconversation.findOne({participants: {$all: [myID, currentUserID]}}), 
            User.findById(currentUserID)
        ]);

        if(PromiseArr[0] || !PromiseArr[1]){ // if pair is found on blocklist || otherUser deactivated his acc
            return res.status(400).json({
                status: 'fail',
                message: 'You cannot send reply to this conversation.'
            });
        }

        // first of all -> (Remove your ID from current user's matchedID and push it to current user's messageID) && (Remove current User's ID from your matchedID and push it to your messageID)
        let currentUserAcc= await User.findOne({_id: currentUserID});
        currentUserAcc.matchedID= currentUserAcc.matchedID.filter( id => id.toString() !== myID );
        currentUserAcc.messageID.push(myID);

        let myAcc= await User.findOne({_id: myID});
        myAcc.matchedID= myAcc.matchedID.filter( id => id.toString() !== currentUserID );
        myAcc.messageID.push(currentUserID);

        // await Promise.all([currentUserAcc.save(), myAcc.save()]);

        // ofcourse sender and reciever are going to have their conversation for first time, so surely they will not have any conversation document corresponding to that
        let conversation= await Conversation.create({participants: [myID, currentUserID]});


        const newMessage= new Message({
            senderID: myID,
            recieverID: currentUserID,
            messageContent: message
        });

        if(newMessage){
            conversation.messageID.push(newMessage._id);
        }

        // Temporarily set validateBeforeSave to false
        User.schema.set('validateBeforeSave', false);

        await Promise.all([currentUserAcc.save(), myAcc.save(), newMessage.save(), conversation.save()]);

        // Temporarily set validateBeforeSave to true
        User.schema.set('validateBeforeSave', true);

        // Socket IO code
        const recieverSocketId= getRecieverSocketId(currentUserID);
        if(recieverSocketId) { // current user is logged in
            // send event to specific target
            io.to(recieverSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json({
            status: 'Success',
            data: {
                message: newMessage
            }
        });
        
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error sending your first message. Please try again...'
        });
    }
}


//{user, body(message), params(recieverID)}
exports.sendMessage= async (req, res) => {
    try{
        const senderID= req.user._id;
        const recieverID= req.params.recieverID;
        const message= req.body.message;

        const PromiseArr= await Promise.all([
            Blockedconversation.findOne({participants: {$all: [senderID, recieverID]}}), 
            User.findById(recieverID)
        ]);

        if(PromiseArr[0] || !PromiseArr[1]){ // if pair is found on blocklist || otherUser deactivated his acc
            console.log("Here");
            return res.status(400).json({
                status: 'fail',
                message: 'You cannot send reply to this conversation.'
            });
        }

        let conversation= await Conversation.findOne({participants: {$all: [senderID, recieverID]}});

        const newMessage= new Message({
            senderID: senderID,
            recieverID: recieverID,
            messageContent: message
        });

        if(newMessage){
            conversation.messageID.push(newMessage._id);
        }

        await Promise.all([newMessage.save(), conversation.save()]);

        // Socket IO code
        const recieverSocketId= getRecieverSocketId(recieverID);
        if(recieverSocketId) { // current user is logged in
            // send event to specific target
            io.to(recieverSocketId).emit('newMessage', newMessage);
        }

        res.status(200).json({
            status: 'Success',
            data: {
                message: newMessage
            }
        })
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error sending message. Please try again...'
        });
    }
}


// {user, params(otherUserID)}
exports.getMessages= async (req, res) => {
    try{
        const senderID= req.user._id;
        const recieverID= req.params.otherUserID;

        const conversation= await Conversation.findOne({participants: {$all: [senderID, recieverID]}}).populate('messageID');

        if(!conversation){
            return res.status(200).json({
                status: 'Success',
                data: {
                    message: []
                }
            })
        }

        res.status(200).json({
            status: 'Success',
            data: {
                message: conversation.messageID
            }
        })

    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error getting messages. Please try again...'
        });
    }
}


// {user, body(toBeBlockedID)}
exports.blockUser= async (req, res) => {
    try{
        const toBeBlockedID= req.body.toBeBlockedID;
        const myID= req.user._id.toString();

        const isBlckd= await Blockedconversation.findOne({participants: {$all: [myID, toBeBlockedID]}});
        if(isBlckd){
            return res.status(200).json({
                status: 'fail',
                message: "User is already blocked",
                blocked: true
            });
        }

        const conversation= await Conversation.findOne({participants: {$all: [myID, toBeBlockedID]}});
        if(!conversation){
            return res.status(200).json({
                status: 'fail',
                message: "You can't block an user without having a conversation",
                blocked: false
            });
        }

        // remove myID from current user's messageID array, and push it into blockedID array
        let currentUserAcc= await User.findOne({_id: toBeBlockedID});
        currentUserAcc.messageID= currentUserAcc.messageID.filter(id => id.toString() !== myID);
        currentUserAcc.blockedID.push(myID);

        // remove current user's ID from my messageID array
        let myAcc= await User.findOne({_id: myID});
        myAcc.messageID= myAcc.messageID.filter(id => id.toString() !== toBeBlockedID);
        myAcc.blockedID.push(toBeBlockedID);

        // Temporarily set validateBeforeSave to false
        User.schema.set('validateBeforeSave', false);

        await Promise.all([currentUserAcc.save(), myAcc.save(), Blockedconversation.create({participants: [myID, toBeBlockedID]})]);

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
            message: 'Error blocking user. Please try again...'
        });
    }
}

// {user, params(otherUserID)}
exports.isBlocked= async (req, res) => {
    try{
        const otherUserID= req.params.otherUserID;
        const myID= req.user._id;

        const PromiseArr= await Promise.all([
            Blockedconversation.findOne({participants: {$all: [myID, otherUserID]}}), 
            User.findById(otherUserID)
        ]);

        if(PromiseArr[0] || !PromiseArr[1]){ // if pair is found on blocklist || otherUser deactivated his acc
            return res.status(200).json({
                status: 'success',
                blocked: true
            });
        }
        res.status(200).json({
            status: 'success',
            blocked: false
        });
    }
    catch(err){
        console.log(err.message);
        res.status(404).json({
            status: 'fail',
            message: 'Error checking blocked status. Please try again...'
        });
    }
}