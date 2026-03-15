import express from "express";
import cookieParser from 'cookie-parser';
import { routes } from "./routes.js";
import { setupSwagger } from "../docs/openapi.js";
import { pagination } from "./middlewares/pagination.js";
import apiLimiter from "./middlewares/rate-limiter.js";

export function createApp() {
	const app = express();

	// Middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());

	// Health check
	app.get("/health", (req, res) => res.json({ status: "ok" }));

	// Swagger
	setupSwagger(app);

	// Redirect /api to /api/docs
	app.get("/api", (req, res) => res.redirect("/api/docs"));

	// Routes
	app.set("trust proxy", 1);
	app.use("/api", apiLimiter, pagination, routes);

	return app;
}
