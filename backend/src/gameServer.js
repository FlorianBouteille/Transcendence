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

function getRandomRubberMaterial()
{
	const rand = Math.random();
	if (rand < 0.25) return 'rubberfloorblue';
	if (rand < 0.5) return 'rubberfloorgreen';
	if (rand < 0.75) return 'rubberflooryellow';
	return 'rubberfloorred';
}

function getRandomNormalMaterial()
{
	const rand = Math.random();
	if (rand < 0.25) return 'normalblue';
	if (rand < 0.5) return 'normalgreen';
	if (rand < 0.75) return 'normalyellow';
	return 'normalred';
}

const players = {};
const gamePlatforms = [];
let gameStartTime = Date.now();
let platformIdCounter = 0;

let io;


function generateStairRight(platforms) {
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
			id: platformIdCounter++,
			type: 'static',
			position: pos,
			size: { x: 3, y: 0.5, z: 3 },
			color: colo,
			//material: getRandomNormalMaterial()
		});
	});
}


function generateStairLeft(platforms) {
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
			id: platformIdCounter++,
			type: 'static',
			position: pos,
			size: { x: 3, y: 0.5, z: 3 },
			color: colo,
			//material: getRandomNormalMaterial()
		});
	});
}


function generateMiddleWay(platforms) {

	const colo = generateColor();
	platforms.push({
		id: platformIdCounter++,
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
		id: platformIdCounter++,
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
		id: platformIdCounter++,
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
		id: platformIdCounter++,
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
		id: platformIdCounter++,
		type: 'periodic',
		position: { x: 20, y: 7, z: -4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 1.5, y: 0, z: 0 },
		color: colo,
		material: getRandomBlockMaterial()
	}); platforms.push({
		id: platformIdCounter++,
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

function generateDodgeBlocks(platforms) {
	let colo = generateColor();
	for (let i = 0; i < 4; i++) {
		let delay = Math.round(Math.random() * i * 4) + 1;
		let speed = Math.round(Math.random() * 3) + 6;

		platforms.push({
			id: platformIdCounter++,
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
			id: platformIdCounter++,
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
			id: platformIdCounter++,
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


function generateBouncyPlatform(platforms) {
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
			id: platformIdCounter++,
			type: 'bouncy',
			position: bounce[i],
			size: siz[i],
			strenght: 12,
			color: colo,
			material: getRandomRubberMaterial()
		});
	}
}

function generateElevator(platforms) {

	const colo = generateColor();

	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 50, y: 30, z: 1.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 2, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);

	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 46, y: 36, z: 5.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 4, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);

	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 46, y: 36, z: -3.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 3, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);

	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 42, y: 43, z: 1.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 6, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);

	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 36, y: 51, z: 5.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 8, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);

	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 32, y: 51, z: -3.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 4, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);
	platforms.push(
		{
			id: platformIdCounter++,
			type: 'periodic',
			position: { x: 32, y: 58, z: 1.4 },
			size: { x: 4, y: 0.5, z: 4 },
			amplitude: { x: 0, y: 6, z: 0 },
			speed: { x: 0, y: 2, z: 0 },
			phase: { x: 0, y: 1, z: 0 },
			color: colo,
			material: getRandomBlockMaterial()
		}
	);

}

