import { DataTypes } from "sequelize";

// Define the Leaderboard table model
export function leaderboard(sequelize, models) {
	const table = sequelize.define("leaderboard", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		total_score: { type: DataTypes.INTEGER, defaultValue: 0 },
		global_rank: { type: DataTypes.INTEGER },
		last_update: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "leaderboard",
		timestamps: false
	});

	// Associations
	table.belongsTo(models.players, { foreignKey: "player_id", onDelete: "CASCADE" });
	models.players.hasOne(table, { foreignKey: "player_id" });

	return table;
}

