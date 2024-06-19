const express = require('express');
const router = express.Router();

const rbacController = require('../../controllers/rbac.controller');

router.post('/roles', rbacController.newRole);
router.get('/roles', rbacController.listRoles);

router.post('/resources', rbacController.newResource);
router.get('/resources', rbacController.listResources);

module.exports = router;
