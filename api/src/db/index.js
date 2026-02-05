import { connect, disconnect } from "./connection.js";
import { initModels } from "./models/index.js";

export const db = {
	sequelize: null,
	models: null,

	connect: async function ({ sync = false, alter = false, force = false } = {}) {
		if (!this.sequelize) {
			this.sequelize = await connect();
		}

		// Initialize models if not already done
		if (!this.models) {
			this.models = await initModels(this.sequelize, { sync, alter, force });
			console.log("✅ Models initialized");
		}

		return this.sequelize;
	},

	disconnect: async function () {
		await disconnect();
		this.sequelize = null;
		this.models = null;
	}
};
