import { fn, col } from 'sequelize';
import { db } from "../db/index.js";

// GET all profiles -> "../api/profiles"
export async function profiles(req, res) {
	try {
		const { pseudonym, limit = 50, page = 1 } = req.query;

		const profiles = await db.models.players.findAll({
			subQuery: false,
			where : pseudonym ? { pseudonym } : undefined,
			attributes: [
				'pseudonym',
				'bio',
				[fn('COUNT', col('playerStats.id')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins']
			],
			include: [{
				model: db.models.playerStats,
				as: 'playerStats',
				required: true,
				attributes: []
			}],
			group: ['players.id'],
			limit,
			offset: (page - 1) * limit,
			distinct: true
		});

		if (!profiles.length)
			return res.status(200).json({ msg: "No profiles found"});

		return res.json({
			data: profiles,
			metadata: { limit, page, pseudonym }
		});

	} catch (error) {
		console.error('Error in \'profiles\' controller:', error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// // GET all players history -> "../api/profiles/history"
// export async function profilesHistory(req, res){
// 	try {
// 		const { limit = 50, page = 1 } = req.query;

// 		const history = await db.models.games.findAndCountAll({
// 			subQuery: false,
// 			attributes: [
// 				'mode',
// 				[db.sequelize.literal("DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')"), 'date'],
// 				[db.sequelize.literal("SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, end_time))"), 'duration'],
// 				[db.sequelize.literal(`CASE WHEN playerStats.position = 1 THEN 'win' ELSE 'lose' END`), 'result']
// 			],
// 			include: [{
// 				model: db.models.playerStats,
// 				as: 'playerStats',
// 				attributes: [],
// 				required: true,		// INNER JOIN playerStats ON games.id = playerStats.games_id
// 				where: { player_id: id }
// 			}],
// 			order: [[db.sequelize.literal("start_time"), 'DESC']],
// 			limit,
// 			offset: (page - 1) * limit,
// 			distinct: true
// 		});

// 		if (!history.rows)
// 			return res.status(200).json({ msg: "No history found"});

// 		return res.json({
// 			data: history.rows,
// 			metadata: { total: history.count, limit, page }
// 		});

// 	} catch (error) {
// 		console.error('Error function \'profilesIdHistory\': ', error);
// 		res.status(500).json({ error: "Error serveur" });
// 	}
// };


// GET your personal profile -> "../api/profiles/me"
export async function profilesMe(req, res) {
	try {
		const profile = await db.models.players.findOne({
			subQuery: false,
			where: playerId ? { id: playerId } : req.playerId,
			attributes: [
				'pseudonym',
				'bio',
				[fn('COUNT', col('playerStats.id')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins']
			],
			include: [{
				model: db.models.playerStats,
				as: 'playerStats',
				attributes: []
			}],
			group: ['players.id']
		});

		if (!profile.length)
			return res.status(404).json({ msg: "User profile not found" });

		return res.json(profile);
	} catch (error) {
		console.error('Error in \'profilesMe\' controller:', error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET your personal history -> "../api/profiles/me/history"
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
				required: true,	// INNER JOIN playerStats ON games.id = playerStats.games_id
				where: { player_id: req.playerId}
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
			return res.status(200).json({ msg: "No history found"});

		return res.json({
			data: history.rows,
			metadata: { total: history.count, limit, page, mode, result }
		});

	} catch (error) {
		console.error('Error int \'profilesMeHistory\' controller: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET a profile by his player id -> "../api/profiles/:id"
export async function profilesId(req, res) {
	try {
		const { id } = req.params;

		const profile = await db.models.players.findOne({
			subQuery: false,
			where: { id },
			attributes: [
				'pseudonym',
				'bio',
				[fn('COUNT', col('playerStats.id')), 'allGames'],
				[db.sequelize.literal(`COUNT(CASE WHEN playerStats.position = 1 THEN 1 END)`), 'wins']
			],
			include: [{
				model: db.models.playerStats,
				as: 'playerStats',
				attributes: []
			}],
			group: ['players.id']
		});

		if (!profile)
			return res.status(404).json({ error: "User profile not found" });

		return res.json(profile);
	} catch (error) {
		console.error('Error in \'profilesId\' function:', error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET a player history by his id -> "../api/profiles/:id/history"
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
				required: true,	// INNER JOIN playerStats ON games.id = playerStats.games_id
				where: { player_id: id }
			}],
			order: [[db.sequelize.literal("start_time"), 'DESC']],
			limit,
			offset: (page - 1) * limit,
			distinct: true
		});

		if (!history.rows)
			return res.status(404).json({ msg: "No history found"});
X
		return res.json({
			data: history.rows,
			metadata: { total: history.count, limit, page }
		});

	} catch (error) {
		console.error('Error in \'profilesIdHistory\' controller: ', error);
		res.status(500).json({ error: "Internal server error" });
	}
};