import express from "express";
import { routes } from "./routes/index.js";

export function createApp() {
	const app = express();

	// Middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));

	// Health check
	app.get("/health", (req, res) => res.json({ status: "ok" }));

	// Routes
	app.use("/api", routes);

	return app;
}
