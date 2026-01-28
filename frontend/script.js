import * as THREE from 'three'
import GUI from 'lil-gui'
import { LocalPlayer } from './LocalPlayer.js'
import { RemotePlayer } from './AiPlayer.js'
import { Coin } from './coin.js'
import { Platform } from './Platform.js'
import { PeriodicPlatform } from './PeriodicPlatform.js'
import { LinearPlatform } from './LinearPlatform.js'
import { BouncyPlatform } from './BouncyPlatform.js'
import { checkPoint } from './CheckPoint.js'
import { randomColor } from './utils.js'
import { Vector2 } from 'three'
// import { rand } from 'three/tsl'
// import { Vector3 } from 'three/webgpu'
import { connectWS } from './src/network/socket.js'

const socket = connectWS();

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

const remotePlayers = {};  // Stocke les meshes des joueurs distants

socket.on('gameState', (state) => {
	state.players.forEach(playerData => {
		if (playerData.id === socket.id) return; //pour pas s afficher en remote
		if (!remotePlayers[playerData.id]) {
			const remotePlayer = new RemotePlayer(scene, canvas, playerData.color);
			remotePlayers[playerData.id] = remotePlayer;
			scene.add(remotePlayer.mesh);
		}

		const remotePlayer = remotePlayers[playerData.id];
		remotePlayer.mesh.position.x = playerData.x;
		remotePlayer.mesh.position.y = playerData.y;
		remotePlayer.mesh.position.z = playerData.z;
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

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
	console.log('loading started')
}
loadingManager.onLoad = () => {
	console.log('loading finished')
}
loadingManager.onProgress = () => {
	console.log('loading progressing')
}
loadingManager.onError = () => {
	console.log('loading error')
}

function placeMarker(posX, posZ, theColor) {
	const material = new THREE.MeshBasicMaterial({ color: theColor });
	const geo = new THREE.BoxGeometry(1, 2, 1);
	const mesh = new THREE.Mesh(geo, material);
	mesh.position.x = posX;
	mesh.position.z = posZ;
	scene.add(mesh);
}

const coins = new Array();
let movingPlatforms = new Array();

function stair_right(Platforms) {
	Platforms.push(new Platform(scene, new THREE.Vector3(8, 1.19, 8), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(13, 2.3, 11), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(18, 3.4, 13), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(24, 4.5, 13), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(29, 5.6, 11), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(34, 6.7, 8), 3, 0.5, 3));
}
function stair_left(Platforms) {
	Platforms.push(new Platform(scene, new THREE.Vector3(8, 1.2, -8), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(13, 2.3, -11), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(18, 3.4, -13), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(24, 4.5, -13), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(29, 5.6, -11), 3, 0.5, 3));
	Platforms.push(new Platform(scene, new THREE.Vector3(34, 6.7, -8), 3, 0.5, 3));
}

function middle_way(Platforms) {
	let leftElevator = new PeriodicPlatform(
		scene,
		new THREE.Vector3(8, 4, 0),
		3, 0.5, 3,
		new THREE.Vector3(0, 7, 0),
		new THREE.Vector3(0, 1, 0),
		new THREE.Vector3(0, 1, 0)
	)
	Platforms.push(leftElevator);
	movingPlatforms.push(leftElevator);
	let middleElevator = leftElevator.copy();
	middleElevator.basePosition.z -= 4;
	middleElevator.phase = new THREE.Vector3(0, 0, 0.5);
	Platforms.push(middleElevator);
	movingPlatforms.push(middleElevator);
	let rightElevator = leftElevator.copy();
	rightElevator.basePosition.z += 4;
	rightElevator.phase = new THREE.Vector3(0, 0.5, 0);
	Platforms.push(rightElevator);
	movingPlatforms.push(rightElevator);
	let leftSlider = new PeriodicPlatform(
		scene,
		new THREE.Vector3(20, 7, 0),
		3, 0.5, 3,
		new THREE.Vector3(9, 0, 0),
		new THREE.Vector3(1.5, 0, 0),
		new THREE.Vector3(1, 0, 1)
	)
	Platforms.push(leftSlider);
	movingPlatforms.push(leftSlider);
	let middleSlider = leftSlider.copy();
	middleSlider.basePosition.z -= 4;
	middleSlider.phase = new THREE.Vector3(1.5, 0, 0)
	Platforms.push(middleSlider);
	movingPlatforms.push(middleSlider);
	let rightSlider = leftSlider.copy();
	rightSlider.basePosition.z += 4;
	rightSlider.phase = new THREE.Vector3(2, 0, 0)
	Platforms.push(rightSlider);
	movingPlatforms.push(rightSlider);
}

function dodgeBlockLine(Platforms, posZ, amount, addDelay) {
	for (let i = 0; i < amount; i++) {
		let delay = Math.round(Math.random() * i * 4) + addDelay;
		let pauseTime = 0;
		let speed = Math.round(Math.random() * 3) + 6;
		let newPlat = new LinearPlatform(
			scene,
			new THREE.Vector3(110, 8, posZ),
			new THREE.Vector3(45, 8, posZ),
			1, 3, 1,
			speed,
			delay,
			pauseTime
		)
		Platforms.push(newPlat);
		movingPlatforms.push(newPlat);
	}
}
function dodgeBlocks(Platforms) {
	dodgeBlockLine(Platforms, -1.5, 4, 1);
	dodgeBlockLine(Platforms, 0, 4, 2);
	dodgeBlockLine(Platforms, 1.5, 4, 3);

}

function climbUp(platforms)
{
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(115, 8, 0), 3, 0.5, 3, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(119, 12.5, -0.7), 2.6, 0.5, 2.6, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(123, 17, 0.8), 2.3, 0.5, 2.3, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(121, 21.5, 3), 2, 0.5, 2, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(116, 26, 3.8), 1.8, 0.5, 1.8, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(108, 26, 5), 1.7, 0.5, 1.7, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(99, 26, 3.2), 1.6, 0.5, 1.6, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(91, 26, 5.5), 1.5, 0.5, 1.5, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(83, 26, 2.2), 1.4, 0.5, 1.4, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(75, 26, 6), 1.3, 0.5, 1.3, 12));
	platforms.push(new BouncyPlatform(scene, new THREE.Vector3(67, 26, 1.4), 1.2, 0.5, 1.2, 12));
	platforms.push(new Platform(scene, new THREE.Vector3(60, 30, 1.4), 8, 0.5, 8));
}

function copyAndMovePlatform(platform, moveX, moveY, moveZ)
{
	let newPlat = platform.copy();
	newPlat.basePosition.x += moveX;
	newPlat.basePosition.y += moveY;
	newPlat.basePosition.z += moveZ;
	return (newPlat);
	platforms.push(newPlat);
	movingPlatforms.push(newPlat);
}

function elevators(platforms)
{
	let elevator = new PeriodicPlatform(
		scene, 
		new THREE.Vector3(50, 30, 1.4),
		4, 0.5, 4,
		new THREE.Vector3(0, 6, 0),
		new THREE.Vector3(0, 2, 0),
		new THREE.Vector3(0, 2, 0)
	);
	platforms.push(elevator);
	movingPlatforms.push(elevator);
	let elevator2 = copyAndMovePlatform(elevator, -4, 6, 4);
	elevator2.phase.y += 2;
	platforms.push(elevator2);
	movingPlatforms.push(elevator2);
	let elevator2b = copyAndMovePlatform(elevator, -4, 6, -4);
	elevator2b.phase.y += 1;
	platforms.push(elevator2b);
	movingPlatforms.push(elevator2b);
	let elevator3 = copyAndMovePlatform(elevator2, -4, 7, -4);
	elevator3.phase.y += 2;
	platforms.push(elevator3);
	movingPlatforms.push(elevator3);
	let elevator4 = copyAndMovePlatform(elevator3, -6, 8, 4);
	elevator4.phase.y += 2;
	platforms.push(elevator4);
	movingPlatforms.push(elevator4);
	let elevator4b = copyAndMovePlatform(elevator3, -6, 8, -4);
	elevator4b.phase.y -= 2;
	platforms.push(elevator4b);
	movingPlatforms.push(elevator4b);
	let elevator5 = copyAndMovePlatform(elevator4, -4, 7, -4);
	elevator5.phase.y += 1;
	platforms.push(elevator5);
	movingPlatforms.push(elevator5);
}

function addPlatforms(scene) {
	let Platforms = new Array();
	Platforms.push(new Platform(scene, new THREE.Vector3(0, 0, 0), 10, 1, 10))
	stair_right(Platforms);
	stair_left(Platforms);
	middle_way(Platforms);
	Platforms.push(new Platform(scene, new THREE.Vector3(37, 6.5, 0), 10, 1, 10));
	let longPlatOne = new Platform(scene, new THREE.Vector3(78, 6.5, 0), 70, 1, 4.5);
	//longPlatOne.enableJump = false;
	Platforms.push(longPlatOne);
	dodgeBlocks(Platforms);
	climbUp(Platforms);
	elevators(Platforms);
	return (Platforms)
}

// Objects
const player = new LocalPlayer(scene, canvas, randomColor());
scene.add(player.mesh);
const grid = new THREE.GridHelper(50, 50);
scene.add(grid);

//CheckPoints

const checkPoint1 = new checkPoint(37, 7.5, 0);
scene.add(checkPoint1.mesh);
const checkPoint2 = new checkPoint(112, 8, 0);
scene.add(checkPoint2.mesh);
const checkPoint3 = new checkPoint(60, 30.5, 1.4);
scene.add(checkPoint3.mesh);
let checkPoints = new Array();
checkPoints.push(checkPoint1);
checkPoints.push(checkPoint2);
checkPoints.push(checkPoint3);

const platforms = addPlatforms(scene);
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
const light = new THREE.HemisphereLight(0xffffff, 0x00000, 10);
scene.add(light);
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
	socket.emit('playerInput', {
		key: event.code,
		pressed: (event.type === 'keydown'),
	});
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
const playerGui = gui.addFolder('Player');
const platformsGui = gui.addFolder('Plateformes')
for (let i = 0; i < platforms.length; i++) {
	const platformFolder = platformsGui.addFolder('Plateforme $(i)')
	{
		platformFolder.add(platforms[i].mesh.position, 'x', -200, 200, 1).name('posX');
		platformFolder.add(platforms[i].mesh.position, 'z', -200, 200, 1).name('posZ');
		platformFolder.add(platforms[i].mesh.scale, 'x', -200, 200, 1).name('sizeX');
		platformFolder.add(platforms[i].mesh.scale, 'z', -200, 200, 1).name('sizeZ');
	}
}

gui.add(light, 'intensity', 0, 130, 1).name('light intensity')
playerGui.add(player, 'speed', 2, 15, 0.5).name('Speed');
playerGui.add(player, 'jumpForce', 1, 20, 0.5).name('jump Force');
playerGui.add(player, 'gravity', 1, 20, 0.5).name('gravity');
gui.add(mouse, 'sensitivity', 0.1, 8, 0.1).name('mousePower');

// Animate
const clock = new THREE.Clock()

player.checkPoint = checkPoints[2].mesh.position.clone();
player.currentPlatform = platforms[0];
const tick = () => {
	const deltaTime = clock.getDelta()
	const elapsedTime = clock.getElapsedTime();

	for (let i = 0; i < movingPlatforms.length; i++) {
		movingPlatforms[i].update(elapsedTime);
	}
	player.update(deltaTime, keys, platforms);
	for (let i = 0; i < checkPoints.length; i++) {
		if (checkPoints[i].getBox().intersectsBox(player.getBox())) {
			player.checkPoint = checkPoints[i].mesh.position.clone();
		}
	}
	// Render
	renderer.render(scene, player.camera)
	window.requestAnimationFrame(tick)
}

tick()