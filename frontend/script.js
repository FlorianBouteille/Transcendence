import * as THREE from 'three'
import GUI from 'lil-gui'
import { LocalPlayer } from './LocalPlayer.js'
import { RemotePlayer } from './RemotePlayer.js'
import { Coin } from './coin.js'
import { Platform } from './Platform.js'
import { PeriodicPlatform } from './PeriodicPlatform.js'
import { LinearPlatform } from './LinearPlatform.js'
import { BouncyPlatform } from './BouncyPlatform.js'
import { Crown } from './crown.js'
import { CheckPoint } from './CheckPoint.js'
import { randomColor } from './utils.js'
import { CrownGame } from './CrownGame.js'
import { Vector2 } from 'three'
import { connectWS } from './src/network/socket.js'
import { materials, environmentMap, environmentMap2 } from './materials.js'
import { DisapearingPlatform } from './DisapearingPlatform.js'
import { createPlayerLabel, updatePlayerLabels } from './playerLabel.js'
import { SurviveGame } from './SurviveGame.js'

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('room');

if (!roomId) {
	window.location.href = 'lobby.html';
}

//importation des textures :
const socket = connectWS();
let platformsFromBack = [];
let checkpointsFromBack = [];
let movingPlatformsFromBack = [];
let platformsCreated = false
let checkpointsCreated = false
let gameType = null

const user = JSON.parse(localStorage.getItem('user'));
const fallbackUserId = Number(user?.id) || -1;
const fallbackUsername = user?.username || 'Player';

let userId = fallbackUserId;
let username = fallbackUsername;

async function resolveAuthenticatedIdentity() {
	try {
		const response = await fetch('/api/me', {
			method: 'GET',
			credentials: 'include'
		});

		if (!response.ok) {
			return { userId: fallbackUserId, username: fallbackUsername };
		}

		const me = await response.json();
		const resolvedUserId = Number(me?.id) || fallbackUserId;
		const resolvedUsername = me?.username || fallbackUsername;

		return { userId: resolvedUserId, username: resolvedUsername };
	} catch {
		return { userId: fallbackUserId, username: fallbackUsername };
	}
}

function isValidIdentity(id, name) {
	return Number.isInteger(id) && id > 0 && typeof name === 'string' && name.trim().length > 0 && name !== 'Player';
}

socket.on('connect', async () => {
	console.log('✅ Connecté au serveur');
	const identity = await resolveAuthenticatedIdentity();
	userId = identity.userId;
	username = identity.username;

	if (!isValidIdentity(userId, username)) {
		console.warn('❌ Identité invalide pour rejoindre la room, redirection login');
		window.location.href = 'already.html';
		return;
	}

	socket.emit('joinRoom', { roomId, userId, username });
});

socket.on('connect_error', (error) => {
	console.error('❌ Erreur de connexion:', error);
});

socket.on('roomNotFound', () => {
	window.location.href = 'lobby.html';
});

socket.on('unauthorizedJoin', () => {
	window.location.href = 'already.html';
});


const gui = new GUI({
	width: 300,
	title: "tweak shit here"
});

gui.hide();

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// L'environment map sera définie après avoir reçu le gameType du serveur

const remotePlayers = {};  // Stocke les meshes des joueurs distants

function createPlatforms(platformsData) {
	platformsData.forEach(data => {
		let platform;
		if (data.type === 'static')
		{
			platform = new Platform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, materials[data.material], data.randColor);
		}
		else if (data.type === 'periodic') {
			platform = new PeriodicPlatform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, new THREE.Vector3(data.amplitude.x, data.amplitude.y, data.amplitude.z), new THREE.Vector3(data.speed.x, data.speed.y, data.speed.z), new THREE.Vector3(data.phase.x, data.phase.y, data.phase.z), materials[data.material], data.randColor);
			movingPlatformsFromBack.push(platform);
		}
		else if (data.type === 'linear') {
			platform = new LinearPlatform(scene, new THREE.Vector3(data.positionA.x, data.positionA.y, data.positionA.z), new THREE.Vector3(data.positionB.x, data.positionB.y, data.positionB.z), data.size.x, data.size.y, data.size.z, data.travelTime, data.delay, data.pauseTime, data.finalStayTime, materials[data.material], data.randColor);
			movingPlatformsFromBack.push(platform);
		}
		else if (data.type === 'disapearing')
		{
			platform = new DisapearingPlatform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, data.duration, data.life, data.death, data.delay, materials[data.material], data.randColor)
			movingPlatformsFromBack.push(platform);
		}
		else if (data.type === 'bouncy')
			platform = new BouncyPlatform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, data.strenght, materials[data.material], data.randColor);
		if (platform) {
			platformsFromBack.push(platform);
		}
	});
}

