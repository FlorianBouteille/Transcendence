import { db } from "../db/index.js";

/**
 * Get all achievements
 */
export async function getAllAchievements(req, res) {
	try {
		const achievements = await db.models.achievements.findAll({
			attributes: ['id', 'achievement_name', 'achievement_description', 'icon', 'category']
		});

		return res.json({ data: achievements });
	} catch (error) {
		console.error('Error in getAllAchievements:', error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * Get achievements for the logged-in user
 */
export async function getMyAchievements(req, res) {
	try {
		const playerId = req.user.id;

		const achievements = await db.models.playerAchievements.findAll({
			where: { player_id: playerId },
			include: [{
				model: db.models.achievements,
				as: 'achievement',
				attributes: ['id', 'achievement_name', 'achievement_description', 'icon', 'category']
			}],
			attributes: ['acquired_at'],
			order: [['acquired_at', 'DESC']]
		});

		return res.json({ data: achievements });
	} catch (error) {
		console.error('Error in getMyAchievements:', error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * Get achievements for a specific player by ID
 */
export async function getPlayerAchievements(req, res) {
	try {
		const { id } = req.params;

		const achievements = await db.models.playerAchievements.findAll({
			where: { player_id: id },
			include: [{
				model: db.models.achievements,
				as: 'achievement',
				attributes: ['id', 'achievement_name', 'achievement_description', 'icon', 'category']
			}],
			attributes: ['acquired_at'],
			order: [['acquired_at', 'DESC']]
		});

		return res.json({ data: achievements });
	} catch (error) {
		console.error('Error in getPlayerAchievements:', error);
		return res.status(500).json({ error: "Internal server error" });
	}
}

/**
 * Check and unlock achievements for a player after a game
 * This is called internally after saving a game
 */
export async function checkAndUnlockAchievements(playerId, gameData, transaction) {
	try {
		const unlockedAchievements = [];

		// Get player stats
		const player = await db.models.players.findByPk(playerId, { transaction });
		if (!player) return unlockedAchievements;

		// Get player's total wins
		const totalWins = await db.models.playerStats.count({
			where: { 
				player_id: playerId,
				position: 1
			},
			transaction
		});

		// Get player's total games
		const totalGames = await db.models.playerStats.count({
			where: { player_id: playerId },
			transaction
		});

		// Define achievement conditions
		const achievementChecks = [
			{
				id: 1, // First Win
				condition: totalWins >= 1,
				name: 'First Win'
			},
			{
				id: 2, // 10 Wins
				condition: totalWins >= 10,
				name: '10 Wins'
			},
			{
				id: 3, // 50 Wins
				condition: totalWins >= 50,
				name: '50 Wins'
			},
			{
				id: 4, // First Game
				condition: totalGames >= 1,
				name: 'First Game'
			},
			{
				id: 5, // 100 Games
				condition: totalGames >= 100,
				name: '100 Games'
			},
			{
				id: 6, // Level 5
				condition: player.level >= 5,
				name: 'Level 5'
			},
			{
				id: 7, // Level 10
				condition: player.level >= 10,
				name: 'Level 10'
			},
			{
				id: 8, // Crown Master (win in crown mode)
				condition: gameData.gameType === 'crown' && gameData.players.find(p => p.userId === playerId)?.position === 1,
				name: 'Crown Master'
			},
			{
				id: 9, // Survivor (win in survive mode)
				condition: gameData.gameType === 'survive' && gameData.players.find(p => p.userId === playerId)?.position === 1,
				name: 'Survivor'
			}
		];

		// Check each achievement
		for (const check of achievementChecks) {
			if (check.condition) {
				// Check if player already has this achievement
				const existing = await db.models.playerAchievements.findOne({
					where: {
						player_id: playerId,
						achievement_id: check.id
					},
					transaction
				});

				// If not, unlock it
				if (!existing) {
					await db.models.playerAchievements.create({
						player_id: playerId,
						achievement_id: check.id
					}, { transaction });

					unlockedAchievements.push({
						id: check.id,
						name: check.name
					});

					console.log(`🏆 Player ${playerId} unlocked achievement: ${check.name}`);
				}
			}
		}

		return unlockedAchievements;
	} catch (error) {
		console.error('Error in checkAndUnlockAchievements:', error);
		throw error;
	}
}
