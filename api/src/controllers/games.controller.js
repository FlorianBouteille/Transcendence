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

/**
 * '@swagger'
 * /games:
 *   post:
 *     summary: Save a finished game
 *     tags:
 *       - Games
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mode
 *               - start_time
 *               - end_time
 *               - players
 *             properties:
 *               mode:
 *                 type: string
 *                 example: classic
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-16T14:00:00Z"
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-16T14:08:45Z"
 *               players:
 *                 type: array
 *                 minItems: 2
 *                 items:
 *                   type: object
 *                   required:
 *                     - player_id
 *                     - position
 *                   properties:
 *                     player_id:
 *                       type: integer
 *                       example: 1
 *                     position:
 *                       type: integer
 *                       example: 1
 *                     chrono:
 *                       type: integer
 *                       example: 525
 *                     eliminated:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Game saved successfully
 *       400:
 *         description: Invalid payload
 *       500:
 *         description: Internal server error
 */
export async function gamesSave(req, res) {
	try {
		const { mode, start_time, end_time, players } = req.body;

		if (!mode || !players || players.length < 2) {
			return res.status(400).json({ error: "Invalid game payload." });
		}

		const transaction = await db.sequelize.transaction();

		try {
			const game = await db.models.games.create({ mode, start_time, end_time }, { transaction });

			const ids = players.map(p => p.player_id);
			if (new Set(ids).size !== ids.length) {
				await transaction.rollback();
				return res.status(400).json({ error: "Duplicate player_id detected." });
			}

			const statsRows = players.map(p => ({
				player_id: p.player_id,
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
