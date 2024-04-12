const { model, Schema } = require('mongoose');

// Hàng tồn kho
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

const inventorySchema = new Schema(
  {
    // Tên model mà nó sẽ tham chiếu đến (tên model khai báo ở file product.model.js)
    inventory_product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    // Vị trí hàng tồn kho
    inventory_location: {
      type: String,
      default: 'unKnow',
    },
    // Số lượng hàng tồn kho
    inventory_stock: {
      type: Number,
      required: true,
    },
    // Tên model mà nó sẽ tham chiếu đến (tên model khai báo ở file shop.model.js)
    inventory_shop_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    // Mảng các đơn hàng đang đặt hàng
    inventory_reservations: {
      type: Array,
      default: [],
    },
    /*
        cardId: ,
        stock: 1,
        createdOn: ,
     */
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
