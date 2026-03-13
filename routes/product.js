var express = require('express');
var router = express.Router();

const productController = require('../controllers/productController');
const inventoryController = require('../controllers/inventoryController');

const auth = require('../middleware/auth');
const getMemoryUploader = require('../middleware/uploadFile'); // Import middleware Multer
const errorHandler = require('../middleware/errorHandler');

const upload = getMemoryUploader();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect('/product/product/list');
});

router.get('/product/list', auth(['product']), productController.productList);
router.get('/product/byid/:id', auth(['product']), productController.productById);
router.post('/product/create',
  auth(['product-edit']),
  upload.single('image'),
  productController.productCreate,
  errorHandler
);
router.patch('/product/update/:id',
  auth(['product-edit']),
  upload.single('image'),
  productController.productUpdate,
  errorHandler
);
router.delete('/product/delete/:id',
  auth(['product-edit']),
  productController.productDelete,
  errorHandler
);
router.delete('/product/soft-delete/:id',
  auth(['product-edit']),
  productController.productSoftDelete
);

router.get('/service/list', auth(['service']), productController.serviceList);
router.get('/service/byid/:id', auth(['service']), productController.serviceById);
router.post('/service/create',
  auth(['service-edit']),
  upload.single('image'),
  productController.serviceCreate,
  errorHandler
);
router.patch('/service/update/:id',
  auth(['service-edit']),
  upload.single('image'),
  productController.serviceUpdate,
  errorHandler
);
router.delete('/service/delete/:id',
  auth(['service-edit']),
  productController.serviceDelete,
  errorHandler
);
router.delete('/service/soft-delete/:id',
  auth(['service-edit']),
  productController.serviceSoftDelete
);

router.get('/price/list', auth(['price']), productController.priceList);
router.get('/price/byid/:id', auth(['price']), productController.priceById);
router.post('/price/getprice', auth(['price']), productController.getPrice);
router.get('/price/byproduct/:id', auth(['price']), productController.priceByProduct);
router.post('/price/create', auth(['price-edit']), productController.priceCreate);
router.patch('/price/update/:id', auth(['price-edit']), productController.priceUpdate);
router.delete('/price/delete/:id', auth(['price-edit']), productController.priceDelete);

router.get('/stock/list', auth(['stock']), productController.stockList);
router.get('/stock/byid/:id', auth(['stock']), productController.stockById);
router.post('/stock/create', auth(['stock-edit']), productController.stockCreate);
router.patch('/stock/update/:id', auth(['stock-edit']), productController.stockUpdate);
router.delete('/stock/delete/:id', auth(['stock-edit']), productController.stockDelete);

router.get('/reject/list', auth(['reject']), productController.rejectList);
router.get('/reject/byid/:id', auth(['reject']), productController.rejectById);
router.post('/reject/create', auth(['reject-edit']), productController.rejectCreate);
router.patch('/reject/update/:id', auth(['reject-edit']), productController.rejectUpdate);
router.delete('/reject/delete/:id', auth(['reject-edit']), productController.rejectDelete);

router.get('/stock-opname/list', auth(['stock-opname']), productController.stockOpnameList);
router.get('/stock-opname/byid/:id', auth(['stock-opname']), productController.stockOpnameById);
router.post('/stock-opname/create', auth(['stock-opname-edit']), productController.stockOpnameCreate);
router.patch('/stock-opname/update/:id', auth(['stock-opname-edit']), productController.stockOpnameUpdate);
router.delete('/stock-opname/delete/:id', auth(['stock-opname-edit']), productController.stockOpnameDelete);

router.get('/so-detail/list', auth(['so-detail']), productController.stockOpnameDetailList);
router.get('/so-detail/byid/:id', auth(['so-detail']), productController.stockOpnameDetailById);
router.post('/so-detail/create',
  auth(['so-detail-edit']),
  upload.single('attachment'),
  productController.stockOpnameDetailCreate,
  errorHandler
);
router.patch('/so-detail/update/:id',
  auth(['so-detail-edit']),
  upload.single('attachment'),
  productController.stockOpnameDetailUpdate,
  errorHandler
);
router.delete('/so-detail/delete/:id',
  auth(['so-detail-edit']),
  productController.stockOpnameDetailDelete,
  errorHandler
);

router.get('/grade/list', auth(['grade']), productController.gradeList);
router.get('/grade/byid/:id', auth(['grade']), productController.gradeById);
router.post('/grade/create', auth(['grade-edit']), productController.gradeCreate);
router.patch('/grade/update/:id', auth(['grade-edit']), productController.gradeUpdate);
router.delete('/grade/delete/:id', auth(['grade-edit']), productController.gradeDelete);

router.get('/size/list', auth(['size']), productController.sizeList);
router.get('/size/byid/:id', auth(['size']), productController.sizeById);
router.post('/size/create', auth(['size-edit']), productController.sizeCreate);
router.patch('/size/update/:id', auth(['size-edit']), productController.sizeUpdate);
router.delete('/size/delete/:id', auth(['size-edit']), productController.sizeDelete);

router.get('/category/list', auth(['category']), productController.categoryList);
router.get('/category/byid/:id', auth(['category']), productController.categoryById);
router.post('/category/create', auth(['category-edit']), productController.categoryCreate);
router.patch('/category/update/:id', auth(['category-edit']), productController.categoryUpdate);
router.delete('/category/delete/:id', auth(['category-edit']), productController.categoryDelete);

// Inventory Flow
router.post('/inventory/receive', auth(['stock-edit', 'purchase-edit']), inventoryController.receiveFromSupplier);
router.post('/inventory/receive-bulk', auth(['stock-edit', 'purchase-edit']), inventoryController.receiveBulkFromSupplier);
router.post('/inventory/transfer', auth(['stock-edit']), inventoryController.transferToMarket);
router.get('/inventory/dashboard', auth(['stock-list']), inventoryController.getInventoryDashboard);
router.post('/inventory/reject-request', auth(['reject-edit']), upload.single('image_proof'), inventoryController.requestReject, errorHandler);
router.post('/inventory/reject-approve/:id', auth(['reject-edit']), inventoryController.approveReject);
router.get('/inventory/reject-list', auth(['reject']), inventoryController.getRejectList);
router.get('/inventory/purchase-history', auth(['purchase']), inventoryController.getPurchaseHistory);

module.exports = router;