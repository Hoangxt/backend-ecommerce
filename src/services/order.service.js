// repository card and product
const { findCartById } = require('../models/repositories/cart.repo');
const { checkProductByServer } = require('../models/repositories/product.repo');
// handle error
const { Api404Error, BusinessLogicError } = require('../core/error.response');
// service
const { DiscountService } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');
// order model
const orderModel = require('../models/order.model');
class OrderService {
  /*
    payload:
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
     */

  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId exists
    const foundCart = findCartById(cartId);
    if (!foundCart) throw new Api404Error(`Cart don't exists`);

    const checkout_order = {
        totalPrice: 0, // tong tien hang
        feeShip: 0, // phi van chuyen
        totalDiscount: 0, // tong tien giam gia
        totalCheckout: 0, // tong thanh toan
      },
      shop_order_ids_new = [];

    // calculator bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        itemProducts = [],
      } = shop_order_ids[i];

      // check product available
      const checkProductServer = await checkProductByServer(itemProducts);
      if (!checkout_order[0]) throw new BusinessLogicError('Order invalid');

      // sum total order
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // total before
      checkout_order.totalPrice = +checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRow: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      // neu shop_discounts ton tai > 0, check valid
      if (shop_discounts.length > 0) {
        const { totalPrice, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });
        // Tổng cộng discount giảm giá
        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids_new,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { checkout_order } = await OrderService.checkoutReview({
      cartId,
      userId,
      shop_order_ids_new,
    });

    // check lại một lần nữa xem có vượt tồn kho hay không
    // get new array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log('[1]::', products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      // redis
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        // release lock
        await releaseLock(keyLock);
      }
    }

    // check có 1 sản phẩm hết hàng trong kho
    if (acquireProduct.includes(false)) {
      throw new BusinessLogicError(
        'Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng...'
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // TH: new insert thành công, thì remove product trong cart
    if (newOrder) {
      // remove product in cart
      await removeProductInCart(cartId);
    }

    return newOrder;
  }

  // 1.  Query Orders [Users]
  static async getOrderByUser() {}
  // 2.  Query Order Using Id [Users]
  static async getOneOrderByUser() {}
  // 3. Cancel Order [Users]
  static async cancelOrderByUser() {}
  // 4.  Query Orders Status [Shop | Admin]
  static async updateOrderStatusByShop() {}
}

module.exports = { OrderService };
