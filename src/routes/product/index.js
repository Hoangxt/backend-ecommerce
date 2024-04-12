const express = require('express');
const router = express.Router();
// controller
const productController = require('../../controllers/product.controller');
// auth
const { authenticationV2 } = require('../../auth/authUtils');

// Tìm kiếm sản phẩm theo từ khoá
/**
 * @swagger
 *   /api/v1/product/search/{keySearch}:
 *     get:
 *       summary: Search product by key
 *       tags: [Product]
 *       security: []
 *       parameters:
 *         - in: path
 *           name: keySearch
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product contains key search
 *           contents:
 *             application/json
 */
router.get('/search/:keySearch', productController.searchProducts);

const aliasSearch = (req, res, next) => {
  req.query.page = '1';
  req.query.limit = '5';
  req.query.sort = '-name';
  req.query.fields = 'name, price';
  next();
};

router.get('/advanced-search', aliasSearch, productController.advancedSearch);

// Tim kiem tat ca san pham
/**
 * @swagger
 *   /api/v1/product/:
 *     get:
 *       summary: Search product by key
 *       tags: [Product]
 *       security: []
 *       parameters:
 *         - in: path
 *           name: keySearch
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product contains key search
 *           contents:
 *             application/json
 */
router.get('/', productController.findAllProducts);
/**
 * @swagger
 *   /api/v1/product/{product_id}:
 *     get:
 *       summary: Search one product by product_id
 *       tags: [Product]
 *       security: []
 *       parameters:
 *         - in: path
 *           name: keySearch
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product contains key search
 *           contents:
 *             application/json
 */
router.get('/:product_id', productController.findProduct);

// authentication
router.use(authenticationV2);

// after auth
// Tạo mới một sản phẩm
/**
 * @swagger
 *   /api/v1/product:
 *     post:
 *       summary: Create product
 *       tags: [Product]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Product info
 *           contents:
 *             application/json
 */
router.post('', productController.createProduct);

// Cập nhật thông tin sản phẩm
/**
 * @swagger
 *   /api/v1/product/{productId}:
 *     patch:
 *       summary: Update product
 *       tags: [Product]
 *       parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: string
 *           required: true
 *           description: productId value
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Product info
 *           contents:
 *             application/json
 */
router.patch('/:productId', productController.updateProduct);

// Published một sản phẩm bởi người bán hàng
/**
 * @swagger
 *   /api/v1/product/publish/{id}:
 *     put:
 *       summary: Update publish product
 *       tags: [Product]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Product info after update
 *           contents:
 *             application/json
 */
router.put('/publish/:id', productController.publishProductByShop);

// UnPublished một sản phẩm bởi người bán hàng
/**
 * @swagger
 *   /api/v1/product/unpublish/{id}:
 *     put:
 *       summary: Update unpublish product
 *       tags: [Product]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: key word search product
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: Product info after update
 *           contents:
 *             application/json
 */
router.put('/unpublish/:id', productController.unPublishProductByShop);

// query
// Lấy danh sách các sản phẩm nháp của người bán.
/**
 * @swagger
 *   /api/v1/product/drafts/all:
 *     post:
 *       summary: Search product drafts by key
 *       tags: [Product]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product draft contains key search
 *           contents:
 *             application/json
 */
router.get('/drafts/all', productController.getAllDraftsForShop);

// Lấy danh sách các sản phẩm bán của người bán.
/**
 * @swagger
 *   /api/v1/product/published/all:
 *     post:
 *       summary: Search product published by key
 *       tags: [Product]
 *       responses:
 *         "400":
 *           $ref: '#/components/responses/400'
 *         "401":
 *           $ref: '#/components/responses/401'
 *         "200":
 *           description: List product publish contains key search
 *           contents:
 *             application/json
 */
router.get('/published/all', productController.getAllPublishedForShop);

// router
module.exports = router;
