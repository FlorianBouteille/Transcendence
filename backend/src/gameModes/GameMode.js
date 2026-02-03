// Classe de base abstraite pour tous les modes de jeu
class GameMode {
	constructor(roomID, platformIdCounter) {
		this.roomID = roomID;
		this.platformIdCounter = platformIdCounter;
	}

	// À implémenter dans chaque mode
	generatePlatforms() {
		throw new Error('generatePlatforms() must be implemented');
	}

	// Génère les checkpoints spécifiques au mode
	generateCheckpoints() {
		return []; // Par défaut, pas de checkpoints
	}

	// Logique exécutée à chaque frame du gameLoop
	tick(game, io) {
		throw new Error('tick() must be implemented');
	}

	// Vérifie si la partie est terminée et retourne le gagnant
	checkWinCondition(game) {
		throw new Error('checkWinCondition() must be implemented');
	}

	// Initialise l'état spécifique du mode
	initGameState() {
		return {};
	}

	// Retourne les données additionnelles à envoyer au client
	getGameState(game) {
		return {};
	}

	// Actions lors de l'arrivée/départ d'un joueur
	onPlayerJoin(player, game) {}
	onPlayerLeave(player, game) {}
}

export default GameMode;
