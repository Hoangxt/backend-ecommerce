const express = require('express');
const router = express.Router();
// controller
const inventoryController = require('../../controllers/inventory.controller');
// auth
const { authenticationV2 } = require('../../auth/authUtils');

router.use(authenticationV2);

router.post('/add-stock', inventoryController.addStockToInventory);

// router
module.exports = router;
