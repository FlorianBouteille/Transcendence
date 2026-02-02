// Fonction pour générer un material aléatoire (retourne juste un nom, pas l'objet Three.js)
function getRandomBlockMaterial() {
	const rand = Math.random();
	if (rand < 0.25) return 'blockred';
	if (rand < 0.5) return 'blockgreen';
	if (rand < 0.75) return 'blockblue';
	return 'scifimetal';
}

let io;
const gameInstances = {};
let platformIdCounter = 0;
const waitingPlayer = [];
let lastRandomRoom = 0;


function printGameInstances() {
	console.log('========== GAME INSTANCES ==========');
	console.log('Total rooms:', Object.keys(gameInstances).length);

	Object.entries(gameInstances).forEach(([roomID, game]) => {
		console.log(`\n📦 Room: ${roomID}`);
		console.log(`   Type: ${game.type}`);
		console.log(`   HasStarted: ${game.hasStarted}`);
		console.log(`   Players (${Object.keys(game.players).length}):`);

		Object.entries(game.players).forEach(([id, player]) => {
			console.log(`      - ${id}: loaded=${player.loaded}, position=(${player.x.toFixed(1)}, ${player.y.toFixed(1)}, ${player.z.toFixed(1)})`);
		});

		console.log(`   Platforms: ${game.platforms.length}`);
	});

	console.log('\n📋 Waiting Players:', waitingPlayer);
	console.log('🎲 Last Random Room:', lastRandomRoom);
	console.log('====================================\n');
}


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
			material: getRandomBlockMaterial()
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
			material: getRandomBlockMaterial()
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
		color: colo
	});

	platforms.push({
		id: platformIdCounter++,
		type: 'periodic',
		position: { x: 8, y: 4, z: -4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 0, y: 7, z: 0 },
		speed: { x: 0, y: 1, z: 0 },
		phase: { x: 0, y: 0, z: 0.5 },
		color: colo
	});

	platforms.push({
		id: platformIdCounter++,
		type: 'periodic',
		position: { x: 8, y: 4, z: 4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 0, y: 7, z: 0 },
		speed: { x: 0, y: 1, z: 0 },
		phase: { x: 0, y: 0.5, z: 0 },
		color: colo
	});

	platforms.push({
		id: platformIdCounter++,
		type: 'periodic',
		position: { x: 20, y: 7, z: 0 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 1, y: 0, z: 1 },
		color: colo
	});
	platforms.push({
		id: platformIdCounter++,
		type: 'periodic',
		position: { x: 20, y: 7, z: -4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 1.5, y: 0, z: 0 },
		color: colo
	}); platforms.push({
		id: platformIdCounter++,
		type: 'periodic',
		position: { x: 20, y: 7, z: 4 },
		size: { x: 3, y: 0.5, z: 3 },
		amplitude: { x: 9, y: 0, z: 0 },
		speed: { x: 1.5, y: 0, z: 0 },
		phase: { x: 2, y: 0, z: 0 },
		color: colo
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
			color: colo

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
			color: colo
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
			color: colo
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
			color: colo
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
			color: colo
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
			color: colo
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
			color: colo
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
			color: colo
		}
	);

}


function generateAllPlatforms() {
	const platforms = [];

	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 0, y: 0, z: 0 },
		size: { x: 10, y: 1, z: 10 },
		color: generateColor(),
		material: getRandomBlockMaterial()

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
		material: getRandomBlockMaterial()
	});

	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 78, y: 6.5, z: 0 },
		size: { x: 70, y: 1, z: 4.5 },
		color: colo,
		material: getRandomBlockMaterial()
	});

	generateDodgeBlocks(platforms);
	generateBouncyPlatform(platforms);
	platforms.push({
		id: platformIdCounter++,
		type: 'static',
		position: { x: 60, y: 30, z: 1.4 },
		size: { x: 8, y: 0.5, z: 8 },
		color: generateColor(),
		material: getRandomBlockMaterial()

	});

	generateElevator(platforms);
	return platforms;
}

