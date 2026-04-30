require("dotenv").config();
require("reflect-metadata");

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const yaml = require("js-yaml");
const { apiReference } = require("@scalar/express-api-reference");

const AppDataSource = require("./config/data-source");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const productRouter = require("./routes/product");
const featureRouter = require("./routes/feature");
const transactionRouter = require("./routes/transaction");
const webhookRouter = require("./routes/webhook");

// ─── Env Validation ──────────────────────────────────────────────────────────

const IS_PROD = process.env.PROD === "true";

const ALLOWED_ORIGINS = IS_PROD
	? [process.env.PROD_ADMIN_URL, process.env.PROD_CLIENT_URL]
	: [process.env.DEV_ADMIN_URL, process.env.DEV_CLIENT_URL];

const missingOrigins = ALLOWED_ORIGINS.filter(Boolean).length === 0;
if (missingOrigins) {
	console.warn("⚠️  No CORS origin URLs configured. Check your .env file.");
}

const BASE_ROUTE = "/api";

// ─── App Init ────────────────────────────────────────────────────────────────

const app = express();

// ─── View Engine ─────────────────────────────────────────────────────────────

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// ─── Security ────────────────────────────────────────────────────────────────

app.use(
	helmet({
		// Allow Scalar API docs to load its assets
		contentSecurityPolicy: false,
	}),
);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: "Too many requests, please try again later." },
});
app.use(BASE_ROUTE, limiter);

// ─── CORS ────────────────────────────────────────────────────────────────────

const corsOptions = {
	allowedHeaders: ["Content-Type", "Authorization"],
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	origin: (origin, callback) => {
		// Allow server-to-server / non-browser requests (e.g. Postman, curl)
		if (!origin) return callback(null, true);
		if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
		callback(new Error(`CORS policy blocked origin: ${origin}`));
	},
	credentials: true,
};
app.use(cors(corsOptions));

// ─── Webhook Raw Body ─────────────────────────────────────────────────────────
// Must be registered BEFORE express.json() so Stripe/etc. can verify signatures

app.use(
	`${BASE_ROUTE}/webhook`,
	express.raw({ type: "application/json" }),
	webhookRouter,
);

// ─── General Middleware ───────────────────────────────────────────────────────

app.use(logger(IS_PROD ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false, limit: "2mb" }));
app.use(cookieParser());

// ─── Static Files ─────────────────────────────────────────────────────────────

app.use(express.static(path.join(__dirname, "public")));
app.use("/upload", express.static(path.join(__dirname, "upload")));

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use(BASE_ROUTE, indexRouter);
app.use(`${BASE_ROUTE}/user`, userRouter);
app.use(`${BASE_ROUTE}/product`, productRouter);
app.use(`${BASE_ROUTE}/feature`, featureRouter);
app.use(`${BASE_ROUTE}/transaction`, transactionRouter);

// ─── API Docs (Scalar) ────────────────────────────────────────────────────────

try {
	const openApiSpec = yaml.load(
		fs.readFileSync(path.join(__dirname, "openapi.yaml"), "utf8"),
	);

	app.use(
		"/api-docs",
		apiReference({
			spec: { content: openApiSpec },
			theme: "purple",
			layout: "modern",
			showSidebar: true,
		}),
	);

	console.log("📄 API docs available at /api-docs");
} catch (err) {
	console.warn(
		"⚠️  Could not load openapi.yaml — API docs disabled:",
		err.message,
	);
}

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req, _res, next) => {
	next(createError(404));
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	const status = err.status || 500;
	const isDev = req.app.get("env") === "development";

	// Log unexpected server errors
	if (status >= 500) {
		console.error("❌ Server error:", err);
	}

	// JSON response for API routes
	if (req.path.startsWith(BASE_ROUTE)) {
		return res.status(status).json({
			error: err.message || "Internal Server Error",
			...(isDev && { stack: err.stack }),
		});
	}

	// HTML response for non-API routes
	res.locals.message = err.message;
	res.locals.error = isDev ? err : {};
	res.status(status).render("error");
});

// ─── Database Init ────────────────────────────────────────────────────────────

AppDataSource.initialize()
	.then(() => console.log("✅ Database connected (TypeORM)"))
	.catch((err) => {
		console.error("❌ Database connection failed:", err);
		process.exit(1); // Don't silently run without a DB
	});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

const shutdown = async (signal) => {
	console.log(`\n${signal} received — shutting down gracefully...`);
	try {
		if (AppDataSource.isInitialized) {
			await AppDataSource.destroy();
			console.log("✅ Database connection closed");
		}
		process.exit(0);
	} catch (err) {
		console.error("❌ Error during shutdown:", err);
		process.exit(1);
	}
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

module.exports = app;
