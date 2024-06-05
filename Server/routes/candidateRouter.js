
const express= require('express');
const router= express.Router();
const candidateController= require('../controllers/candidateController');
const authController= require('../controllers/authController');

router.route('/')  // tested
    .get(authController.protectedAccess, candidateController.getCandidate);

router.route('/add')  // tested
    .post(authController.protectedAccess, candidateController.addFields);

router.route('/edit')  // tested
    .patch(authController.protectedAccess, candidateController.editFields);

router.route('/remove')  // tested
    .patch(authController.protectedAccess, candidateController.deleteFields);
  
module.exports= router;