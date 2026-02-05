// ==================== CROWN GAME ====================
// Ce fichier contient toute la logique spécifique au jeu "Crown"

// Fonction pour générer un material aléatoire (retourne juste un nom, pas l'objet Three.js)
function getRandomBlockMaterial() {
	const rand = Math.random();
	if (rand < 0.33) return 'blockblue';
	if (rand < 0.66) return 'blockgreen';
	return 'blockred';
}

function getRandomfabricMaterial() {
	const rand = Math.random();
	if (rand < 0.25) return 'fabricpaddedblue';
	if (rand < 0.5) return 'fabricpaddedgreen';
	if (rand < 0.75) return 'fabricpaddedyellow';
	return 'fabricpaddedred';
}

function getRandomRubberMaterial() {
	const rand = Math.random();
	if (rand < 0.25) return 'rubberfloorblue';
	if (rand < 0.5) return 'rubberfloorgreen';
	if (rand < 0.75) return 'rubberflooryellow';
	return 'rubberfloorred';
}

function getRandomNormalMaterial() {
	const rand = Math.random();
	if (rand < 0.25) return 'normalblue';
	if (rand < 0.5) return 'normalgreen';
	if (rand < 0.75) return 'normalyellow';
	return 'normalred';
}

function generateColor() {
	return (Math.round((Math.random() * 0xffffff)));
}

function generateStairRight(platforms, platformIdCounter) {
	const stairs = [
		{ x: 8, y: 1.19, z: 8 },
		{ x: 13, y: 2.3, z: 11 },
		{ x: 18, y: 3.4, z: 13 },
		{ x: 24, y: 4.5, z: 13 },
		{ x: 29, y: 5.6, z: 11 },
		{ x: 34, y: 6.7, z: 8 }
	];

	const colo = generateColor();
	stairs.forEach(pos => {
		platforms.push({
			id: platformIdCounter.value++,
			type: 'static',
			position: pos,
			size: { x: 3, y: 0.5, z: 3 },
			color: colo,
			//material: getRandomNormalMaterial()
		});
	});
}

function generateStairLeft(platforms, platformIdCounter) {
	const stairs = [
		{ x: 8, y: 1.2, z: -8 },
		{ x: 13, y: 2.3, z: -11 },
		{ x: 18, y: 3.4, z: -13 },
		{ x: 24, y: 4.5, z: -13 },
		{ x: 29, y: 5.6, z: -11 },
		{ x: 34, y: 6.7, z: -8 }
	];
	const colo = generateColor();

	stairs.forEach(pos => {
		platforms.push({
			id: platformIdCounter.value++,
			type: 'static',
			position: pos,
			size: { x: 3, y: 0.5, z: 3 },
			color: colo,
			//material: getRandomNormalMaterial()
		});
	});
}

function generateMiddleWay(platforms, platformIdCounter) {
	const colo = generateColor();
	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 8, y: 4, z: 0 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 0, y: 7, z: 0 },
		speed: { x: 0, y: 1, z: 0 },
		phase: { x: 0, y: 1, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 8, y: 4, z: -4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 0, y: 7, z: 0 },
		speed: { x: 0, y: 1, z: 0 },
		phase: { x: 0, y: 0, z: 0.5 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 8, y: 4, z: 4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 0, y: 7, z: 0 },
		speed: { x: 0, y: 1, z: 0 },
		phase: { x: 0, y: 0.5, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 20, y: 7, z: 0 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 1, y: 0, z: 1 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 20, y: 7, z: -4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 1.5, y: 0, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 20, y: 7, z: 4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 2, y: 0, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});
}

function generateDodgeBlocks(platforms, platformIdCounter) {
	let colo = generateColor();
	for (let i = 0; i < 4; i++) {
		let delay = Math.round(Math.random() * i * 4) + 1;
		let speed = Math.round(Math.random() * 3) + 6;

		platforms.push({
			id: platformIdCounter.value++,
			type: 'linear',
			positionA: { x: 110, y: 8, z: -1.5 },
			positionB: { x: 45, y: 8, z: -1.5 },
			size: { x: 1, y: 3, z: 1 },
			travelTime: speed,
			delay: delay,
			pauseTime: 0,
			finalStayTime: 0,
			color: colo
		});
	}
	colo = generateColor()
	for (let i = 0; i < 4; i++) {
		let delay = Math.round(Math.random() * i * 4) + 2;
		let speed = Math.round(Math.random() * 3) + 6;

		platforms.push({
			id: platformIdCounter.value++,
			type: 'linear',
			positionA: { x: 110, y: 8, z: 0 },
			positionB: { x: 45, y: 8, z: -0 },
			size: { x: 1, y: 3, z: 1 },
			travelTime: speed,
			delay: delay,
			pauseTime: 0,
			finalStayTime: 0,
			color: colo
		});
	}
	colo = generateColor()

	for (let i = 0; i < 4; i++) {
		let delay = Math.round(Math.random() * i * 4) + 3;
		let speed = Math.round(Math.random() * 3) + 6;

		platforms.push({
			id: platformIdCounter.value++,
			type: 'linear',
			positionA: { x: 110, y: 8, z: 1.5 },
			positionB: { x: 45, y: 8, z: 1.5 },
			size: { x: 1, y: 3, z: 1 },
			travelTime: speed,
			delay: delay,
			pauseTime: 0,
			finalStayTime: 0,
			color: colo
		});
	}
}

