// handle error
const { BusinessLogicError } = require('../core/error.response');
// model
const discountModel = require('../models/discount.model');
// repository
const { findAllProducts } = require('../models/repositories/product.repo');
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require('../models/repositories/discount.repo');
// utils
const { convert2ObjectId } = require('../utils');
/*
  DiscountService
  1 - Generate discount code [Shop | Admin]
  2 - Get discount amount [User ]
  3 - Get all discount codes [User | Admin]
  4 - Verify discount code [User]
  5 - Delete discount code [Admin | Shop]
  6 - Cancel discount code [User]
*/

class DiscountService {
  // 1. Generate discount code [Shop | Admin]
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      users_used,
      value,
      max_value,
      max_users,
      users_count,
      max_uses_per_user,
    } = payload;

    // validate
    if (new Date() > new Date(end_date)) {
      throw new BusinessLogicError('Discount code has expired');
    }

    if (new Date(end_date) < new Date(start_date)) {
      throw new BusinessLogicError('End date more than start date');
    }

    // create index for discount code
    const foundDiscount = discountModel
      .findOne({
        discount_code: code,
        // convert shopId to ObjectId for mongoose
        discount_shop_id: convert2ObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BusinessLogicError('Discount exists');
    }

    // return new discount
    return await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_day: new Date(start_date),
      discount_end_day: new Date(end_date),
      discount_max_uses: max_users,
      discount_uses_count: users_count,
      discount_users_used: users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });
  }
  //
  static async updateDiscountCode(payload) {
    const {
      discount_id,
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      users_used,
      value,
      max_value,
      max_users,
      users_count,
      max_uses_per_user,
    } = payload;

    // validate
    if (new Date() > new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BusinessLogicError('Discount code has expired');
    }

    if (new Date(end_date) < new Date(start_date)) {
      throw new BusinessLogicError('End date more than start date');
    }

    // create index for discount code
    const foundDiscount = discountModel
      .findOne({
        discount_code: code,
        // convert shopId to ObjectId for mongoose
        discount_shop_id: convert2ObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BusinessLogicError('Discount exists');
    }

    // update discount
    return await discountModel.findByIdAndUpdate(discount_id, {
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_day: new Date(start_date),
      discount_end_day: new Date(end_date),
      discount_max_uses: max_users,
      discount_uses_count: users_count,
      discount_users_used: users_used,
      discount_shop_id: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    });
  }

  // Get all discount codes available with products

  static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
    // create index for discount_code
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shop_id: convert2ObjectId(shopId),
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BusinessLogicError('Discount not exists');
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let filter;
    if (discount_applies_to === 'all') {
      // get all
      filter = {
        product_shop: convert2ObjectId(shopId),
        isPublished: true,
      };
    }

    if (discount_applies_to === 'specific') {
      // get by product ids
      filter = {
        _id: { $in: discount_product_ids },
        isPublished: true,
      };
    }

    return await findAllProducts({
      filter,
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name'],
    });
  }

  // Get all discount codes of shop [User | Admin]
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    return await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id: convert2ObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shop_id'],
      model: discountModel,
    });
  }

  // Get discount amount (apply discount code) [User]
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop_id: convert2ObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BusinessLogicError('Discount not exists');
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_order_value,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new BusinessLogicError('Discount expired');
    if (discount_max_uses === 0)
      throw new BusinessLogicError('Discount are out');

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BusinessLogicError('Discount code has expired');

    // Kiểm tra xem có sét giá trị tối thiểu và tối đa cho đơn hàng không
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new BusinessLogicError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        );
      }
    }
    if (discount_max_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder > discount_max_order_value) {
        throw new BusinessLogicError(
          `Discount requires a max order value of ${discount_max_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount) {
        if (userDiscount.uses >= discount_max_uses_per_user) {
          throw new BusinessLogicError('Discount code has expired');
        }
      }
    }

    // Check xem discount là giảm giá hay giảm phần trăm
    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static async getDiscountAmount_V1({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop_id: convert2ObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BusinessLogicError('Discount not exists');
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_order_value,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (
      !discount_is_active ||
      discount_max_uses === 0 ||
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BusinessLogicError('Discount code has expired');
    }

    const totalOrder = products.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );

    if (
      (discount_min_order_value > 0 && totalOrder < discount_min_order_value) ||
      (discount_max_order_value > 0 && totalOrder > discount_max_order_value)
    ) {
      throw new BusinessLogicError(
        `Discount requires a minium order value of ${discount_min_order_value} and a max order value of ${discount_max_order_value}`
      );
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userDiscount?.uses >= discount_max_uses_per_user) {
        throw new BusinessLogicError('Discount code has expired');
      }
    }

    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  // Delete discount code [Admin | Shop]
  static async deleteDiscountCode({ shopId, codeId }) {
    // check discount exists
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop_id: convert2ObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BusinessLogicError('Discount not exists');
    }

    return await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shop_id: convert2ObjectId(shopId),
    });
  }

  // Cancel discount code [User]
  static async cancelDiscountCode({ codeId, userId, shopId }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop_id: convert2ObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new BusinessLogicError('Discount not exists');
    }

    // const { discount_users_used } = foundDiscount;
    // const userDiscount = discount_users_used.find(
    //   (user) => user.userId === userId
    // );

    // if (!userDiscount) {
    //   throw new BusinessLogicError('Discount not exists');
    // }

    if (!discountModel) throw new BusinessLogicError('Discount not exists');

    return await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: {
          userId,
        },
      },
      $inc: {
        discount_max_users: 1,
        discount_uses_count: -1,
      },
    });
  }
}

module.exports = {
  DiscountService,
};
