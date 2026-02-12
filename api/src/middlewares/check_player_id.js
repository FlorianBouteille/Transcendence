import { db } from "../db/index.js";

export async function checkPlayerId(req, res, next) {
	try {
		const { id } = req.params;
		const player = await db.models.players.findByPk(id);

		if (!player) {
			return res.status(404).json({ error: "Player not found" });
		}

		next();
	} catch (error) {
		console.error("Error in \'checkPlayerId\' middleware:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}
