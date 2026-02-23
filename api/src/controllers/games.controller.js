import { db } from "../db/index.js";

/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get games history
 *     tags:
 *       - Games
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by game mode
 *       - in: query
 *         name: winner
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by winner pseudonym
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: List of games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 metadata:
 *                   type: object
 */
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
				required: true,
				include: [{
					model: db.models.players,
					as: 'players',
					attributes: [],
					required: true,
					where: winner ? { pseudonym: winner } : undefined
				}],
			}],
			order: [["date", 'DESC']],
			limit,
			offset: (page - 1) * limit
		});

		if (!history.rows)
			return res.json({ msg: "No history found" });

		return res.json({
			data: history.rows,
			metadata: { total: history.count, limit, page, mode, winner }
		});

	} catch (error) {
		console.error('Error in \'gamesHistory\' function: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get specific game history by ID
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Game ID
 *     responses:
 *       200:
 *         description: Game history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                 metadata:
 *                   type: object
 */
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
				required: true,
				order: [['position', 'ASC']],
				include: [{
					model: db.models.players,
					as: 'players',
					attributes: [],
					required: true,
				}],
			}],
		});

		if (!history.rows)
			return res.json({ msg: "No history found"});

		return res.json({
			data: history.rows,
			metadata: { total: history.count }
		});

	} catch (error) {
		console.error('Error in \'gamesIdHistory\' function: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
};


// Internal only
export async function gamesSave(req, res) {
	try {
		const { gameType, startTime, endTime, players } = req.body;

		if (!gameType || !players || !players.length) {
			return res.status(400).json({ error: "Invalid game payload." });
		}

		const transaction = await db.sequelize.transaction();

		try {
			const game = await db.models.games.create({ gameType, startTime, endTime }, { transaction });

			const ids = players.map(p => p.id);
			if (new Set(ids).size !== ids.length) {
				await transaction.rollback();
				return res.status(400).json({ error: "Duplicate player_id detected." });
			}

			const statsRows = players.map(p => ({
				player_id: p.id,
				game_id: game.id,
				chrono: p.chrono ?? 0,
				position: p.position ?? null,
				eliminated: p.eliminated ?? null
			}));

			await db.models.playerStats.bulkCreate(statsRows, { transaction });

			await transaction.commit();

			return res.status(201).json({ message: "Game saved successfully", game_id: game.id });

		} catch (err) {
			await transaction.rollback();
			throw err;
		}

	} catch (error) {
		console.error("Error in 'gamesSave' function:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
