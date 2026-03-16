import { fn, col } from 'sequelize';
import { db } from "../db/index.js";

/**
 * @swagger
 * /friends/me:
 *   get:
 *     summary: Get the current user's friends
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of friends to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of the user's accepted friends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       pseudonym:
 *                         type: string
 *                         example: ChaosCharlie
 *                       level:
 *                         type: integer
 *                         example: 200
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: No friends found
 */
export async function friendsMe(req, res) {
	try {
		const { limit = 50, page = 1 } = req.query;

		const friends = await db.models.players.findAndCountAll({
			subQuery: false,
			attributes: ['id', 'pseudonym', 'level'],
			include: [{
				model: db.models.friends,
				as: 'friendIds',
				where: { player_id: req.user.id, status: 'accepted' },
				attributes: []
			}],
			order: [['id', 'ASC']],
			limit,
			offset: (page - 1) * limit
		});

		return res.json({
			data: friends.rows,
			metadata: { total: friends.count, limit, page }
		});

	} catch (error) {
		console.error("Error in 'friendsMe' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/{id}:
 *   get:
 *     summary: Get a player's friends by ID
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID to fetch friends for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of friends to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of the player's accepted friends
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 7
 *                       pseudonym:
 *                         type: string
 *                         example: GrabbyGeorge
 *                       level:
 *                         type: integer
 *                         example: 110
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 3
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: No friends found for the given player
 */
export async function friendsId(req, res) {
	try {
		const { id } = req.params;
		const { limit = 50, page = 1 } = req.query;

		const friends = await db.models.players.findAndCountAll({
			subQuery: false,
			attributes: ['id', 'pseudonym', 'level'],
			include: [{
				model: db.models.friends,
				as: 'friendIds',
				where: { player_id: id, status: 'accepted' },
				attributes: []
			}],
			order: [['id', 'ASC']],
			limit,
			offset: (page - 1) * limit
		});

		return res.json({
			data: friends.rows,
			metadata: { total: friends.count, limit, page }
		});

	} catch (error) {
		console.error("Error in 'friendsId' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/me/requests/received:
 *   get:
 *     summary: Get pending friend requests received by the current user
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of results returned
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of players who sent a friend request to the current user
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 3
 *                   pseudonym: ChaosCharlie
 *                   level: 200
 *                 - id: 7
 *                   pseudonym: GrabbyGeorge
 *                   level: 110
 *               metadata:
 *                 total: 2
 *                 limit: 50
 *                 page: 1
 */
export async function friendsMeRequestsReceived(req, res) {
	try {
		const { limit = 50, page = 1 } = req.query;

		const friends = await db.models.players.findAndCountAll({
			subQuery: false,
			attributes: ['id', 'pseudonym', 'level'],
			include: [{
				model: db.models.friends,
				as: 'playerIds',
				where: { friend_id: req.user.id, status: 'pending' },
				attributes: []
			}],
			order: [['id', 'ASC']],
			limit,
			offset: (page - 1) * limit
		});

		return res.json({
			data: friends.rows,
			metadata: { total: friends.count, limit, page }
		});

	} catch (error) {
		console.error("Error in 'friendsMeRequestsReceived' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/me/requests/sent:
 *   get:
 *     summary: Get pending friend requests sent by the current user
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of results returned
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: List of players who received a friend request from the current user
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - id: 5
 *                   pseudonym: EdgeEdgar
 *                   level: 90
 *                 - id: 12
 *                   pseudonym: LazyLaura
 *                   level: 85
 *               metadata:
 *                 total: 2
 *                 limit: 50
 *                 page: 1
 */
export async function friendsMeRequestsSent(req, res) {
	try {
		const { limit = 50, page = 1 } = req.query;

		const friends = await db.models.players.findAndCountAll({
			subQuery: false,
			attributes: ['id', 'pseudonym', 'level'],
			include: [{
				model: db.models.friends,
				as: 'friendIds',
				where: { player_id: req.user.id, status: 'pending' },
				attributes: []
			}],
			order: [['id', 'ASC']],
			limit,
			offset: (page - 1) * limit
		});

		return res.json({
			data: friends.rows,
			metadata: { total: friends.count, limit, page }
		});

	} catch (error) {
		console.error("Error in 'friendsMeRequestsSent' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/me/requests/{friend_id}:
 *   post:
 *     summary: Send a friend request
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friend_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID to send the request to
 *     responses:
 *       201:
 *         description: Friend request sent
 *       400:
 *         description: Invalid request
 */
export async function friendsMeRequestsSend(req, res) {
	try {
		const { friend_id } = req.params;

		if (friend_id == req.user.id)
			return res.status(400).json({ error: "You cannot add yourself as a friend" });

		const friends = await db.models.friends.create({
			player_id: req.user.id,
			friend_id,
			status: 'pending'
		});

		return res.status(201).json({ message: "Friend request sent", id: friends.id });

	} catch (error) {
		console.error("Error in 'friendsRequestSend' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/me/requests/{friend_id}:
 *   put:
 *     summary: Accept a friend request
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friend_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID who sent the request
 *     responses:
 *       200:
 *         description: Friend request accepted
 *       404:
 *         description: Request not found
 */
export async function friendsMeRequestsAccept(req, res) {
	try {
		const { friend_id } = req.params;

		const friends = await db.models.friends.findOne({
			where: {
				player_id: friend_id,
				friend_id: req.user.id,
				status: 'pending' }
		});

		if (!friends)
			return res.status(404).json({ error: "Friend request not found" });

		await friends.update({ status: 'accepted' });

		await db.models.friends.create({
			player_id: req.user.id,
			friend_id,
			status: 'accepted'
		});

		return res.json({ message: "Friend request accepted" });

	} catch (error) {
		console.error("Error in 'friendsRequestAccept' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/me/requests/{friend_id}:
 *   delete:
 *     summary: Refuse a friend request
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friend_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Player ID who sent the request
 *     responses:
 *       200:
 *         description: Friend request refused
 *       404:
 *         description: Friend request not found
 */
export async function friendsMeRequestsReject(req, res) {
	try {
		const { friend_id } = req.params;

		const friends = await db.models.friends.destroy({
			where: {
				player_id: friend_id,
				friend_id: req.user.id,
				status: 'pending'
			}
		});

		if (!friends)
			return res.status(404).json({ error: "Friend request not found" });

		return res.json({ message: "Friend request refused" });

	} catch (error) {
		console.error("Error in 'friendsRequestReject' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * @swagger
 * /friends/me/{friend_id}:
 *   delete:
 *     summary: Remove a friend
 *     tags:
 *       - Friends
 *     parameters:
 *       - in: path
 *         name: friend_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the friend to remove
 *     responses:
 *       200:
 *         description: Friend removed successfully
 *       404:
 *         description: Friendship not found
 */
export async function friendsMeDelete(req, res) {
	try {
		const { friend_id } = req.params;
		const myId = req.user.id;

		const deleted = await db.models.friends.destroy({
			where: {
				[db.sequelize.Sequelize.Op.or]: [
					{ player_id: myId, friend_id },
					{ player_id: friend_id, friend_id: myId }
				]
			}
		});

		if (!deleted)
			return res.status(404).json({ message: "Friendship not found" });

		return res.status(200).json({ message: "Friend removed successfully" });

	} catch (error) {
		console.error("Error in 'friendsMeDelete' controller:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}