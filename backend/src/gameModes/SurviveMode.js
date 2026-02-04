import GameMode from './GameMode.js';
import { generateSurvivePlatforms, generateSurviveCheckpoints } from '../surviveGame.js';

class SurviveMode extends GameMode {
	generatePlatforms() {
		return generateSurvivePlatforms(this.platformIdCounter);
	}

	generateCheckpoints() {
		return generateSurviveCheckpoints();
	}
}

export default SurviveMode;
