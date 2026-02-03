// ==================== SURVIVE GAME ====================
// Ce fichier contient la génération de plateformes pour le mode "Survive"

function generateColor() {
	return (Math.round((Math.random() * 0xffffff)));
}

function getRandomBlockMaterial() {
	const rand = Math.random();
	if (rand < 0.33) return 'blockblue';
	if (rand < 0.66) return 'blockgreen';
	return 'blockred';
}

// Fonction principale qui génère les plateformes du mode Survive
function generateSurvivePlatforms(platformIdCounter) {
	const platforms = [];

	// Plateforme de départ
	platforms.push({
		id: platformIdCounter.value++,
		type: 'static',
		position: { x: 0, y: 0, z: 0 },
		size: { x: 15, y: 1, z: 15 },
		color: generateColor(),
		material: 'scifimetal'
	});

	// Plateforme centrale instable
	platforms.push({
		id: platformIdCounter.value++,
		type: 'periodic',
		position: { x: 20, y: 5, z: 0 },
		size: { x: 8, y: 0.5, z: 8 },
		amplitude: { x: 0, y: 3, z: 0 },
		speed: { x: 0, y: 1.5, z: 0 },
		phase: { x: 0, y: 0, z: 0 },
		color: generateColor(),
		material: getRandomBlockMaterial()
	});

	// Plateformes en cercle qui bougent
	const numCirclePlatforms = 8;
	const circleRadius = 15;
	for (let i = 0; i < numCirclePlatforms; i++) {
		const angle = (i / numCirclePlatforms) * Math.PI * 2;
		platforms.push({
			id: platformIdCounter.value++,
			type: 'periodic',
			position: { 
				x: 40 + Math.cos(angle) * circleRadius, 
				y: 10, 
				z: Math.sin(angle) * circleRadius 
			},
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 5, z: 0 },
			speed: { x: 0, y: 1, z: 0 },
			phase: { x: 0, y: i * 0.3, z: 0 },
			color: generateColor(),
			material: getRandomBlockMaterial()
		});
	}

	// Zone finale avec petites plateformes
	for (let i = 0; i < 12; i++) {
		platforms.push({
			id: platformIdCounter.value++,
			type: 'static',
			position: { 
				x: 60 + (i % 4) * 5, 
				y: 15 + Math.floor(i / 4) * 3, 
				z: -5 + (i % 3) * 5 
			},
			size: { x: 3, y: 0.5, z: 3 },
			color: generateColor(),
			material: 'scifimetal'
		});
	}

	return platforms;
}

export { generateSurvivePlatforms };
