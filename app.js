require("dotenv").config();
require("reflect-metadata");

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var AppDataSource = require("./config/data-source");

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var productRouter = require("./routes/product");
var featureRouter = require("./routes/feature");
var transactionRouter = require("./routes/transaction");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));

const corsOptions = {
	allowedHeaders: ["Content-Type", "Authorization"],
	methods: ["GET", "POST", "PUT", "DELETE"],
	origin:
		process.env.PROD === "true"
			? [process.env.PROD_ADMIN_URL, process.env.PROD_CLIENT_URL]
			: [process.env.DEV_ADMIN_URL, process.env.DEV_CLIENT_URL],
	credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/feature", featureRouter);
app.use("/transaction", transactionRouter);

// init DB connection
AppDataSource.initialize()
	.then(() => {
		console.log("✅ Database connected (TypeORM)");
	})
	.catch((err) => {
		console.error("❌ Database connection failed:", err);
	});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
