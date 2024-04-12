const { model, Schema } = require('mongoose');
const { NotifyTypeConstant } = require('../constants/notify-type.constant');

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-001: new Promotion
// SHOP-001: new Product by User following

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: Object.values(NotifyTypeConstant),
      required: true,
    },
    noti_sender_id: { type: Schema.Types.ObjectId, required: true },
    noti_received_id: { type: Number, required: true, ref: 'Shop' },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
