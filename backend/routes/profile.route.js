const express = require('express');
const router = express.Router();
const authUtils = require('../utils/auth.js');
const ProfileController = require('../controllers/profile.controller.js');

router.get('/', authUtils.auth, ProfileController.getUserProfile);
router.put('/', authUtils.auth, ProfileController.updateProfile);
router.get('/getSubscribedTo', authUtils.isAuthenticated, ProfileController.getSubscribedTo);
router.put('/updateChecklist', authUtils.isAuthenticated, ProfileController.updateChecklist);

module.exports = router;