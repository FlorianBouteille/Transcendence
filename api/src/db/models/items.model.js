import { DataTypes } from "sequelize";

// Define the Items table model
export function items(sequelize, models) {
	const Items = sequelize.define("Items", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		item_name: { type: DataTypes.STRING(100), allowNull: false },
		item_type: { type: DataTypes.STRING(50) },
		acquired_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "Items",
		timestamps: false
	});

	// Associations
	Items.belongsTo(models.players, { foreignKey: "player_id", onDelete: "CASCADE" });
	models.players.hasMany(Items, { foreignKey: "player_id" });

	return Items;
}
