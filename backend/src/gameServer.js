import { generateCrownPlatforms } from './crownGame.js';
import { createGameMode } from './gameModes/gameModeFactory.js';

let io;
const gameInstances = {};
let platformIdCounter = { value: 0 };
const waitingPlayer = {};
let lastRandomRoom = {};
const playerGameTypes = {};

function printGameInstances() {
	console.log('\n╔════════════════════════════════════════════════════════════════╗');
	console.log('║                      GAME INSTANCES                            ║');
	console.log('╚════════════════════════════════════════════════════════════════╝');
	console.log(`📊 Total rooms: ${Object.keys(gameInstances).length}`);
	console.log(`⏳ Waiting players:`);
	Object.entries(waitingPlayer).forEach(([gameType, players]) => {
		console.log(`   ${gameType}: ${players.length} [${players.join(', ')}]`);
	});
	console.log(`🎲 Last random rooms:`);
	Object.entries(lastRandomRoom).forEach(([gameType, roomID]) => {
		console.log(`   ${gameType}: ${roomID || 'none'}`);
	});
	console.log('');

	if (Object.keys(gameInstances).length === 0) {
		console.log('   (Aucune room active)\n');
		return;
	}

	Object.entries(gameInstances).forEach(([roomID, game], index) => {
		console.log(`┌─ Room ${index + 1}: ${roomID} ${'─'.repeat(Math.max(0, 50 - roomID.length))}`);
		console.log(`│  🎮 Type: ${game.type}`);
		console.log(`│  🎯 Game Type: ${game.gameType}`);
		console.log(`│  🏁 Has Started: ${game.hasStarted ? '✅' : '❌'}`);
		console.log(`│  ⏱️  Start Time: ${new Date(game.startTime).toLocaleTimeString()}`);
		console.log(`│  🎲 GameMode: ${game.gameMode ? game.gameMode.constructor.name : 'none'}`);

		if (game.type === 'private') {
			console.log(`│  👑 Host: ${game.host}`);
			console.log(`│  👥 Roomers (${game.roomers?.length || 0}): [${game.roomers?.join(', ') || ''}]`);
			console.log(`│  ✅ Ready Players (${game.readyPlayers?.length || 0}): [${game.readyPlayers?.join(', ') || ''}]`);
		}
		if (game.type === 'random') {
			console.log(`│  🎯 Expected Players: ${game.expectedPlayers || 'N/A'}`);
		}

		const playerCount = Object.keys(game.players).length;
		console.log(`│  👤 Players (${playerCount}):`);
		if (playerCount === 0) {
			console.log(`│     (Aucun joueur)`);
		} else {
			Object.entries(game.players).forEach(([id, player]) => {
				const readyStatus = player.ready ? '✅' : '❌';
				const loadedStatus = player.loaded ? '✅' : '❌';
				const aliveStatus = player.alive ? '💚' : '💀';
				console.log(`│     • ${id.substring(0, 8)}...`);
				console.log(`│       Ready: ${readyStatus} | Loaded: ${loadedStatus} | Alive: ${aliveStatus}`);
				console.log(`│       Position: (${player.x.toFixed(1)}, ${player.y.toFixed(1)}, ${player.z.toFixed(1)})`);
				console.log(`│       Grounded: ${player.isGrounded ? '✅' : '❌'} | Jumping: ${player.isJumping ? '✅' : '❌'} | Moving: ${player.isMoving ? '✅' : '❌'}`);
			});
		}

		console.log(`│  🟦 Platforms: ${game.platforms.length}`);

		if (game.gameState) {
			console.log(`│  📊 Game State:`);
			Object.entries(game.gameState).forEach(([key, value]) => {
				if (typeof value === 'object' && value !== null) {
					console.log(`│     ${key}: ${JSON.stringify(value)}`);
				} else {
					console.log(`│     ${key}: ${value}`);
				}
			});
		}

		console.log(`└${'─'.repeat(63)}\n`);
	});

	console.log('═'.repeat(66) + '\n');
}

