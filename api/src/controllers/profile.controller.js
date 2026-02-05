import { fn, col } from 'sequelize';
import { db } from "../db/index.js";

export async function profile(req, res) {
	try {
		const profileTable = await db.models.players.findAll({
			attributes: [
				'pseudonym',
				'bio',
				[fn('COUNT', col('*')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins']
			],
			include: [
				{ model: db.models.playerStats, attributes: [] }
			],
			group: ['players.id']
		});

		if (!profileTable || profileTable.length === 0)
			return res.status(404).json({ msg: "User profile not found." });

		return res.json(profileTable);
	} catch (error) {
		console.error('Error fetching player profile:', error);
		res.status(500).json({ error: "Erreur serveur" });
	}
};