function createCheckpoints(checkpointsData)
{
	checkpointsData.forEach(data =>
	{
		let point;
		point = new CheckPoint(data.posX, data.posY, data.posZ)
		scene.add(point.mesh);
		scene.add(point.particles);
		checkpointsFromBack.push(point);
	});
}


socket.on('gameState', (state) => {
	state.players.forEach(playerData => {
		if (playerData.id === socket.id) return;
		if (!remotePlayers[playerData.id]) {
			const remotePlayer = new RemotePlayer(scene, new THREE.Vector3(0, 2, 0), playerData.color);
			remotePlayers[playerData.id] = remotePlayer;
			scene.add(remotePlayer.mesh);
			createPlayerLabel(playerData.id, playerData.username || `Player ${playerData.id.substring(0, 6)}`);
		}

		const remotePlayer = remotePlayers[playerData.id];
		remotePlayer.setPosition(playerData.x, playerData.y, playerData.z, playerData.rotation, playerData.isMoving);
		remotePlayer.isGrounded = playerData.isGrounded;
		remotePlayer.isJumping = playerData.isJumping;
	});
});

//scene.add(gui);

const mouse =
{
	x: 0,
	y: 0,
	deltaX: 0,
	deltaY: 0,
	sensitivity: 1
}

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}

let isGuiOpen = false;

window.addEventListener('mousemove', (event) => {
	// Ne pas bouger la caméra si le GUI est ouvert
	if (isGuiOpen) return;
	
	let newX = (event.clientX / sizes.width) * 2 - 1
	let newY = - (event.clientY / sizes.height) * 2 + 1
	mouse.deltaX = mouse.x - newX;
	mouse.deltaY = mouse.y - newY;
	mouse.x = newX;
	mouse.y = newY;
})

window.addEventListener('keydown', (event) => {
	if (event.key == 'h') {
		gui.show(gui._hidden); // Toggle le GUI
		isGuiOpen = !gui._hidden; // Lire l'état réel du GUI après le toggle
		player.guiOpen = isGuiOpen; // Informer le player
	}
})

const floorGeo = new THREE.PlaneGeometry(400, 400, 1, 1);
const floor = new THREE.Mesh(floorGeo, materials.stonefloor);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -5
scene.add(floor);
// Objects
const player = new LocalPlayer(scene, canvas, username, userId, randomColor());
// Envoyer son nom au serveur
scene.add(player.mesh);
createPlayerLabel('local', player.name);

setInterval(() => {
	socket.emit('playerPosition', {
		x: player.mesh.position.x,
		y: player.mesh.position.y,
		z: player.mesh.position.z,
		checkPointId : player.checkPointId,
		rotation: player.mesh.rotation.y,
		isGrounded: player.isGrounded,
		isJumping: player.isJumping,
		isMoving: player.isMoving
	});
}, 50)

// const grid = new THREE.GridHelper(50, 50);
// scene.add(grid);

// Sizes

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	player.camera.aspect = sizes.width / sizes.height
	player.camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const keys =
{
	w: false,
	s: false,
	a: false,
	d: false,
	space: false
}
// Camera

function onKey(event) {
	if (event.code === 'KeyW')
		keys.w = (event.type === 'keydown')
	if (event.code === 'KeyS')
		keys.s = (event.type === 'keydown')
	if (event.code === 'KeyA')
		keys.a = (event.type === 'keydown')
	if (event.code === 'KeyD')
		keys.d = (event.type === 'keydown')
	if (event.code === 'Space')
		keys.space = (event.type === 'keydown')
	if (event.code === 'KeyQ')
		window.location.href = "lobby.html";

	// Envoyer l'input au serveur
	// socket.emit('playerInput', {
	// 	key: event.code,
	// 	pressed: (event.type === 'keydown'),
	// });
}

window.addEventListener('keydown', onKey)
window.addEventListener('keyup', onKey)

// Renderer