function generateAllPlatforms() {
	return generateCrownPlatforms(platformIdCounter);
}

function removePlayer(id, roomID) {
	let room = findRoomBySocketId(id);
	if (!room) room = roomID;
	if (!room || !gameInstances[room]) {
		console.log('Failed to remove:', id, 'from:', room);
		return;
	}

	const game = gameInstances[room];

	// Rooms privates
	if (game.type === 'private') {
		// Lobby uniquement : retirer des roomers
		if (!game.hasStarted) {
			const roomerIndex = game.roomers?.indexOf(id);
			if (roomerIndex > -1) game.roomers.splice(roomerIndex, 1);

			const readyIndex = game.readyPlayers?.indexOf(id);
			if (readyIndex > -1) game.readyPlayers.splice(readyIndex, 1);

			console.log('Joueur retiré du lobby:', id);

			if (game.roomers.length === 0) {
				delete gameInstances[room];
				console.log(`🗑️ Room ${room} supprimée (vide)`);
				return;
			}

			if (game.host === id) {
				game.host = game.roomers[0];
				console.log(`👑 Nouveau host: ${game.host}`);
			}

			io.to(room).emit('lobbyUpdate', {
				players: game.roomers.map(id => ({
					id,
					isHost: id === game.host,
					ready: game.readyPlayers.includes(id)
				})),
				count: game.roomers.length,
				allReady: game.readyPlayers.length === game.roomers.length
			});
		} else {
			console.log('Joueur déconnecté (reconnexion possible):', id);
		}

		delete game.players[id];
		delete playerGameTypes[id];
	} else {
		// Solo/Random
		delete game.players[id];
		delete playerGameTypes[id];
		console.log('Joueur retiré:', id);

		if (Object.keys(game.players).length === 0) {
			delete gameInstances[room];
			console.log(`🗑️ Room ${room} supprimée (vide)`);
		}
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
	if (!gameInstances[roomID] || !gameInstances[roomID].players[id])
		return false;


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

		if (game.gameMode) {
			game.gameMode.tick(game, io);

			const winner = game.gameMode.checkWinCondition(game);
			if (winner) {
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
		if (gameInstances[roomID].countdownCancelled) {
			delete gameInstances[roomID].countdownCancelled;
			console.log('game bien cancel');
			return;
		}
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
		playerGameTypes[socket.id] = gameType;
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
		printGameInstances();
		socket.emit('gameStarted', { roomId: roomID });
		console.log(`New solo player on roomID: ${roomID}, gameType: ${gameType}`);
	});


	socket.on('joinRandom', async ({ gameType = 'crown' }) => {
		playerGameTypes[socket.id] = gameType;
		if (!waitingPlayer[gameType]) {
			waitingPlayer[gameType] = [];
			lastRandomRoom[gameType] = 0;
		}
		waitingPlayer[gameType].push(socket.id);
		io.emit('queueUpdate', {
			gameType: gameType,
			count: waitingPlayer[gameType].length
		});

		if (waitingPlayer[gameType].length >= 2 && (lastRandomRoom[gameType] === 0 || !gameInstances[lastRandomRoom[gameType]] || gameInstances[lastRandomRoom[gameType]].hasStarted)) {
			const roomID = 'RANDOM_' + gameType + '_' + socket.id;
			lastRandomRoom[gameType] = roomID;
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

			while (waitingPlayer[gameType].length < 2) {
				for (let i = 10; i > 0; i--) {
					io.emit('countdown', { seconds: `Waiting for players... ${i}s` });
					await sleep(1000);
				}
			}

			const addedPlayer = waitingPlayer[gameType].slice(0, 8);
			gameInstances[roomID].expectedPlayers = addedPlayer.length;
			addedPlayer.forEach(playerId => {
				const playerSocket = io.sockets.sockets.get(playerId);
				if (playerSocket) {
					playerSocket.emit('gameStarted', { roomId: roomID });
				}
			});
			waitingPlayer[gameType].splice(0, addedPlayer.length);
		}
		printGameInstances();
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
		printGameInstances();

	});

	socket.on('joinPrivateRoom', (data) => {
		const roomID = 'PRIVATE_' + data.roomCode;
		if (!gameInstances[roomID] || gameInstances[roomID].playing) {
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
		printGameInstances();
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

		if (gameType && gameType !== gameInstances[roomID].gameType) {
			const gameMode = createGameMode(gameType, roomID, platformIdCounter);
			gameInstances[roomID].gameType = gameType;
			gameInstances[roomID].gameMode = gameMode;
			gameInstances[roomID].platforms = gameMode.generatePlatforms();
			gameInstances[roomID].gameState = gameMode.initGameState();
		}
		startGameCountdown(roomID);
	});

	socket.on('cancelGame', () => {
		const roomID = findRoomBySocketId(socket.id);
		if (!roomID || !gameInstances[roomID]) return;


		gameInstances[roomID].countdownCancelled = true;
		console.log('game Cancelled');
		io.to(roomID).emit('gameCancelled');

	});

	socket.on('leavePrivate', () => {
		const findRoom = findRoomBySocketId(socket.id);
		if (!findRoom) return;
		const wasHost = gameInstances[findRoom].host === socket.id;
		const index = gameInstances[findRoom].roomers.indexOf(socket.id);
		if (index > -1) {
			gameInstances[findRoom].roomers.splice(index, 1);
		}
		const readyIndex = gameInstances[findRoom].readyPlayers.indexOf(socket.id);
		if (readyIndex > -1) {
			gameInstances[findRoom].readyPlayers.splice(readyIndex, 1);
		}
		if (gameInstances[findRoom].roomers.length === 0) {
			delete gameInstances[findRoom];
			console.log(`🗑️ Room ${findRoom} supprimée (vide)`);
			socket.leave(findRoom);
			return;
		}
		if (wasHost && gameInstances[findRoom].roomers.length > 0) {
			gameInstances[findRoom].host = gameInstances[findRoom].roomers[0];
			console.log(`👑 Nouveau host: ${gameInstances[findRoom].host}`);
		}
		io.to(findRoom).emit('lobbyUpdate', {
			players: gameInstances[findRoom].roomers.map(id => ({
				id,
				isHost: id === gameInstances[findRoom].host,
				ready: gameInstances[findRoom].readyPlayers.includes(id)
			})),
			count: gameInstances[findRoom].roomers.length,
			allReady: gameInstances[findRoom].readyPlayers.length === gameInstances[findRoom].roomers.length
		});
		socket.leave(findRoom);
	});

	socket.on('leaveQueue', () => {
		const gameType = playerGameTypes[socket.id];
		if (!gameType || !waitingPlayer[gameType]) return;
		const index = waitingPlayer[gameType].indexOf(socket.id);
		if (index > -1) {
			waitingPlayer[gameType].splice(index, 1);
			console.log(`❌ ${socket.id} a quitté la file d'attente`);
			io.emit('queueUpdate', { count: waitingPlayer[gameType].length });
		}
	});

	socket.on('joinRoom', (roomID) => {
		if (!gameInstances[roomID]) {
			console.log('❌ Room inexistante:', roomID);
			socket.emit('roomNotFound');
			return;
		}

		if (gameInstances[roomID].type === 'random' && gameInstances[roomID].hasStarted) {
			console.log('❌ Room déjà lancée, redirect vers lobby:', roomID);
			socket.emit('roomNotFound');
			return;
		}
		if (gameInstances[roomID].type === 'private' && gameInstances[roomID].playing) {
			console.log('❌ Room déjà lancée, redirect vers lobby:', roomID);
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