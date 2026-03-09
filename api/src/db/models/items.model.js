import { DataTypes } from "sequelize";

// Define the Items table model
export function items(sequelize, models) {
	const table = sequelize.define("items", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		item_name: { type: DataTypes.STRING(100), allowNull: false },
		item_type: { type: DataTypes.STRING(50) },
		acquired_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "items",
		timestamps: false
	});

	// Associations
	table.belongsTo(models.players, { foreignKey: "player_id", onDelete: "CASCADE" });
	models.players.hasMany(table, { foreignKey: "player_id" });

	return table;
}
