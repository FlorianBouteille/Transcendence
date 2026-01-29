const players = {};

let io;

function removePlayer(id) {
	delete players[id];
	console.log('Joueur retire: ', id);
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
		color: Math.round((Math.random() * 0xffffff)),
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

	setInterval(gameLoop, 16);
}
 

function gameLoop() {
	Object.values(players).forEach(player => {
		// - gravity, jumpForce, speed
		// 	- Box3 pour les collisions
		// 	- updatePhysics()
		// 	- move() avec collision detection
	})

	const GameState = {
		players: Object.values(players)
	};
	io.emit('gameState', GameState);
}


export { addPlayer, removePlayer, updatePlayerInput, initGameServer, setPlayerReady, everyOneLoaded, updatePosition};