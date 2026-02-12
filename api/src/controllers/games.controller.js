import { db } from "../db/index.js";

// GET a games history -> "../api/games/history"
export async function gamesHistory(req, res) {
	try {
		const { mode, winner, limit = 50, page = 1 } = req.query;

		const history = await db.models.games.findAndCountAll({
			subQuery: false,
			where: mode ? { mode } : undefined,
			attributes: [
				'mode',
				[db.sequelize.literal("DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')"), 'date'],
				[db.sequelize.literal("SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, end_time))"), 'duration'],
				[db.sequelize.col('wins->players.pseudonym'), 'winner']
			],
			include: [{
				model: db.models.playerStats,
				as: 'wins',
				attributes: [],
				required: true,		// INNER JOIN playerStats ON games.id = playerStats.games_id
				include: [{
					model: db.models.players,
					as: 'players',
					attributes: [],
					required: true,	// INNER JOIN players ON playerStats.player_id = players.id
					where: winner ? { pseudonym: winner } : undefined
				}],
			}],
			order: [["date", 'DESC']],
			limit,
			offset: (page - 1) * limit
		});

		if (!history.rows.lenght)
			return res.status(200).json({ msg: "No history found" });

		return res.json({
			data: history.rows,
			metadata: { total: history.count, limit, page, mode, winner }
		});

	} catch (error) {
		console.error('Error in \'gamesHistory\' function: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET a specific games history by 'id' -> "../api/games/:id/history"
export async function gamesIdHistory(req, res) {
	try {
		const { id } = req.params;

		const history = await db.models.games.findAndCountAll({
			subQuery: false,
			where: { id },
			attributes: [
				'mode',
				[db.sequelize.literal("DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')"), 'date'],
				[db.sequelize.literal("SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, end_time))"), 'duration']
			],
			include: [{
				model: db.models.playerStats,
				as: 'playerStats',
				attributes: [],
				required: true,		// INNER JOIN playerStats ON games.id = playerStats.games_id
				order: [['position', 'ASC']],
				include: [{
					model: db.models.players,
					as: 'players',
					attributes: [],
					required: true,	// INNER JOIN players ON playerStats.player_id = players.id
				}],
			}],
		});

		if (!history.rows.length)
			return res.status(200).json({ msg: "No history found"});

		return res.json({
			data: history.rows,
			metadata: { total: history.count }
		});

	} catch (error) {
		console.error('Error in \'gamesIdHistory\' function: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
};
