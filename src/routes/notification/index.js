const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notification.controller');
const { authenticationV2 } = require('../../auth/authUtils');
// Not login

// start authentication //
router.use(authenticationV2);
// end authentication //

router.post('', notificationController.pushNotification);
router.get('', notificationController.listNotificationByUser);

module.exports = router;
