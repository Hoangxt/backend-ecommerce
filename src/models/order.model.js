const { model, Schema } = require('mongoose');
// Erase if already required

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
  {
    orderUserId: {
      type: Number,
      required: true,
    },
    /**
     * orderCheckout: {
     *    totalPrice,
     *    totalApplyDiscount,
     *    feeShip
     * }
     */
    orderCheckout: {
      type: Object,
      default: {},
    },
    /**
     * {
     *    street,
     *    city,
     *    state,
     *    country,
     *    zipCode,
     * }
     */
    orderShipping: {
      type: Object,
      default: {},
    },
    orderPayment: {
      type: Object,
      default: {},
    },
    // nhưng sản phẩm trong giỏ hàng (shop_order_ids_new)
    orderProducts: {
      type: Array,
      required: true,
    },
    orderTrackingNumber: {
      type: String,
      default: '#0001230623', // 001 23/06/2023
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
