import { fn, col, literal } from 'sequelize';
import { db } from "../db/index.js";

// History of all game played
export async function globalHistory(req, res){
	try {
		const globalHistoryTable = await db.models.games.findAll({
			attributes: [
				'mode',
				[db.sequelize.literal("DATE_FORMAT(start_time, '%Y-%m-%d %H:%i:%s')"), 'date'],
				[db.sequelize.literal("SEC_TO_TIME(TIMESTAMPDIFF(SECOND, start_time, end_time))"), 'duration'],
				[db.sequelize.col('playerStats->player.pseudonym'), 'winner']
			],
			include: [
				{
					model: db.models.playerStats,
					attributes: [],
					required: false,	// LEFT JOIN playerStats ON games.id = playerStats.games_id
					where: {
						position: 1,	// AND playerStats.position = 1
					},
					include: [
						{
						model: db.models.players,
						attributes: [],
						required: false,	// LEFT JOIN players ON playerStats.player_id = players.id
						},
					],
				},
			],
		});

		if (!globalHistoryTable)
			return res.status(404).json({ msg: "Error fetching global history"});

		return res.json(globalHistoryTable);
	} catch (error) {
		console.error('Error fetching global history":', error);
		res.status(500).json({ error: "Error fetching global history" });
	}
};


// export async function playerHistory(req, res){
// 	try {
// 		// Get player_id
// 		// const id = await db.models.userAccounts.findOne({
// 		// 	where: { username: req.user.username },
// 		// 	attributes: ['player_id'],
// 		// });
// 		const player_id = 1;


// 		const historyTable = await db.models.players.findAll({
// 			attributes: [
// 				'games.match.name',
// 				'games.start_time',
// 				'games.chrono',
// 				'games.position',
// 				[fn('COUNT', col('playerStats.id')), 'games'], // all games
// 				[fn('COUNT', col('wins.id')), 'wins']           // only wins
// 			],
// 			include: [
// 				{ model: db.models.playerStats, attributes: [] },       // all games
// 				{ model: db.models.playerStats, as: 'wins', attributes: [] } // wins only
// 			],
// 			group: ['players.id']
// 		});

// 		if (!historyTable)
// 			return res.status(404).json({ msg: "User profile not found."});

// 		return res.json(historyTable);
// 	} catch (error) {
// 		console.error('Error fetching player profile:', error);
// 		res.status(500).json({ error: "Erreur serveur" });
// 	}
// };


