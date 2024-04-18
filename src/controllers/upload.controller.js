const { BAD_REQUEST } = require('../core/statusCodes');
const { OK } = require('../core/success.response');
const catchAsync = require('../helpers/catch.async');
const {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
} = require('../services/upload.service');

class UploadController {
  uploadFile = catchAsync(async (req, res) => {
    OK(res, 'Upload file success', await uploadImageFromUrl());
  });
  uploadFileThumb = catchAsync(async (req, res) => {
    const { file } = req;
    if (!file) {
      throw new BAD_REQUEST('Please upload a file');
    }
    OK(res, 'Upload file success', await uploadImageFromLocal(file));
  });
  uploadFiles = catchAsync(async (req, res) => {
    const { files } = req;
    if (!files) {
      throw new BAD_REQUEST('Please upload a file');
    }
    OK(res, 'Upload file success', await uploadImageFromLocalFiles(files));
  });
}

module.exports = new UploadController();
