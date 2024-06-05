
const express= require('express');
const router= express.Router();

const authController= require('../controllers/authController');
const feedController= require('../controllers/feedController');

router.route('/batch/:batchSize/offset/:offsetLength')                  // tested
    .post(authController.protectedAccess, feedController.getFeed);

router.route('/right-swipe')                                            // tested
    .post(authController.protectedAccess, feedController.rightSwipe);

router.route('/left-swipe')                                             // tested
    .post(authController.protectedAccess, feedController.leftSwipe);


module.exports= router;