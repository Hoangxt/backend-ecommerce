const catchAsync = require('../helpers/catch.async');
// status response
const { OK } = require('../core/success.response');

const profiles = [
  {
    user_id: 1,
    user_name: 'admin',
    user_avt: 'image.com/user_1',
  },
  {
    user_id: 2,
    user_name: 'A2',
    user_avt: 'image.com/user_2',
  },
  {
    user_id: 3,
    user_name: 'A3',
    user_avt: 'image.com/user_3',
  },
];
class ProfileController {
  // admin
  profiles = catchAsync(async (req, res) => {
    OK(res, 'View all profiles success', await profiles);
  });
  // shop
  profile = catchAsync(async (req, res) => {
    OK(res, 'View one profile', await profiles[req.user.userId - 1]);
  });
}

module.exports = new ProfileController();
