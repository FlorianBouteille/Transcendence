import { db } from "../db/index.js";

export async function leaderBoard(req, res){
	try {
		// find the player with only the needed fields
		const leaderBoardTable = await db.models.players.findAll({
		attributes: ['pseudonym', 'description', 'coins', 'created_at'],
		});

		if (!leaderBoardTable) return res.sendStatus(404).send("User profile not found.");

		return res.json(leaderBoardTable); // convert Sequelize model instance to plain JSON
	} catch (error) {
		console.error('Error fetching player profile:', error);
		res.status(500).json({ error: "Erreur serveur" });
	}
};
