const express = require('express');
const { profiles, profile } = require('../../controllers/profile.controller');
const router = express.Router();
const granAccess = require('../../middleware/rbac');
// admin
router.get('/view-all-profiles', granAccess('readAny', 'profile'), profiles);
// shop
router.get('/viewOwn', granAccess('readOwn', 'profile'), profile);

module.exports = router;
