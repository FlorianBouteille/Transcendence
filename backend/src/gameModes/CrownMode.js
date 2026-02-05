import GameMode from './GameMode.js';
import { generateCrownPlatforms, generateCheckpoints } from '../crownGameBack.js';

class CrownMode extends GameMode {
	generatePlatforms() {
		return generateCrownPlatforms(this.platformIdCounter);
	}

	generateCheckpoints() {
		return generateCheckpoints();
	}
}

export default CrownMode;
