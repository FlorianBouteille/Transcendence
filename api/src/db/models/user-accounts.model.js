import { DataTypes } from "sequelize";

// Define the UserAccounts table model
export function userAccounts(sequelize) {
	const table = sequelize.define("userAccounts", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
		email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
		password_hash: { type: DataTypes.STRING(255), allowNull: false },
		enable_2FA : {type: DataTypes.BOOLEAN, defaultValue: false},
		created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "userAccounts",
		timestamps: false
	});

	return table;
}
