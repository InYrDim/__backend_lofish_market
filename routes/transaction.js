var express = require('express');
var router = express.Router();

const transactionController = require('../controllers/transactionController');
const xenditController = require('../controllers/xenditController');

const auth = require('../middleware/auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect('/transaction/selling/list');
});

router.get('/purchase/list', auth(['purchase']), transactionController.purchaseList);
router.get('/purchase/byid/:id', auth(['purchase']), transactionController.purchaseById);
router.post('/purchase/create', auth(['purchase-edit']), transactionController.purchaseCreate);
router.patch('/purchase/update/:id', auth(['purchase-edit']), transactionController.purchaseUpdate);
router.delete('/purchase/delete/:id', auth(['purchase-edit']), transactionController.purchaseDelete);

router.post('/create/qr', auth(['purchase']), xenditController.createQR);


module.exports = router;