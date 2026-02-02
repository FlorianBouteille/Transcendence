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
import { checkPoint } from './CheckPoint.js'
import { randomColor } from './utils.js'
import { Vector2 } from 'three'
import { connectWS } from './src/network/socket.js'
import { materials, environmentMap } from './materials.js'

//importation des textures :
const socket = connectWS();
let platformsFromBack = [];
let movingPlatformsFromBack = [];
let platformsCreated = false

socket.on('connect', () => {
	console.log('✅ Connecté au serveur');
});

socket.on('connect_error', (error) => {
	console.error('❌ Erreur de connexion:', error);
});


const gui = new GUI({
	width: 300,
	title: "tweak shit here"
});

gui.hide();
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = environmentMap;
scene.environment = environmentMap;
//const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 5);
//scene.add(light);

const remotePlayers = {};  // Stocke les meshes des joueurs distants

function getMaterial(name)
{
	return materials[name];
}
function createPlatforms(platformsData) {
	platformsData.forEach(data => {
		let platform;
		if (data.type === 'static')
		{
			platform = new Platform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, materials[data.material]);
		}
		else if (data.type === 'periodic') {
			platform = new PeriodicPlatform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, new THREE.Vector3(data.amplitude.x, data.amplitude.y, data.amplitude.z), new THREE.Vector3(data.speed.x, data.speed.y, data.speed.z), new THREE.Vector3(data.phase.x, data.phase.y, data.phase.z), materials[data.material]);
			movingPlatformsFromBack.push(platform);
		}
		else if (data.type === 'linear') {
			platform = new LinearPlatform(scene, new THREE.Vector3(data.positionA.x, data.positionA.y, data.positionA.z), new THREE.Vector3(data.positionB.x, data.positionB.y, data.positionB.z), data.size.x, data.size.y, data.size.z, data.travelTime, data.delay, data.pauseTime, data.finalStayTime, materials[data.material]);
			movingPlatformsFromBack.push(platform);
		}
		else if (data.type === 'bouncy')
			platform = new BouncyPlatform(scene, new THREE.Vector3(data.position.x, data.position.y, data.position.z), data.size.x, data.size.y, data.size.z, data.strenght, materials[data.material]);
		if (platform) {
			//platform.mesh.material.color.setHex(data.color);
			platformsFromBack.push(platform);
			console.log('Platform type: ', data.type, 'push!');
		}
	});
}


socket.on('gameState', (state) => {
	if (state.platforms)
		console.log('Reçu gameState, platforms:', state.platforms?.length);  // ← Ajoute ça

	if (!platformsCreated && state.platforms) {
		createPlatforms(state.platforms);
		platformsCreated = true;
	}

	state.players.forEach(playerData => {
		if (playerData.id === socket.id) return; //pour pas s afficher en remote
		if (!remotePlayers[playerData.id]) {
			const remotePlayer = new RemotePlayer(scene, new THREE.Vector3(0, 2, 0), playerData.color);
			remotePlayers[playerData.id] = remotePlayer;
			scene.add(remotePlayer.mesh);
		}

		// Mettre à jour la position directement
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
window.addEventListener('mousemove', (event) => {
	let newX = (event.clientX / sizes.width) * 2 - 1
	let newY = - (event.clientY / sizes.height) * 2 + 1
	mouse.deltaX = mouse.x - newX;
	mouse.deltaY = mouse.y - newY;
	mouse.x = newX;
	mouse.y = newY;
})

window.addEventListener('keydown', (event) => {
	if (event.key == 'h')
		gui.show(gui._hidden);
})


// Objects
const player = new LocalPlayer(scene, canvas, randomColor());
scene.add(player.mesh);

setInterval(() => {
	socket.emit('playerPosition', {
		x: player.mesh.position.x,
		y: player.mesh.position.y,
		z: player.mesh.position.z,
		rotation: player.mesh.rotation.y,
		isGrounded: player.isGrounded,
		isJumping: player.isJumping,
		isMoving: player.isMoving
	});
}, 50)

const grid = new THREE.GridHelper(50, 50);
scene.add(grid);

//CheckPoints

const checkPoint1 = new checkPoint(37, 7.5, 0);
scene.add(checkPoint1.mesh);
const checkPoint2 = new checkPoint(112, 8, 0);
scene.add(checkPoint2.mesh);
const checkPoint3 = new checkPoint(60, 30.5, 1.4);
scene.add(checkPoint3.mesh);
const checkPoint4 = new checkPoint(25, 58, 0);
scene.add(checkPoint4.mesh);
const checkPoint5 = new checkPoint(-55, 69, 0);
scene.add(checkPoint5.mesh);
let checkPoints = new Array();
checkPoints.push(checkPoint1);
checkPoints.push(checkPoint2);
checkPoints.push(checkPoint3);
checkPoints.push(checkPoint4);
checkPoints.push(checkPoint5);

// const platforms = addPlatforms(scene);
const platforms = '';
// Sizes

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// GUI 
// const playerGui = gui.addFolder('Player');
const platformsGui = gui.addFolder('Plateformes')
console.log('nb de plateformes : ' + platformsFromBack.length);
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
		setTimeout(() => {}, i * 50);
	}
}


// Lancer la synchronisation au démarrage
syncClockWithServer();

// Animate

player.currentPlatform = platforms[0];
socket.emit('gameLoaded');

const clock = new THREE.Clock(false);
let gameStartTimeStamp = null;
let crown = new Crown(-83, 100, 0);
scene.add(crown.mesh);

player.checkPoint = checkPoints[4].mesh.position.clone();
socket.on('startClock', (timestamp) => 
{
	gameStartTimeStamp = timestamp;
	console.log('🚀 Tous les joueurs prêts, démarrage à timestamp:', gameStartTimeStamp);
	clock.start();
	tick();
});

const tick = () => {
	// Attendre que l'horloge soit synchronisée
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

	
	// Mettre à jour le joueur local
	
	// Mettre à jour tous les joueurs distants (interpolation + animation)
	Object.values(remotePlayers).forEach(remotePlayer => {
		remotePlayer.update(deltaTime);
	});
	
	player.update(deltaTime, keys, platformsFromBack);
	for (let i = 0; i < checkPoints.length; i++) {
		if (checkPoints[i].getBox().intersectsBox(player.getBox())) {
			player.checkPoint = checkPoints[i].mesh.position.clone();
		}
	}
	if (crown.getBox().intersectsBox(player.getBox()))
	{
		console.log('You won the game !');
	}
	renderer.render(scene, player.camera)
	window.requestAnimationFrame(tick)
}
