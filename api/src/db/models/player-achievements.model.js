import { DataTypes } from "sequelize";

// Define the PlayerAchievements table model
export function playerAchievements(sequelize, models) {
	const playerAchievementsTable = sequelize.define("playerAchievements", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		achievement_id: { type: DataTypes.INTEGER, allowNull: false },
		acquired_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "player_achievements",
		timestamps: false
	});

	// Associations
	playerAchievementsTable.belongsTo(models.players, { as: 'player', foreignKey: "player_id", onDelete: "CASCADE" });
	playerAchievementsTable.belongsTo(models.achievements, { as: 'achievement', foreignKey: "achievement_id", onDelete: "CASCADE" });

	return playerAchievementsTable;
}
