import { Sequelize } from "sequelize";

let sequelize;

export async function connect() {
	if (sequelize) return sequelize;

	sequelize = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			dialect: "mariadb",
			logging: false
		}
	);

	try {
		await sequelize.authenticate();
		console.log("✅ Database connected successfully");
	} catch (err) {
		console.error("❌ Database connection failed: ", err.message);
		throw err;
	}

	return sequelize;
}

export async function disconnect() {
	if (!sequelize) return;

	await sequelize.close();
	console.log("✅ Database disconnected");
}
