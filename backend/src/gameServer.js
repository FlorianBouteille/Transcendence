import { generateCrownPlatforms } from './crownGame.js';
import { createGameMode } from './gameModes/gameModeFactory.js';

let io;
const gameInstances = {};
let platformIdCounter = { value: 0 };
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

function generateAllPlatforms() {
	return generateCrownPlatforms(platformIdCounter);
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
	const player = {
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
		loaded: false,
		alive: true
	};
	gameInstances[roomID].players[id] = player;
	
	// Appeler le hook du gameMode
	if (gameInstances[roomID].gameMode) {
		gameInstances[roomID].gameMode.onPlayerJoin(player, gameInstances[roomID]);
	}
	
	console.log('Joueur ajouté:', id);
}


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
		if (!game.hasStarted) return;
		
		const elapsedTime = (Date.now() - game.startTime) / 1000;

		// Exécuter la logique spécifique au mode de jeu
		if (game.gameMode) {
			game.gameMode.tick(game, io);
			
			// Vérifier les conditions de victoire
			const winner = game.gameMode.checkWinCondition(game);
			if (winner) {
				// La partie est terminée, on arrête d'envoyer des updates
				return;
			}
		}

		const GameState = {
			players: Object.values(game.players),
			platforms: game.platforms,
			elapsedTime: elapsedTime,
			...(game.gameMode ? game.gameMode.getGameState(game) : {})
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

	socket.on('solo', ({ gameType = 'crown' }) => {
		const roomID = 'SOLO_' + socket.id;
		const gameMode = createGameMode(gameType, roomID, platformIdCounter);
		
		gameInstances[roomID] = {
			players: {},
			platforms: gameMode.generatePlatforms(),
			startTime: Date.now(),
			type: 'solo',
			gameType: gameType,
			gameMode: gameMode,
			gameState: gameMode.initGameState(),
			hasStarted: false
		};
		socket.emit('gameStarted', { roomId: roomID });
		console.log(`New solo player on roomID: ${roomID}, gameType: ${gameType}`);
	});


	socket.on('joinRandom', async ({ gameType = 'crown' }) => {
		waitingPlayer.push(socket.id);
		io.emit('queueUpdate', { count: waitingPlayer.length });
		printGameInstances();
		if (waitingPlayer.length >= 2 && (lastRandomRoom === 0 || !gameInstances[lastRandomRoom] || gameInstances[lastRandomRoom].hasStarted)) {
			const roomID = 'RANDOM_' + socket.id;
			lastRandomRoom = roomID;
			const gameMode = createGameMode(gameType, roomID, platformIdCounter);
			
			gameInstances[roomID] = {
				players: {},
				platforms: gameMode.generatePlatforms(),
				startTime: Date.now(),
				type: 'random',
				gameType: gameType,
				gameMode: gameMode,
				gameState: gameMode.initGameState(),
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
		const { roomCode, gameType = 'crown' } = data;
		const roomID = 'PRIVATE_' + roomCode;
		if (gameInstances[roomID]) {
			console.log('Room id:', roomID, ' is already taken');
			socket.emit('roomInexistant', { roomCode: roomCode });
			return;
		}
		
		const gameMode = createGameMode(gameType, roomID, platformIdCounter);
		
		gameInstances[roomID] = {
			players: {},
			platforms: gameMode.generatePlatforms(),
			startTime: Date.now(),
			type: 'private',
			gameType: gameType,
			gameMode: gameMode,
			gameState: gameMode.initGameState(),
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

	socket.on('startGame', ({ gameType }) => {
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

		// Mettre à jour le gameType si fourni
		if (gameType && gameType !== gameInstances[roomID].gameType) {
			const gameMode = createGameMode(gameType, roomID, platformIdCounter);
			gameInstances[roomID].gameType = gameType;
			gameInstances[roomID].gameMode = gameMode;
			gameInstances[roomID].platforms = gameMode.generatePlatforms();
			gameInstances[roomID].gameState = gameMode.initGameState();
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