const express = require('express');
const router = express.Router();
// controller
const uploadController = require('../../controllers/upload.controller');
const { authenticationV2 } = require('../../auth/authUtils');

const { uploadDisk } = require('../../configs/config.multer');

// authentication
router.use(authenticationV2);
router.post('/product', uploadController.uploadFile);
router.post(
  '/product/thumb',
  uploadDisk.single('file'),
  uploadController.uploadFile
);
router.post(
  '/product/multiple',
  uploadDisk.array('files', 5),
  uploadController.uploadFiles
);

module.exports = router;
