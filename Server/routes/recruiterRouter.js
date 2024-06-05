
const express= require('express');
const router= express.Router();
const recruiterController= require('../controllers/recruiterController');
const authController= require('../controllers/authController');

router.route('/') // tested
    .get(authController.protectedAccess, recruiterController.getRecruiter);

router.route('/add') // tested
    .post(authController.protectedAccess, recruiterController.addFields);

router.route('/edit') // tested
    .patch(authController.protectedAccess, recruiterController.editFields);

router.route('/remove') // tested
    .patch(authController.protectedAccess, recruiterController.deleteFields);

  
module.exports= router;