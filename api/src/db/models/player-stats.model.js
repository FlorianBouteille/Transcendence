import { DataTypes } from "sequelize";

// Define the PlayerStats table model
export function playerStats(sequelize, models) {
	const table = sequelize.define("playerStats", {
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
	table.belongsTo(models.players, { foreignKey: "player_id", onDelete: "CASCADE" });
	models.players.hasMany(table, { foreignKey: "player_id" });

	table.belongsTo(models.games, { foreignKey: "game_id", onDelete: "CASCADE" });
	models.games.hasMany(table, { foreignKey: "game_id" });

	return table;
}