function generateBouncyPlatform(platforms, platformIdCounter) {
	const bounce = [
		{ x: 115, y: 8, z: 0 },
		{ x: 119, y: 12.5, z: -0.7 },
		{ x: 123, y: 17, z: 0.8 },
		{ x: 121, y: 21.5, z: 3 },
		{ x: 116, y: 26, z: 3.8 },
		{ x: 108, y: 26, z: 5 },
		{ x: 99, y: 26, z: 3.2 },
		{ x: 91, y: 26, z: 5.5 },
		{ x: 83, y: 26, z: 2.2 },
		{ x: 75, y: 26, z: 6 },
		{ x: 67, y: 26, z: 1.4 }
	];

	const siz = [
		{ x: 3, y: 0.5, z: 3 },
		{ x: 2.6, y: 0.5, z: 2.6 },
		{ x: 2.3, y: 0.5, z: 2.3 },
		{ x: 2, y: 0.5, z: 2 },
		{ x: 1.8, y: 0.5, z: 1.8 },
		{ x: 1.7, y: 0.5, z: 1.7 },
		{ x: 1.6, y: 0.5, z: 1.6 },
		{ x: 1.5, y: 0.5, z: 1.5 },
		{ x: 1.4, y: 0.5, z: 1.4 },
		{ x: 1.3, y: 0.5, z: 1.3 },
		{ x: 1.2, y: 0.5, z: 1.2 }
	];

	const colo = generateColor();
	for (let i = 0; i < bounce.length; ++i) {
		platforms.push({
			id: platformIdCounter.value++,
			type: 'bouncy',
			position: bounce[i],
			size: siz[i],
			strenght: 12,
			color: colo,
			material: getRandomRubberMaterial()
		});
	}
}

function generateElevator(platforms, platformIdCounter) {
	const colo = generateColor();

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 50, y: 30, z: 1.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 2, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 46, y: 36, z: 5.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 4, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 46, y: 36, z: -3.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 3, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 42, y: 43, z: 1.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 6, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 36, y: 51, z: 5.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 8, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 32, y: 51, z: -3.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 4, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 32, y: 58, z: 1.4 },
		size: { x: 4, y: 0.5, z: 4 },
		amplitude: { x: 0, y: 6, z: 0 },
		speed: { x: 0, y: 2, z: 0 },
		phase: { x: 0, y: 1, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	});
}

function movingStair(platforms, platformIdCounter) {
	for (let i = 0; i < 35; i++) {
		// Plateforme gauche
		if (i % 2 == 0) {
			platforms.push({
				id: platformIdCounter.value++,
				type: 'periodic',
				position: { x: -50 + (i * 2), y: 66 - i/3, z: 2 },
				size: { x: 1.6, y: 1, z: 3 },
				amplitude: { x: 0, y: 2, z: 0 },
				speed: { x: 0, y: Math.PI / 2, z: 0 },
				phase: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
				color: generateColor(),
				material: getRandomBlockMaterial()
			});
		}
		// Plateforme droite
		else {
			platforms.push({
				id: platformIdCounter.value++,
				type: 'periodic',
				position: { x: -50 + (i * 2), y: 66 - i/3, z: -2 },
				size: { x: 1.6, y: 1, z: 3 },
				amplitude: { x: 0, y: 2, z: 0 },
				speed: { x: 0, y: Math.PI / 2, z: 0 },
				phase: { x: 0, y: Math.random() * Math.PI * 2, z: 0 },
				color: generateColor(),
				material: getRandomBlockMaterial()
			});
		}
	}
}

// Fonction principale qui génère toutes les plateformes du jeu Crown
function generateCrownPlatforms(platformIdCounter) {
	const platforms = [];

	platforms.push({
		id: platformIdCounter.value++,
		type: 'static',
		position: { x: 0, y: 0, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		color: generateColor(),
		material: 'scifimetal'
	});

	generateStairRight(platforms, platformIdCounter);
	generateStairLeft(platforms, platformIdCounter);
	generateMiddleWay(platforms, platformIdCounter);

	let colo = generateColor();
	platforms.push({
		id: platformIdCounter.value++,
		type: 'static',
		position: { x: 37, y: 6.5, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		color: colo,
		material: 'scifimetal'
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'static',
		position: { x: 78, y: 6.5, z: 0 },
		size: { x: 70, y: 1, z: 4.5 },
		color: colo,
		material: 'blockblue'
	});

	generateDodgeBlocks(platforms, platformIdCounter);
	generateBouncyPlatform(platforms, platformIdCounter);

	platforms.push({
		id: platformIdCounter.value++,
		type: 'static',
		position: { x: 60, y: 30, z: 1.4 },
		size: { x: 8, y: 0.5, z: 8 },
		color: generateColor(),
		material: 'scifimetal'
	});

	generateElevator(platforms, platformIdCounter);

	platforms.push({
		id: platformIdCounter.value++,
		type: 'static', 
		position: { x: 25, y: 57, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		material: 'scifimetal'
	});

	movingStair(platforms, platformIdCounter);

	platforms.push({
		id: platformIdCounter.value++,
		type: 'static', 
		position: { x: -56, y: 68, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		material: 'scifimetal'
	});

	platforms.push({
		id: platformIdCounter.value++,
		type: 'bouncy',
		position: { x: -66, y: 67, z: 0 },
		size: { x: 4, y: 4, z: 4 },
		strenght: 30,
		material: getRandomRubberMaterial()
	});

	return platforms;
}

function generateCheckpoints()
{
    let checkpoints = []
    let positions = [
        {x: 37, y: 7.5, z: 0},
        {x: 112, y: 8, z: 0},
        {x: 60, y: 30.5, z: 1.44},
        {x: 25, y: 58, z: 0},
        {x: -55, y: 69, z: 0}
    ]
    for (let i = 0; i < positions.length; i++)
    {
        checkpoints.push({
            posX : positions[i].x,
            posY : positions[i].y,
            posZ : positions[i].z
        })
    }
    return checkpoints;
}
export { generateCrownPlatforms, generateCheckpoints };
