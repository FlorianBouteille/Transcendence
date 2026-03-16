import { fn, col } from 'sequelize';
import { db } from "../db/index.js";

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all player profiles
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: query
 *         name: pseudonym
 *         schema:
 *           type: string
 *         description: Filter profiles by pseudonym
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
 *         description: List of profiles
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
export async function profiles(req, res) {
	try {
		const { pseudonym, limit = 50, page = 1 } = req.query;

		const profiles = await db.models.players.findAll({
			subQuery: false,
			where : pseudonym ? { pseudonym } : undefined,
			attributes: [
				'id',
				'pseudonym',
				'bio',
				'xp',
				'level',
				'avatar_url',
				[fn('COUNT', col('playerStats.id')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins'],
				[db.sequelize.literal(`(SELECT COUNT(*) FROM player_achievements WHERE player_achievements.player_id = players.id)`), 'achievementCount']
			],
			include: [
				{ model: db.models.playerStats, as: 'playerStats', required: true, attributes: [] }
			],
			group: ['players.id'],
			limit,
			offset: (page - 1) * limit,
			distinct: true
		});

		if (!profiles.length)
			return res.json({ msg: "No profiles found"});

		return res.json({ data: profiles, metadata: { limit, page, pseudonym } });

	} catch (error) {
		console.error('Error in \'profiles\' controller:', error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/me:
 *   get:
 *     summary: Get the current user's profile
 *     tags:
 *       - Profiles
 *     responses:
 *       200:
 *         description: The profile of the logged-in user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: User profile not found
 */
export async function profilesMe(req, res) {
	try {
		const profile = await db.models.players.findOne({
			subQuery: false,
			where: { id: req.user.id },
			attributes: [
				'pseudonym',
				'bio',
				'xp',
				'level',
				'avatar_url',
				[fn('COUNT', col('playerStats.id')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins']
			],
			include: [{ model: db.models.playerStats, as: 'playerStats', attributes: [] }],
			group: ['players.id']
		});

		if (!profile)
			return res.status(404).json({ msg: "User profile not found" });

		return res.json(profile);
	} catch (error) {
		console.error('Error in \'profilesMe\' controller:', error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/me/history:
 *   get:
 *     summary: Get logged-in user's game history
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *       - in: query
 *         name: result
 *         schema:
 *           type: string
 *           enum: [win, lose]
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
 *         description: Game history of the logged-in player
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
export async function profilesMeHistory(req, res){
	try {
		const { mode, result, limit = 50, page = 1 } = req.query;

		const history = await db.models.games.findAndCountAll({
			subQuery: false,
			where: mode ? { mode } : undefined,
			attributes: [
				'mode',
				[db.sequelize.literal("DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')"), 'date'],
				[db.sequelize.literal("SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, end_time))"), 'duration'],
				[db.sequelize.literal(`CASE WHEN playerStats.position = 1 THEN 'win' ELSE 'lose' END`), 'result']
			],
			include: [{
				model: db.models.playerStats,
				as: 'playerStats',
				attributes: [],
				required: true,
				where: { player_id: req.user.id }
			}],
			having: result ? db.sequelize.where(db.sequelize.literal(
				`CASE WHEN playerStats.position = 1 THEN 'win' ELSE 'lose' END`), result)
				: undefined,
			order: [[db.sequelize.literal("start_time"), 'DESC']],
			limit,
			offset: (page - 1) * limit,
			distinct: true
		});

		if (!history.rows)
			return res.json({ msg: "No history found"});

		return res.json({
			data: history.rows,
			metadata: { total: history.count, limit, page, mode, result }
		});

	} catch (error) {
		console.error('Error int \'profilesMeHistory\' controller: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a profile by player ID
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Player profile
 *       404:
 *         description: Player profile not found
 */
export async function profilesId(req, res) {
	try {
		const { id } = req.params;

		const profile = await db.models.players.findOne({
			subQuery: false,
			where: { id },
			attributes: [
				'pseudonym',
				'bio',
				'xp',
				'level',
				'avatar_url',
				[fn('COUNT', col('playerStats.id')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins']
			],
			include: [{ model: db.models.playerStats, as: 'playerStats', attributes: [] }],
			group: ['players.id']
		});

		if (!profile)
			return res.status(404).json({ error: "User profile not found" });

		return res.json(profile);
	} catch (error) {
		console.error('Error in \'profilesId\' function:', error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/{id}/history:
 *   get:
 *     summary: Get a player's game history by player ID
 *     tags:
 *       - Profiles
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
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
 *         description: Player game history
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
export async function profilesIdHistory(req, res){
	try {
		const { id } = req.params;
		const { limit = 50, page = 1 } = req.query;

		const history = await db.models.games.findAndCountAll({
			subQuery: false,
			attributes: [
				'mode',
				[db.sequelize.literal("DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')"), 'date'],
				[db.sequelize.literal("SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, end_time))"), 'duration'],
				[db.sequelize.literal(`CASE WHEN playerStats.position = 1 THEN 'win' ELSE 'lose' END`), 'result']
			],
			include: [{
				model: db.models.playerStats,
				as: 'playerStats',
				attributes: [],
				required: true,
				where: { player_id: id }
			}],
			order: [[db.sequelize.literal("start_time"), 'DESC']],
			limit,
			offset: (page - 1) * limit,
			distinct: true
		});

		if (!history.rows)
			return res.status(404).json({ msg: "No history found"});

		return res.json({ data: history.rows, metadata: { total: history.count, limit, page } });
	} catch (error) {
		console.error('Error in \'profilesIdHistory\' controller: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/me/pseudonym:
 *   put:
 *     summary: Update your pseudonym
 *     description: Change the current player's pseudonym. Must be unique.
 *     tags:
 *       - Profiles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudonym
 *             properties:
 *               pseudonym:
 *                 type: string
 *                 example: "NewPseudonym"
 *     responses:
 *       200:
 *         description: Pseudonym updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Pseudonym already exists or invalid
 *       500:
 *         description: Internal server error
 */
export async function profilesMePseudonym(req, res) {
	const { pseudonym } = req.body;

	if (!pseudonym)
		return res.status(400).json({ error: "Pseudonym is required" });

	const transaction = await db.sequelize.transaction();

	try {
		// Check for duplicates
		const exists = await db.models.players.findOne({
			where: { pseudonym },
			transaction
		});

		if (exists) {
			await transaction.rollback();
			return res.status(400).json({ error: "Pseudonym already exists" });
		}

		// Update
		await db.models.players.update(
		{ pseudonym },
		{ where: { id: req.user.id }, transaction }
		);

		await transaction.commit();
		return res.json({ message: "Pseudonym updated successfully" });

	} catch (err) {
		await transaction.rollback();
		console.error("Error updating pseudonym:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/me/bio:
 *   put:
 *     summary: Update your bio
 *     description: Change the current player's bio.
 *     tags:
 *       - Profiles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bio
 *             properties:
 *               bio:
 *                 type: string
 *                 example: "I love jumping through chaos!"
 *     responses:
 *       200:
 *         description: Bio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid bio
 *       500:
 *         description: Internal server error
 */
export async function profilesMeBio(req, res) {
	const { bio } = req.body;

	if (!bio)
		return res.status(400).json({ error: "Bio is required" });

	const transaction = await db.sequelize.transaction();

	try {
		await db.models.players.update(
			{ bio },
			{ where: { id: req.user.id }, transaction }
		);

		await transaction.commit();
		return res.json({ message: "Bio updated successfully" });

	} catch (err) {
		await transaction.rollback();
		console.error("Error updating bio:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/me/avatar:
 *   post:
 *     summary: Upload or update avatar
 *     description: Upload a new avatar image for the current player. Accepts base64 encoded image.
 *     tags:
 *       - Profiles
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 description: Base64 encoded image (JPEG, PNG, GIF)
 *                 example: "data:image/png;base64,iVBORw0KGgo..."
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 avatar_url:
 *                   type: string
 *       400:
 *         description: Invalid image data
 *       500:
 *         description: Internal server error
 */
export async function profilesMeAvatar(req, res) {
	const { avatar } = req.body;

	if (!avatar || typeof avatar !== 'string')
		return res.status(400).json({ error: "Avatar image is required" });

	// Validate base64 image format
	const matches = avatar.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
	if (!matches)
		return res.status(400).json({ error: "Invalid image format. Use base64 encoded PNG, JPEG or GIF" });

	const extension = matches[1];
	const base64Data = matches[2];

	// Check base64 size (limit to ~5MB)
	if (base64Data.length > 7000000)
		return res.status(400).json({ error: "Image too large. Maximum 5MB" });

	const transaction = await db.sequelize.transaction();

	try {
		// Store as data URL in database
		const avatar_url = avatar;

		await db.models.players.update(
			{ avatar_url },
			{ where: { id: req.user.id }, transaction }
		);

		await transaction.commit();
		return res.json({
			message: "Avatar updated successfully",
			avatar_url
		});

	} catch (err) {
		await transaction.rollback();
		console.error("Error updating avatar:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /profiles/me/avatar:
 *   delete:
 *     summary: Delete avatar
 *     description: Remove the current player's avatar and revert to default.
 *     tags:
 *       - Profiles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
export async function profilesMeAvatarDelete(req, res) {
	const transaction = await db.sequelize.transaction();

	try {
		await db.models.players.update(
			{ avatar_url: null },
			{ where: { id: req.user.id }, transaction }
		);

		await transaction.commit();
		return res.json({ message: "Avatar deleted successfully" });

	} catch (err) {
		await transaction.rollback();
		console.error("Error deleting avatar:", err);
		return res.status(500).json({ error: "Internal server error" });
	}
}
