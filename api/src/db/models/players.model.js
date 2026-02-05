import { DataTypes } from "sequelize";

// Define the Players table model
export function players(sequelize, models) {
	const table = sequelize.define("players", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: { type: DataTypes.INTEGER, allowNull: false },
		pseudonym: { type: DataTypes.STRING(50), allowNull: false },
		bio: { type: DataTypes.TEXT },
		coins: { type: DataTypes.INTEGER, defaultValue: 0 },
		avatar_url: { type: DataTypes.STRING(255) },
		created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "players",
		timestamps: false
	});

	// Associations
	table.belongsTo(models.userAccounts, { foreignKey: "user_id", onDelete: "CASCADE" });
	models.userAccounts.hasOne(table, { foreignKey: "user_id" });

	return table;
}