function movingStair(platforms)
{
	for (let i = 0; i < 35; i++)
	{
		// Plateforme gauche
		if (i % 2 == 0)
		{
			platforms.push({
				id: platformIdCounter++,
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
		else
		{
			platforms.push({
				id: platformIdCounter++,
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

function generateAllPlatforms() {
	const platforms = [];

	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 0, y: 0, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		color: generateColor(),
		material: 'scifimetal'

	});

	generateStairRight(platforms);
	generateStairLeft(platforms);
	generateMiddleWay(platforms);


	let colo = generateColor();
	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 37, y: 6.5, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		color: colo,
		material: 'scifimetal'
	});

	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 78, y: 6.5, z: 0 },
		size: { x: 70, y: 1, z: 4.5 },
		color: colo,
		material: 'blockblue'
	});

	generateDodgeBlocks(platforms);
	generateBouncyPlatform(platforms);
	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 60, y: 30, z: 1.4 },
		size: { x: 8, y: 0.5, z: 8 },
		color: generateColor(),
		material: 'scifimetal'

	});

	generateElevator(platforms);
	platforms.push({
		id: platformIdCounter++,
		type: 'static', 
		position: {x: 25, y: 57, z: 0},
		size: {x: 10, y: 1, z: 10},
		material: 'scifimetal'
	})
	movingStair(platforms);
	platforms.push({
		id: platformIdCounter++,
		type: 'static', 
		position: {x: -56, y: 68, z: 0},
		size: {x: 10, y: 1, z: 10},
		material: 'scifimetal'
	})
	platforms.push({
		id: platformIdCounter++,
		type: 'bouncy',
		position: {x: -66, y: 67, z: 0},
		size: {x: 4, y:4, z:4},
		strenght: 30,
		material: getRandomRubberMaterial()
	})
	return platforms;
}

function removePlayer(id) {
	delete players[id];
	console.log('Joueur retire: ', id);
}


function generateColor() {
	return (Math.round((Math.random() * 0xffffff)));
}

function addPlayer(id) {
	players[id] =
	{
		id: id,
		x: 0,
		y: 2,
		z: 0,
		vx: 0,
		vy: 0,
		vz: 0,
		color: generateColor(),
		keys: {
			w: false,
			a: false,
			s: false,
			d: false,
			space: false
		},
		ready: false,
		loaded: false
	};
	console.log('Joueur ajouté:', id);
	broadcastLobbyState();
}

function broadcastLobbyState()
{
	io.emit('lobbyUpdate', {
		players: Object.values(players)
	});
}

function updatePlayerInput(id, key, pressed) {
	if (!players[id]) return;

	if (key === 'KeyW') players[id].keys.w = pressed, console.log(id, 'pressed W');
	if (key === 'KeyA') players[id].keys.a = pressed, console.log(id, 'pressed A');
	if (key === 'KeyS') players[id].keys.s = pressed, console.log(id, 'pressed S');
	if (key === 'KeyD') players[id].keys.d = pressed, console.log(id, 'pressed D');
	if (key === 'Space') players[id].keys.space = pressed, console.log(id, 'pressed SPACE');
}

function setPlayerReady(id) 
{
	if (!players[id]) return;
	players[id].ready = true;
	for (const player of Object.values(players))
	{
		if (player.ready === false)
			return (false);
	}
	return (true);
}

function everyOneLoaded(id)
{
	if (!players[id]) return false;
	
	players[id].loaded = true;
	
	for (const player of Object.values(players))
	{
		if (player.loaded === false)
		{
			return false;
		}
	}
	
	console.log('Tous les joueurs ont chargé !');
	return true;
}

function updatePosition(id, position)
{
	if (!players[id]) return ;
	players[id].x = position.x;
	players[id].y = position.y;
	players[id].z = position.z;
	players[id].rotation = position.rotation;
	players[id].isGrounded = position.isGrounded;
	players[id].isJumping = position.isJumping;
	players[id].isMoving = position.isMoving;
}

function initGameServer(socketIo) {
	io = socketIo;
	console.log('Game Server initialisé');

	// Synchronisation du temps avec les clients
	io.on('connection', (socket) => {
		socket.on('requestServerTime', () => {
			socket.emit('serverTime', Date.now());
		});
	});
	gamePlatforms.push(...generateAllPlatforms());
	console.log('Plateform initialise');
	setInterval(gameLoop, 16);
}
 

function gameLoop() {
	const elapsedTime = (Date.now() - gameStartTime) / 1000;

	Object.values(players).forEach(player => {
		// - gravity, jumpForce, speed
		// 	- Box3 pour les collisions
		// 	- updatePhysics()
		// 	- move() avec collision detection
	})

	const GameState = {
		players: Object.values(players),
		platforms: gamePlatforms,
		elapsedTime: elapsedTime
	};
	io.emit('gameState', GameState);
}


export { addPlayer, removePlayer, updatePlayerInput, initGameServer, setPlayerReady, everyOneLoaded, updatePosition};