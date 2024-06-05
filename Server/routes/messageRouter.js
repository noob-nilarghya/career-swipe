
const express= require('express');
const router= express.Router();
const authController= require('../controllers/authController');
const messageController= require('../controllers/messageController');

router.route('/get-list-of-matched-user')                                                               // tested
    .get(authController.protectedAccess, messageController.getListOfMatchedUser);

router.route('/get-list-of-conversation')                                                               // tested
    .get(authController.protectedAccess, messageController.getListOfConversation);

router.route('/role-info')
    .post(authController.protectedAccess, messageController.getRoleInfo);                               // tested

router.route('/first-send-message/:recieverID') // me send message to reciever for the first time       // tested
    .post(authController.protectedAccess, messageController.firstSendMessage);

router.route('/send/:recieverID') // me send message to reciever                                        // tested
    .post(authController.protectedAccess, messageController.sendMessage);

router.route('/get/:otherUserID') // sender send message to me                                          // tested
    .get(authController.protectedAccess, messageController.getMessages);

router.route('/block-user')                                                                             // tested
    .post(authController.protectedAccess, messageController.blockUser);

router.route('/isBlocked/:otherUserID')                                                                 // tested
    .get(authController.protectedAccess, messageController.isBlocked);


module.exports= router;