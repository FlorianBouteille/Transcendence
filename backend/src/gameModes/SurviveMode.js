import GameMode from './GameMode.js';
import { generateSurvivePlatforms } from '../surviveGame.js';

class SurviveMode extends GameMode {
	generatePlatforms() {
		return generateSurvivePlatforms(this.platformIdCounter);
	}

	initGameState() {
		return {
			alivePlayers: [],
			deathZone: -20, // Hauteur en dessous de laquelle on meurt
			winner: null
		};
	}

	onPlayerJoin(player, game) {
		// Ajouter le joueur à la liste des vivants
		if (!game.gameState.alivePlayers.includes(player.id)) {
			game.gameState.alivePlayers.push(player.id);
			player.alive = true;
		}
	}

	tick(game, io) {
		// Si un gagnant existe déjà, ne rien faire
		if (game.gameState.winner) return;

		// Vérifier si des joueurs tombent dans le vide
		for (const player of Object.values(game.players)) {
			if (!player.loaded || !player.alive) continue;

			if (player.y < game.gameState.deathZone) {
				player.alive = false;
				game.gameState.alivePlayers = game.gameState.alivePlayers.filter(
					id => id !== player.id
				);
				
				console.log(`💀 Player ${player.id} est mort! Restants: ${game.gameState.alivePlayers.length}`);
				
				io.to(this.roomID).emit('playerDied', {
					playerId: player.id,
					remainingPlayers: game.gameState.alivePlayers.length
				});
			}
		}

		// Vérifier si un seul joueur reste
		if (game.gameState.alivePlayers.length === 1) {
			const winnerId = game.gameState.alivePlayers[0];
			game.gameState.winner = winnerId;
			const winner = game.players[winnerId];
			
			console.log(`🏆 Player ${winnerId} a survécu!`);
			
			io.to(this.roomID).emit('gameEnd', {
				winner: winnerId,
				winnerColor: winner ? winner.color : null,
				reason: 'last_survivor'
			});
		}
		
		// Si plus personne n'est vivant
		else if (game.gameState.alivePlayers.length === 0) {
			console.log(`💀 Tout le monde est mort!`);
			
			io.to(this.roomID).emit('gameEnd', {
				winner: null,
				reason: 'everyone_died'
			});
			game.gameState.winner = 'none';
		}
	}

	checkWinCondition(game) {
		return game.gameState.winner;
	}

	getGameState(game) {
		return {
			alivePlayers: game.gameState.alivePlayers,
			deathZone: game.gameState.deathZone
		};
	}
}

export default SurviveMode;
