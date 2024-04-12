const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'Discounts';

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: 'fixed_amount', // percentage
    },
    // so tien giam gia vd: 10.000vnd
    discount_value: {
      type: String,
      required: true,
    },
    // mã giảm giá vd: 123456
    discount_code: {
      type: String,
      required: true,
    },
    discount_start_day: {
      type: Date,
      required: true,
    },
    discount_end_day: {
      type: Date,
      required: true,
    },
    // Số lượng mã giảm giá tối đa được áp dụng
    discount_max_uses: {
      type: Number,
      required: true,
    },
    discount_uses_count: {
      type: Number,
      required: true,
    },
    // ai đã sử dụng mã giảm giá
    discount_users_used: {
      type: Array,
      default: [],
    },
    // số lượng mã giảm giá tối đa được áp dụng cho 1 user
    discount_max_uses_per_user: {
      type: Number,
      required: true,
    },
    // số tiền tối thiểu để sử dụng mã giảm giá
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    // shop_id nào được áp dụng mã giảm giá
    discount_shop_id: {
      type: Schema.Types.ObjectId,
      ref: 'Shop',
    },
    // mã giảm giá có đang hoạt động không
    discount_is_active: {
      type: Boolean,
      required: true,
    },
    // áp dụng cho tất cả sản phẩm hay chỉ áp dụng cho sản phẩm cụ thể
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    },
    // danh sách sản phẩm được áp dụng mã giảm giá
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
