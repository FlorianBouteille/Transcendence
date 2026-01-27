

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
		color: '#ff0000',
		keys: {
			w: false,
			a: false,
			s: false,
			d: false,
			space: false
		}
	};
	console.log('Joueur ajouté:', id);
}

function updatePlayerInput(id, key, pressed) {
	if (!players[id]) return;

	if (key === 'KeyW') players[id].keys.w = pressed, console.log(id, 'pressed W');
	if (key === 'KeyA') players[id].keys.a = pressed, console.log(id, 'pressed A');
	if (key === 'KeyS') players[id].keys.s = pressed, console.log(id, 'pressed S');
	if (key === 'KeyD') players[id].keys.d = pressed, console.log(id, 'pressed D');
	if (key === 'Space') players[id].keys.space = pressed, console.log(id, 'pressed SPACE');
}

function initGameServer(socketIo) {
	io = socketIo;
	console.log('Game Server initialisé');

	setInterval(gameLoop, 16);
}


function gameLoop() {
	Object.values(players).forEach(player => { })

	const GameState = {
		players: Object.values(players)
	};
	io.emit('gameState', GameState);
}


export { addPlayer, removePlayer, updatePlayerInput, initGameServer };