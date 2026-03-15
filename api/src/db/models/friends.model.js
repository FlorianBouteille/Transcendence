import { DataTypes } from "sequelize";

// Define the friends table model
export function friends(sequelize, models) {
	const friendsTable = sequelize.define("friends", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		player_id: { type: DataTypes.INTEGER, allowNull: false },
		friend_id: { type: DataTypes.INTEGER, allowNull: false },
		status: { type: DataTypes.ENUM("pending", "accepted", "blocked"), allowNull: false, defaultValue: "pending"	},
		created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
		updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
	}, {
		tableName: "friends",
		timestamps: false,
		indexes: [{	unique: true, fields: ["player_id", "friend_id"] }]
	});

	// Associations
	friendsTable.belongsTo(models.players, { as: "playerId", foreignKey: "player_id", onDelete: "CASCADE" });
	friendsTable.belongsTo(models.players, { as: "friendId", foreignKey: "friend_id", onDelete: "CASCADE" });

	models.players.hasMany(friendsTable, { as: "playerIds", foreignKey: "player_id" });
	models.players.hasMany(friendsTable, { as: "friendIds", foreignKey: "friend_id" });

	return friendsTable;
}
