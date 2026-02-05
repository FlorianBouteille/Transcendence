import { DataTypes } from "sequelize";

// Define the games table model
export function games(sequelize) {
	const table = sequelize.define("games", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		mode: { type: DataTypes.STRING(100) },
		start_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		end_time: { type: DataTypes.DATE }
	}, {
		tableName: "games",
		timestamps: false
	});

	return table;
}
