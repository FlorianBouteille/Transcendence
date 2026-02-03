import CrownMode from './CrownMode.js';
import SurviveMode from './SurviveMode.js';

// Factory pour créer le bon mode de jeu
function createGameMode(gameType, roomID, platformIdCounter) {
	switch (gameType) {
		case 'crown':
			return new CrownMode(roomID, platformIdCounter);
		case 'survive':
			return new SurviveMode(roomID, platformIdCounter);
		default:
			console.warn(`⚠️ Type de jeu inconnu: ${gameType}, utilisation de 'crown' par défaut`);
			return new CrownMode(roomID, platformIdCounter);
	}
}

export { createGameMode };
