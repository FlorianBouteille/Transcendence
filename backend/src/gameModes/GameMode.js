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
	initGameState()
	{
		return {};
	}
}

export default GameMode;
