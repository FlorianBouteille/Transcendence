import { createApp } from "./app.js";
import { db } from "./db/index.js";

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		// 1 Connect to the database
		const sequelize = await db.connect();

		// 2 Initialize models and optionally synchronize tables
		db.models = await db.initModels(sequelize, {sync: true});

		// 3 Create the Express app
		const app = createApp();

		// 4 Start listening
		const server = app.listen(PORT, () => {
			console.log(`🚀 API server listening on port ${PORT}`);
		});

		// 5 Graceful shutdown
		const shutdown = async () => {
			console.log("🛑 Shutting down...");
			server.close(() => console.log("HTTP server closed"));
			await db.disconnect();
			process.exit(0);
		};

		process.on("SIGINT", shutdown);
		process.on("SIGTERM", shutdown);
	} catch (err) {
		console.error("❌ Startup failed: ", err.message);
		process.exit(1);
	}
}

// Run the startup sequence
start();

