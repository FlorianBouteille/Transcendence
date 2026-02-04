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
    let pauseFactor = 8;
    let delayFactor = 5;
    let speedFactor = 2;
	// Plateforme de départ
    for (let i = 0; i < 4; i++)
    {
        platforms.push({
            id: platformIdCounter++,
            type: 'disapearing',
            position: { x: i * 5, y: 0, z: 0 },
            size: { x: 4, y: 1, z: 4 },
            duration: 3 + Math.random() * 2,
            life: 4 + Math.random() * 4,
            death: 1 + Math.random() * 2,
            color: generateColor(),
            material: 'transparent'
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'disapearing',
            position: { x: i * 5, y: 0, z: 5 },
            size: { x: 4, y: 1, z: 4 },
            duration: 3 + Math.random() * 2,
            life: 4 + Math.random() * 4,
            death: 1 + Math.random() * 2,
            color: generateColor(),
            material: 'transparent'
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'disapearing',
            position: { x: i * 5, y: 0, z: -5 },
            size: { x: 4, y: 1, z: 4 },
            duration: 3 + Math.random() * 2,
            life: 4 + Math.random() * 4,
            death: 1 + Math.random() * 2,
            color: generateColor(),
            material: 'transparent'
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5, y: 1, z: -20 },
            positionB: { x: i * 5, y: 1, z: 35 },
            size: { x: 4, y: 0.5, z: 1},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5, y: 3, z: -20 },
            positionB: { x: i * 5, y: 3, z: 35 },
            size: { x: 4, y: 0.5, z: 1},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5 - 20, y: 3, z: i * 5 - 5 },
            positionB: { x: i * 5 + 35, y: 3, z: i * 5 - 5 },
            size: { x: 1, y: 0.5, z: 4},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5 - 20, y: 1, z: i * 5 - 5 },
            positionB: { x: i * 5 + 35, y: 1, z: i * 5 - 5 },
            size: { x: 1, y: 0.5, z: 4},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5, y: 1, z: 35 },
            positionB: { x: i * 5, y: 1, z: -20 },
            size: { x: 4, y: 0.5, z: 1},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5, y: 3, z: 35 },
            positionB: { x: i * 5, y: 3, z: -20 },
            size: { x: 4, y: 0.5, z: 1},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5 + 35, y: 3, z: i * 5 - 5 },
            positionB: { x: i * 5 - 20, y: 3, z: i * 5 - 5 },
            size: { x: 1, y: 0.5, z: 4},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'linear',
            positionA: { x: i * 5 + 35, y: 1, z: i * 5 - 5 },
            positionB: { x: i * 5 - 20, y: 1, z: i * 5 - 5 },
            size: { x: 1, y: 0.5, z: 4},
            delay: delayFactor + Math.random() * delayFactor,
            pauseTime: pauseFactor + Math.random() * pauseFactor,
            travelTime: 4 + Math.random() * speedFactor, 
            finalStayTime: 0,
        })
        platforms.push({
            id: platformIdCounter++,
            type: 'static',
            position: {x: 0, y: 10, z: 0},
            size: {x: 20, y:1, z : 20},
            material: 'invisible'
        })
    }
    return (platforms);
}

function generateSurviveCheckpoints() {
	// Pas de checkpoints dans le mode Survive (ou des checkpoints différents si tu veux)
	// Par exemple, des zones de sécurité temporaires
	const checkpoints = [];
	
	// Si tu veux ajouter des checkpoints pour Survive :
	// checkpoints.push({
	// 	posX: 0,
	// 	posY: 5,
	// 	posZ: 0
	// });
    checkpoints.push({
        posX: 0,
        posY: 10.5,
        posZ: 0
    });
	
	return checkpoints;
}

export { generateSurvivePlatforms, generateSurviveCheckpoints };
