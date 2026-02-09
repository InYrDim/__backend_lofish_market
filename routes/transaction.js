var express = require("express");
var router = express.Router();

const transactionController = require("../controllers/transactionController");

const auth = require("../middleware/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.redirect("/transaction/selling/list");
});

router.get(
	"/purchase/list",
	auth(["purchase"]),
	transactionController.purchaseList,
);
router.get(
	"/purchase/byid/:id",
	auth(["purchase"]),
	transactionController.purchaseById,
);
router.post(
	"/purchase/create",
	auth(["purchase-edit"]),
	transactionController.purchaseCreate,
);
router.patch(
	"/purchase/update/:id",
	auth(["purchase-edit"]),
	transactionController.purchaseUpdate,
);
router.delete(
	"/purchase/delete/:id",
	auth(["purchase-edit"]),
	transactionController.purchaseDelete,
);

// Selling Transaction
router.get(
	"/selling/list",
	auth(["selling", "purchase"]),
	transactionController.sellingList,
);
router.post(
	"/selling/create",
	auth(["selling-edit", "purchase-edit"]),
	transactionController.createTransaction,
);
router.patch(
	"/selling/update/:id",
	auth(["selling-edit", "purchase-edit"]),
	transactionController.sellingUpdate,
);
router.delete(
	"/selling/delete/:id",
	auth(["selling-edit", "purchase-edit"]),
	transactionController.sellingDelete,
);

module.exports = router;
