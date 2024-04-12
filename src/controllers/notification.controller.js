const { NotificationService } = require('../services/notification.service');
const catchAsync = require('../helpers/catch.async');
const { OK } = require('../core/success.response');

class NotificationController {
  pushNotification = catchAsync(async (req, res, next) => {
    OK(
      res,
      'Push notification success',
      await NotificationService.pushNotificationToSystem(req.body)
    );
  });

  listNotificationByUser = catchAsync(async (req, res, next) => {
    OK(
      res,
      'Create new notification by user success',
      await NotificationService.listNotificationByUser(req.query)
    );
  });
}

module.exports = new NotificationController();
