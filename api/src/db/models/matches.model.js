import { DataTypes } from "sequelize";

// Define the Matches table model
export function matches(sequelize) {
	const Matches = sequelize.define("Matches", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		match_name: { type: DataTypes.STRING(100) },
		start_time: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		end_time: { type: DataTypes.DATE }
	}, {
		tableName: "Matches",
		timestamps: false
	});

	return Matches;
}
