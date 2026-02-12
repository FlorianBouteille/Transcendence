import express from "express";
import { routes } from "./routes.js";
import { pagination } from "./middlewares/pagination.js";

export function createApp() {
	const app = express();

	// Middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Health check
	app.get("/health", (req, res) => res.json({ status: "ok" }));

	// Routes
	app.use("/api", pagination, routes);
	// app.use("/api/public/", routes);

	return app;
}