function removePlayer(id, roomID) {
	if (!roomID || !gameInstances[roomID]) return;
	delete gameInstances[roomID].players[id];
	console.log('Joueur retire: ', id);


	if (Object.keys(gameInstances[roomID].players).length === 0) {
		delete gameInstances[roomID];
		console.log(`🗑️ Room ${roomID} supprimée (vide)`);
	}
}


function generateColor() {
	return (Math.round((Math.random() * 0xffffff)));
}

function addPlayer(id, roomID) {

	if (!gameInstances[roomID]) {
		console.log('Room: ', roomID, 'dosent exist')
		return;
	}
	gameInstances[roomID].players[id] =
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
}



// function updatePlayerInput(id, key, pressed) {
// 	if (!players[id]) return;

// 	if (key === 'KeyW') players[id].keys.w = pressed, console.log(id, 'pressed W');
// 	if (key === 'KeyA') players[id].keys.a = pressed, console.log(id, 'pressed A');
// 	if (key === 'KeyS') players[id].keys.s = pressed, console.log(id, 'pressed S');
// 	if (key === 'KeyD') players[id].keys.d = pressed, console.log(id, 'pressed D');
// 	if (key === 'Space') players[id].keys.space = pressed, console.log(id, 'pressed SPACE');
// }

// function setPlayerReady(id) {
// 	if (!players[id]) return;
// 	players[id].ready = true;
// 	for (const player of Object.values(players)) {
// 		if (player.ready === false)
// 			return (false);
// 	}
// 	return (true);
// }

function everyOneLoaded(id, roomID) {
	if (!gameInstances[roomID] || !gameInstances[roomID].players[id]) return false;

	gameInstances[roomID].players[id].loaded = true;

	for (const player of Object.values(gameInstances[roomID].players)) {
		if (player.loaded === false) {
			return false;
		}
	}

	console.log('Tous les joueurs ont chargé !');
	return true;
}

function updatePosition(id, roomID, position) {
	if (!gameInstances[roomID] || !gameInstances[roomID].players[id]) return;
	gameInstances[roomID].players[id].x = position.x;
	gameInstances[roomID].players[id].y = position.y;
	gameInstances[roomID].players[id].z = position.z;
	gameInstances[roomID].players[id].rotation = position.rotation;
	gameInstances[roomID].players[id].isGrounded = position.isGrounded;
	gameInstances[roomID].players[id].isJumping = position.isJumping;
	gameInstances[roomID].players[id].isMoving = position.isMoving;
}

function initGameServer(socketIo) {
	io = socketIo;
	console.log('Game Server initialisé');

	io.on('connection', (socket) => {
		socket.on('requestServerTime', () => {
			socket.emit('serverTime', Date.now());
		});
	});
	setInterval(gameLoop, 16);
}