const renderer = new THREE.WebGLRenderer({
	canvas: canvas
})
renderer.setClearColor(0x000000, 1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// GUI
// const playerGui = gui.addFolder('Player');
const platformsGui = gui.addFolder('Plateformes')
for (let i = 0; i < platformsFromBack.length; i++) {
	const platformFolder = platformsGui.addFolder('Plateforme $(i)')
	{
		platformFolder.add(platformsFromBack[i].mesh.position, 'x', -200, 200, 1).name('posX');
		platformFolder.add(platformsFromBack[i].mesh.position, 'z', -200, 200, 1).name('posZ');
		platformFolder.add(platformsFromBack[i].mesh.scale, 'x', -200, 200, 1).name('sizeX');
		platformFolder.add(platformsFromBack[i].mesh.scale, 'z', -200, 200, 1).name('sizeZ');
	}
}

let timeOffset = 0; // Différence entre temps serveur et temps local
let clockStarted = false;

function syncClockWithServer() {
	const samples = [];
	let samplesReceived = 0;

	// Faire 3 mesures pour calculer une moyenne
	for (let i = 0; i < 3; i++) {
		const t0 = Date.now(); // Temps local avant la requête
		socket.emit('requestServerTime');

		socket.once('serverTime', (serverTime) => {
			const t1 = Date.now(); // Temps local après réception
			const roundTripTime = t1 - t0;
			const estimatedServerTimeWhenReceived = serverTime + (roundTripTime / 2);
			const offset = estimatedServerTimeWhenReceived - t1; // Différence serveur - client

			samples.push(offset);
			samplesReceived++;

			// Quand on a toutes les mesures, calculer la moyenne
			if (samplesReceived === 3) {
				timeOffset = samples.reduce((a, b) => a + b, 0) / samples.length;
				clockStarted = true;
			}
		});

		// Attendre un peu entre chaque mesure
		setTimeout(() => { }, i * 50);
	}
}


// Lancer la synchronisation au démarrage
syncClockWithServer();

player.currentPlatform = null;
let currentGame = null;
// Attendre la confirmation que la room est jointe
socket.on('roomJoined', (data) => {
	console.log('✅ Room jointe, création des plateformes');
	gameType = data.gameType || 'crown';
	console.log('🎮 Mode de jeu:', gameType);
	console.log('👥 Nombre total de joueurs:', data.totalPlayers);

	// Configurer l'environment map en fonction du gameType
	if (gameType === 'crown') {
		scene.background = environmentMap2;
		scene.environment = environmentMap2;
		currentGame = new CrownGame(scene, player, new Crown(-80, 95, 0), socket);
	} else {
		scene.background = environmentMap;
		scene.environment = environmentMap;
		currentGame = new SurviveGame(scene, player, remotePlayers, movingPlatformsFromBack, socket, data.totalPlayers);
	}

	// Mettre à jour le nombre total de joueurs si on reçoit une mise à jour
	socket.on('playersCountUpdate', (updateData) => {
		if (currentGame && currentGame.updateTotalPlayers) {
			currentGame.updateTotalPlayers(updateData.totalPlayers);
			console.log('👥 Mise à jour du nombre de joueurs:', updateData.totalPlayers);
		}
	});

	if (data.platforms) {
		createPlatforms(data.platforms);
		platformsCreated = true;
	}

	if (data.checkpoints && gameType == 'crown')
	{
		createCheckpoints(data.checkpoints);
		checkpointsCreated = true;
		//Modifier le checkPoint initial du joueur pour tester
		// if (checkpointsFromBack.length > 0) {
		// 	player.checkPoint = checkpointsFromBack[4].mesh.position.clone();
		// }
	}


	socket.emit('gameLoaded');
});

const clock = new THREE.Clock(false);
let gameStartTimeStamp = null;
socket.on('startClock', (timestamp) =>
{
	gameStartTimeStamp = timestamp;
	console.log('🚀 Tous les joueurs prêts, démarrage à timestamp:', gameStartTimeStamp);
	clock.start();
	tick();
});

const tick = () => {
	if (!clockStarted) {
		window.requestAnimationFrame(tick);
		return;
	}

	const deltaTime = clock.getDelta();

	const currentServerTime = Date.now() + timeOffset;
	const elapsedTime = (currentServerTime - gameStartTimeStamp) / 1000;
	for (let i = 0; i < movingPlatformsFromBack.length; i++) {
		movingPlatformsFromBack[i].update(elapsedTime);
	}
	// Mettre à jour tous les joueurs distants (interpolation + animation)
	Object.values(remotePlayers).forEach(remotePlayer => {
		remotePlayer.update(deltaTime);
	});

	player.update(deltaTime, keys, platformsFromBack);
	for (let i = 0; i < checkpointsFromBack.length; i++) {
		if (checkpointsFromBack[i].getBox().intersectsBox(player.getBox())) {
			player.checkPoint = checkpointsFromBack[i].mesh.position.clone();
			player.checkPointId = i + 1;
			checkpointsFromBack[i].active = true;
		}
		checkpointsFromBack[i].update(elapsedTime);
	}
	updatePlayerLabels(player, remotePlayers, sizes);
	currentGame.tick(elapsedTime);
	renderer.render(scene, player.camera)
	window.requestAnimationFrame(tick)
}
