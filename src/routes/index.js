const express = require('express');
const router = express.Router();
// check auth
const { apiKey, permission } = require('../auth/checkAuth');

// health check application
router.use('/healthcheck', require('./health'));

// check apiKey
router.use(apiKey);

// check permission
// router.use(permission('0000'));

// init routes
router.use('/api/v1/profile', require('./profile'));
router.use('/api/v1/rbac', require('./rbac'));
router.use('/api/v1/cart', require('./cart'));
router.use('/api/v1/order', require('./order'));
router.use('/api/v1/discount', require('./discount'));
router.use('/api/v1/inventory', require('./inventory'));
router.use('/api/v1/product', require('./product'));
router.use('/api/v1/product/upload', require('./upload'));
router.use('/api/v1/comment', require('./comment'));
router.use('/api/v1/notification', require('./notification'));
router.use('/api/v1/auth', require('./auth'));

module.exports = router;
