import { DataTypes } from "sequelize";

// Define the PlayerStats table model
export function playerStats(sequelize, models) {
	const PlayerStats = sequelize.define("PlayerStats", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		match_id: { type: DataTypes.INTEGER, allowNull: false },
		chrono: { type: DataTypes.INTEGER, defaultValue: 0 },
		position: { type: DataTypes.INTEGER },
		eliminated: { type: DataTypes.BOOLEAN, defaultValue: false }
	}, {
		tableName: "PlayerStats",
		timestamps: false
	});

	// Associations
	PlayerStats.belongsTo(models.players, { foreignKey: "player_id", onDelete: "CASCADE" });
	models.players.hasMany(PlayerStats, { foreignKey: "player_id" });

	PlayerStats.belongsTo(models.matches, { foreignKey: "match_id", onDelete: "CASCADE" });
	models.matches.hasMany(PlayerStats, { foreignKey: "match_id" });

	return PlayerStats;
}
