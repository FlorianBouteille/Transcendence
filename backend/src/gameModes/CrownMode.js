import GameMode from './GameMode.js';
import { generateCrownPlatforms } from '../crownGame.js';

class CrownMode extends GameMode {
	generatePlatforms() {
		return generateCrownPlatforms(this.platformIdCounter);
	}

	initGameState() {
		return {
			crownPosition: { x: -66, y: 72, z: 0 }, // Position finale de l'arrivée
			winner: null
		};
	}

	tick(game, io) {
		// Si un gagnant existe déjà, ne rien faire
		if (game.gameState.winner) return;

		// Vérifier si un joueur touche la couronne
		const crownPos = game.gameState.crownPosition;
		const CROWN_RADIUS = 2;

		for (const player of Object.values(game.players)) {
			if (!player.loaded) continue;

			const distance = Math.sqrt(
				Math.pow(player.x - crownPos.x, 2) +
				Math.pow(player.y - crownPos.y, 2) +
				Math.pow(player.z - crownPos.z, 2)
			);

			if (distance < CROWN_RADIUS) {
				game.gameState.winner = player.id;
				console.log(`🏆 Player ${player.id} a gagné la course!`);
				
				io.to(this.roomID).emit('gameEnd', {
					winner: player.id,
					winnerColor: player.color,
					reason: 'crown_reached'
				});
				return;
			}
		}
	}

	checkWinCondition(game) {
		return game.gameState.winner;
	}

	getGameState(game) {
		return {
			crownPosition: game.gameState.crownPosition
		};
	}
}

export default CrownMode;
