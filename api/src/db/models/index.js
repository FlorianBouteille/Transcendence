import { userAccounts } from "./user-accounts.model.js";
import { players } from "./players.model.js";
import { matches } from "./matches.model.js";
import { playerStats } from "./player-stats.model.js";
import { items } from "./items.model.js";
import { leaderboard } from "./leaderboard.model.js";

// export all model factory functions in one object
export const models = {
	userAccounts,
	players,
	matches,
	playerStats,
	items,
	leaderboard
};

// export the initModels function
export async function initModels(sequelize, { sync = false, alter = false, force = false } = {}) {
	const modelsInst = {};

	// Independent models first
	modelsInst.userAccounts = userAccounts(sequelize);
	modelsInst.matches = matches(sequelize);

	// Dependent models with associations
	modelsInst.players = players(sequelize, modelsInst);
	modelsInst.playerStats = playerStats(sequelize, modelsInst);
	modelsInst.items = items(sequelize, modelsInst);
	modelsInst.leaderboard = leaderboard(sequelize, modelsInst);

	if (sync) {
		await sequelize.sync({ alter, force });
		console.log(`✅ Tables synchronized (alter=${alter}, force=${force})`);
	}
	return modelsInst;
}
