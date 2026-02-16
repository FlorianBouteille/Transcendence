import express from "express";
import { routes } from "./routes.js";
import { setupSwagger } from "../docs/openapi.js";
import { pagination } from "./middlewares/pagination.js";

export function createApp() {
	const app = express();

	// Middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Health check
	app.get("/health", (req, res) => res.json({ status: "ok" }));

	// Swagger
	setupSwagger(app);

	// Redirect /api to /api/docs
	app.get("/api", (req, res) => res.redirect("/api/docs"));

	// Routes
	app.use("/api", pagination, routes);

	return app;
}
