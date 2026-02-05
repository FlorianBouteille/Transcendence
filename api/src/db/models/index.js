import { userAccounts } from "./user-accounts.model.js";
import { players } from "./players.model.js";
import { games } from "./games.model.js";
import { playerStats } from "./player-stats.model.js";
import { items } from "./items.model.js";
import { leaderboard } from "./leaderboard.model.js";

// export the initModels function
export async function initModels(sequelize, { sync = false, alter = false, force = false } = {}) {
	const modelsInst = {};

	// Independent models first
	modelsInst.userAccounts = userAccounts(sequelize);
	modelsInst.games = games(sequelize);

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
