import * as connection from "./connection.js";
import { models as modelFactories, initModels as initModelsFn } from "./models/index.js";

export const db = {
	...connection,
	models: modelFactories,
	initModels: async function (sequelize, { sync = false, alter = false, force = false } = {}) {
		const initializedModels = await initModelsFn(sequelize, { sync, alter, force });
		this.models = initializedModels;
		return initializedModels;
	}
};