function gameLoop() {
	Object.entries(gameInstances).forEach(([roomId, game]) => {
		const elapsedTime = (Date.now() - game.startTime) / 1000;

		const GameState = {
			players: Object.values(game.players),
			platforms: game.platforms,
			elapsedTime: elapsedTime
		};

		io.to(roomId).emit('gameState', GameState);
	});
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


function findRoomBySocketId(id) {
	for (const [roomID, game] of Object.entries(gameInstances)) {
		if (game.type === 'private' && game.roomers && game.roomers.includes(id)) {
			return roomID;
		}
	}
	return null;
}

async function startGameCountdown(roomID) {
	for (let i = 5; i > 0; i--) {
		io.to(roomID).emit('gameCountdown', { seconds: i });
		await sleep(1000);
	}

	gameInstances[roomID].hasStarted = true;
	io.to(roomID).emit('gameStarted', { roomId: roomID });
}

function initLobbyHandler(socket, io) {

	socket.on('solo', () => {
		const roomID = 'SOLO_' + socket.id;
		gameInstances[roomID] =
		{
			players: {},
			platforms: generateAllPlatforms(),
			startTime: Date.now(),
			type: 'solo',
		};
		socket.emit('gameStarted', { roomId: roomID });
		console.log('New solo player on roomID:', roomID);
	});


	socket.on('joinRandom', async () => {
		waitingPlayer.push(socket.id);
		io.emit('queueUpdate', { count: waitingPlayer.length });
		printGameInstances();
		if (waitingPlayer.length >= 2 && (lastRandomRoom === 0 || !gameInstances[lastRandomRoom] || gameInstances[lastRandomRoom].hasStarted)) {
			const roomID = 'RANDOM_' + socket.id;
			lastRandomRoom = roomID;
			gameInstances[roomID] = {
				players: {},
				platforms: generateAllPlatforms(),
				startTime: Date.now(),
				type: 'random',
				hasStarted: false
			};

			for (let i = 10; i > 0; i--) {
				io.emit('countdown', { seconds: i });
				await sleep(1000);
			}

			while (waitingPlayer.length < 2) {
				for (let i = 10; i > 0; i--) {
					io.emit('countdown', { seconds: `Waiting for players... ${i}s` });
					await sleep(1000);
				}
			}

			const addedPlayer = waitingPlayer.slice(0, 8);
			gameInstances[roomID].expectedPlayers = addedPlayer.length;
			addedPlayer.forEach(playerId => {
				const playerSocket = io.sockets.sockets.get(playerId);
				if (playerSocket) {
					playerSocket.emit('gameStarted', { roomId: roomID });
				}
			});
			waitingPlayer.splice(0, addedPlayer.length);
		}
	});

	socket.on('createPrivateRoom', (data) => {
		const roomID = 'PRIVATE_' + data.roomCode;
		if (gameInstances[roomID]) {
			console.log('Room id:', roomID, ' is already taken');
			socket.emit('roomInexistant', { roomCode: data.roomCode });
			return;
		}
		gameInstances[roomID] =
		{
			players: {},
			platforms: generateAllPlatforms(),
			startTime: Date.now(),
			type: 'private',
			hasStarted: false,
			roomers: [],
			readyPlayers: [],
			host: socket.id
		};
		printGameInstances();
		gameInstances[roomID].roomers.push(socket.id);
		socket.join(roomID);
		io.to(roomID).emit('lobbyUpdate', {
			players: gameInstances[roomID].roomers.map(id => ({
				id,
				isHost: id === gameInstances[roomID].host,
				ready: gameInstances[roomID].readyPlayers.includes(id)
			})),
			count: gameInstances[roomID].roomers.length
		});


	});

	socket.on('joinPrivateRoom', (data) => {
		const roomID = 'PRIVATE_' + data.roomCode;
		if (!gameInstances[roomID]) {
			console.log('Room id:', roomID, ' dosen t exist');
			socket.emit('roomInexistant', { roomCode: data.roomCode });
			return;
		}
		gameInstances[roomID].roomers.push(socket.id);
		socket.join(roomID);
		socket.emit('roomJoinedSuccess', { roomCode: data.roomCode });
		io.to(roomID).emit('lobbyUpdate', {
			players: gameInstances[roomID].roomers.map(id => ({
				id,
				isHost: id === gameInstances[roomID].host,
				ready: gameInstances[roomID].readyPlayers.includes(id)
			})),
			count: gameInstances[roomID].roomers.length
		});
	});



	socket.on('playerReady', () => {
		const roomID = findRoomBySocketId(socket.id);
		if (!roomID || !gameInstances[roomID]) return;

		if (!gameInstances[roomID].readyPlayers.includes(socket.id)) {
			gameInstances[roomID].readyPlayers.push(socket.id);
		}

		io.to(roomID).emit('lobbyUpdate', {
			players: gameInstances[roomID].roomers.map(id => ({
				id,
				isHost: id === gameInstances[roomID].host,
				ready: gameInstances[roomID].readyPlayers.includes(id)
			})),
			count: gameInstances[roomID].roomers.length,
			allReady: gameInstances[roomID].readyPlayers.length === gameInstances[roomID].roomers.length
		});
	});

	socket.on('toggleReady', () => {
		const roomID = findRoomBySocketId(socket.id);
		if (!roomID || !gameInstances[roomID]) return;

		const index = gameInstances[roomID].readyPlayers.indexOf(socket.id);

		if (index > -1) {
			gameInstances[roomID].readyPlayers.splice(index, 1);
			console.log(`❌ ${socket.id} n'est plus ready`);
		} else {
			gameInstances[roomID].readyPlayers.push(socket.id);
			console.log(`✅ ${socket.id} est ready`);
		}

		io.to(roomID).emit('lobbyUpdate', {
			players: gameInstances[roomID].roomers.map(id => ({
				id,
				isHost: id === gameInstances[roomID].host,
				ready: gameInstances[roomID].readyPlayers.includes(id)
			})),
			count: gameInstances[roomID].roomers.length,
			allReady: gameInstances[roomID].readyPlayers.length === gameInstances[roomID].roomers.length
		});
	});

	socket.on('startGame', () => {
		const roomID = findRoomBySocketId(socket.id);
		if (!roomID || !gameInstances[roomID]) return;

		if (socket.id !== gameInstances[roomID].host) {
			console.log('❌ Pas le host, cannot start');
			return;
		}

		if (gameInstances[roomID].readyPlayers.length !== gameInstances[roomID].roomers.length) {
			console.log('❌ Pas tout le monde ready');
			return;
		}

		startGameCountdown(roomID);
	});
	socket.on('leavePrivate', () => {
		const findRoom = findRoomBySocketId(socket.id);
		if (!findRoom) return;
		const wasHost = gameInstances[roomID].host === socket.id;
		const index = gameInstances[findRoom].roomers.indexOf(socket.id);
		if (index > -1) {
			gameInstances[findRoom].roomers.splice(index, 1);
		}
		const readyIndex = gameInstances[roomID].readyPlayers.indexOf(socket.id);
		if (readyIndex > -1) {
			gameInstances[roomID].readyPlayers.splice(readyIndex, 1);
		}
		if (gameInstances[findRoom].roomers.length === 0) {
			delete gameInstances[findRoom];
			console.log(`🗑️ Room ${findRoom} supprimée (vide)`);
			socket.leave(findRoom);
			return;
		}
		if (wasHost && gameInstances[roomID].roomers.length > 0) {
			gameInstances[roomID].host = gameInstances[roomID].roomers[0];
			console.log(`👑 Nouveau host: ${gameInstances[roomID].host}`);
		}
		io.to(roomID).emit('lobbyUpdate', {
			players: gameInstances[roomID].roomers.map(id => ({
				id,
				isHost: id === gameInstances[roomID].host,
				ready: gameInstances[roomID].readyPlayers.includes(id)
			})),
			count: gameInstances[roomID].roomers.length,
			allReady: gameInstances[roomID].readyPlayers.length === gameInstances[roomID].roomers.length
		});
		socket.leave(roomID);
	});

	socket.on('leaveQueue', () => {
		const index = waitingPlayer.indexOf(socket.id);
		if (index > -1) {
			waitingPlayer.splice(index, 1);
			console.log(`❌ ${socket.id} a quitté la file d'attente`);
			io.emit('queueUpdate', { count: waitingPlayer.length });
		}
	});

	socket.on('joinRoom', (roomID) => {
		if (!gameInstances[roomID]) {
			console.log('❌ Room inexistante:', roomID);
			socket.emit('roomNotFound');
			return;
		}

		if (gameInstances[roomID].type === 'random' && gameInstances[roomID].hasStarted) {
			console.log('❌ Room random déjà lancée, redirect vers lobby:', roomID);
			socket.emit('roomNotFound');
			return;
		}
		socket.roomID = roomID;
		socket.join(roomID);
		addPlayer(socket.id, roomID);
		console.log(`✅ ${socket.id} a rejoint la room ${roomID}`);

		socket.emit('roomJoined', {
			roomID: roomID,
			platforms: gameInstances[roomID].platforms
		});

		if (gameInstances[roomID].type === 'random' && gameInstances[roomID].expectedPlayers) {
			const currentPlayers = Object.keys(gameInstances[roomID].players).length;
			if (currentPlayers >= gameInstances[roomID].expectedPlayers) {
				gameInstances[roomID].hasStarted = true;
				console.log(`🎮 Room ${roomID} a démarré avec ${currentPlayers} joueurs`);
			}
		}
	});

}



export { addPlayer, removePlayer, initGameServer, everyOneLoaded, updatePosition, initLobbyHandler };