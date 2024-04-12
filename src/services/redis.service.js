const { setnx, expire } = require('../utils/redis.util');

const { promisify } = require('util');

const {
  reservationInventory,
} = require('../models/repositories/inventory.repo');

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 seconds

  for (let i = 0; i < retryTimes; i++) {
    // tạo 1 key, ai mà lắm giữ key này thì sẽ được vào thanh toán
    const result = await setnx(key, expireTime);
    console.log(`result::`, result);

    if (result === 1) {
      // thao tác với inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReservation.modifiedCount) {
        await expire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(client.del).bind(client);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
