import { DataTypes } from "sequelize";

// Define the Achievements table model
export function achievements(sequelize, models) {
	const achievementsTable = sequelize.define("achievements", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		achievement_name: { type: DataTypes.STRING(50), allowNull: false },
		achievement_description: { type: DataTypes.STRING(200), allowNull: false },
		icon: { type: DataTypes.STRING(100) },
		category: { type: DataTypes.STRING(50) }
	}, {
		tableName: "achievements",
		timestamps: false
	});

	return achievementsTable;
}
