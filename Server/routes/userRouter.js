
const express= require('express');
const router= express.Router();
const authController= require('../controllers/authController');
const userPhotoController= require('../controllers/userPhotoController');


router.route('/register')                                       // tested
    .post(authController.register); 

router.route('/login') 
    .post(authController.login); // tested

router.route('/logout')                                          // tested
    .get(authController.protectedAccess, authController.logOut); 

router.route('/forgot-password')
    .post(authController.forgotPassword);

router.route('/reset-password')
    .patch(authController.resetPassword);

router.route('/update-info')                                     // tested
    .patch( authController.protectedAccess, 
            userPhotoController.uploadPhoto, 
            userPhotoController.userPhotoProcessing, 
            authController.updateInfo);                         

router.route('/update-password')
    .patch(authController.protectedAccess, authController.updatePassword); // tested

router.route('/deactivate-account')
    .patch(authController.protectedAccess, authController.deactivateUser); // tested


module.exports= router;