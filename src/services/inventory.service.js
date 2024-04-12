// Inventory model
const inventoryModel = require('../models/inventory.model');
// repository
const { getProductById } = require('../models/repositories/product.repo');
// error
const { BusinessLogicError } = require('../core/error.response');

class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location = 'unKnow',
  }) => {
    const product = await getProductById(productId);
    if (!product) {
      throw new BusinessLogicError(`Product not found`);
    }

    const query = {
        inventory_shop_id: shopId,
        inventory_product_id: productId,
      },
      updateSet = {
        $inc: { inventory_stock: stock },
        $set: { inventory_location: location },
      },
      options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  };
}

module.exports = { InventoryService };
