import { DataTypes } from "sequelize";

// Define the PlayerStats table model
export function playerStats(sequelize, models) {
	const playerStatsTable = sequelize.define("playerStats", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		game_id: { type: DataTypes.INTEGER, allowNull: false },
		chrono: { type: DataTypes.INTEGER, defaultValue: 0 },
		position: { type: DataTypes.INTEGER },
		eliminated: { type: DataTypes.BOOLEAN }
	}, {
		tableName: "playerStats",
		timestamps: false
	});

	// Associations
	playerStatsTable.belongsTo(models.players, { as: 'players', foreignKey: "player_id", onDelete: "CASCADE" });
	models.players.hasMany(playerStatsTable, { as: 'playerStats', foreignKey: "player_id" });

	playerStatsTable.belongsTo(models.games, { as: 'games', foreignKey: "game_id", onDelete: "CASCADE" });
	models.games.hasMany(playerStatsTable, { as: 'playerStats', foreignKey: "game_id" });
	models.games.hasMany(playerStatsTable, { as: 'wins', foreignKey: "game_id", scope:{position: 1} });

	return playerStatsTable;
}
