import { db } from "../db/index.js";

// Retrieve player id from the username
export async function attachPlayerId(req, res, next) {
	try {
		const player = await db.models.players.findOne({
			attributes: ['id'],
			include: [{
				model: db.models.userAccounts,
				as: 'userAccounts',
				where: { username: req.query.username },
				attributes: ['id']
			}],
		});

		if (!player) {
			return res.status(401).json({ error: 'Invalid user' });
		}

		// Attach player id to request
		req.playerId = player.id;

		next();
	} catch (err) {
		console.error('attachPlayerId error:', err);
		res.status(500).json({ error: 'Server error' });
	}
}
