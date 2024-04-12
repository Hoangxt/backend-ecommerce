// product from the database.
const { product } = require('../product.model');
const { Types } = require('mongoose');
// handle error
const { BusinessLogicError } = require('../../core/error.response');
// utils
const { convert2ObjectId } = require('../../utils');
const ApiFeatures = require('./../../utils/api-feature.util');

// Published một sản phẩm bởi người bán hàng
const publishProductByShop = async ({ product_shop, product_id }) => {
  // find one
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return foundShop;

  // update isDraft, isPublish
  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.update(foundShop);

  return modifiedCount;
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  // find one
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return foundShop;

  // update isDraft, isPublish
  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.update(foundShop);

  return modifiedCount;
};

// Tìm tất cả các bản nháp của shop
const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};
// Tìm tất cả các sản phẩm đã xuất bản của shop
const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
// search full text (các sản phẩm đã xuất bản - Published)
const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  return await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
};

// Tìm tất cả sản phẩm
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();
};

const findById = async (product_id, unSelect) => {
  return await product.findById(product_id).select(unSelect);
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const getProductById = async (productId) => {
  return await product.findOne({ _id: convert2ObjectId(productId) }).lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

/**
 * ?a[gte]=2&b[gt]=3&c[lte]=5&d[lt]=6
 *
 * @param queryInput
 * @return {Promise<void>}
 */
const advancedSearch = async (queryInput) => {
  const excludedFields = ['page', 'sort', 'size', 'fields'];
  excludedFields.forEach((el) => delete queryInput[el]);

  //1. advanced filtering
  let queryStr = JSON.stringify(queryInput);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  queryStr = JSON.parse(queryStr);

  console.log(queryStr);
  let query = product.find(queryStr);

  //2. sorting
  if (queryInput.sort) {
    const sortBy = queryInput.sort.split(',').join(' ');
    console.log(sortBy);
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //3. field limiting
  if (queryInput.fields) {
    const fields = queryInput.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }

  //4. paging
  // page=0&size=10
  const page = queryInput.page * 1 || 1;
  const size = queryInput.size * 1 || 100;
  const offset = (page - 1) * size;

  query = query.skip(offset).limit(size);

  if (queryInput.page) {
    const total = await product.countDocuments();
    if (offset >= total)
      throw new BusinessLogicError('This page does not exists');
  }

  return await query;
};

const advancedSearchV2 = async (queryInput) => {
  const features = new ApiFeatures(product.find(), queryInput)
    .filter()
    .sort()
    .limitFields()
    .paging();

  return await features.query;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  searchProductByUser,
  findAllProducts,
  findById,
  updateProductById,
  getProductById,
  checkProductByServer,
  advancedSearch,
  advancedSearchV2,
  unPublishProductByShop,
};
