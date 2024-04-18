const cloudinary = require('../configs/config.cloudinary');
// 1. upload from url image

const uploadImageFromUrl = async () => {
  try {
    const urlImage =
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png';
    const folderName = 'product/shopId',
      newFileName = 'googlelogo_color_272x92dp.png';

    const result = await cloudinary.uploader.upload(urlImage, {
      folder: folderName,
      public_id: newFileName,
    });
    console.log(result);

    return result;
  } catch (error) {
    console.error('Error uploading image', error);
  }
};

// 2. upload from local image
const uploadImageFromLocal = async ({
  pathImage,
  folderName = 'product/8409',
}) => {
  try {
    const result = await cloudinary.uploader.upload(pathImage, {
      folder: folderName,
      public_id: 'thumb',
    });
    console.log(result);

    return {
      image_url: result.secure_url,
      shop_id: 8409,
      thum_url: await cloudinary.url(result.public_id, {
        width: 100,
        height: 100,
        format: 'jpg',
      }),
    };
  } catch (error) {
    console.error('Error uploading image', error);
  }
};

// 3. upload from local image (multiple images)

const uploadImageFromLocalFiles = async (
  files,
  folderName = 'product/8409'
) => {
  try {
    console.log('files::', files, folderName);
    if (!files) return;
    const uploadedUrls = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });
      uploadedUrls.push({
        image_url: result.secure_url,
        shop_id: 8409,
        thum_url: await cloudinary.url(result.public_id, {
          width: 100,
          height: 100,
          format: 'jpg',
        }),
      });
    }
    console.log(uploadedUrls);
    return uploadedUrls;
  } catch (error) {
    console.error('Error uploading image', error);
  }
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalFiles,
};
