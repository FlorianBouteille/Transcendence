import { connectWS } from './src/network/socket.js';

const socket = connectWS();

const playersList = document.getElementById('players-list');
const readyBtn = document.getElementById('ready-btn');

// Variable pour savoir si le joueur a déjà cliqué sur Ready
let isReady = false;



function showView(viewId) {
	// Cache toutes les vues
	document.getElementById('main-menu').classList.add('hidden');
	document.getElementById('private-choice').classList.add('hidden');
	document.getElementById('join-room-section').classList.add('hidden');
	document.getElementById('room-view').classList.add('hidden');
	document.getElementById('queue-view').classList.add('hidden');

	// Affiche la vue demandée
	document.getElementById(viewId).classList.remove('hidden');
}

// Exemple d'utilisation


//=========GAME SOLO=========
document.getElementById('solo-btn').onclick = () => {
	socket.emit('solo');
};

socket.on('gameStarted', ({ roomId }) => {
	console.log('Game found! Room:', roomId);
	window.location.href = `game.html?room=${roomId}`;
});

//=========ROOM-PRIVATE=========
document.getElementById('private-btn').onclick = () => {
	showView('private-choice');
};
document.getElementById('back-btn-1').onclick = () => {
	showView('main-menu');
};


//----------CREATE ROOM----------
document.getElementById('create-room-btn').onclick = () => {
	showView('room-view');
};


// --------JOIN ROOM---------
document.getElementById('join-room-btn').onclick = () => {
	showView('join-room-section');
};
document.getElementById('confirm-join-btn').onclick = () => {
	//recuperer le code rentrer et faire un sorte de rejoindre le lobby de la personne
};
document.getElementById('back-btn-2').onclick = () => {
	showView('private-choice');
};


//=========RANDOM=========
document.getElementById('random-btn').onclick = () => { // =====>>>> RANDOM A FAIRe -> creer une seed, attendre que des joeurs la rejoignent OU si pas parti en court en rejoindre une
	socket.emit('joinRandom');
	showView('queue-view');
};
document.getElementById('cancel-queue-btn').onclick = () => {
	socket.emit('leaveQueue');
	showView('main-menu');
};


socket.on('queueUpdate', ({ count }) => {
	document.getElementById('queue-count').textContent = count;
});



socket.on('connect', () => {
	console.log('Connecte au serveur, ID:', socket.id);
});

socket.on('lobbyUpdate', (data) => {
	const { players } = data;

	playersList.innerHTML = players.map(player => {
		return `
            <div class="player-item">
                <span>Player ${player.id.substring(0, 6)}</span>
            </div>
        `;
	}).join('');
});

// Écouter quand tous les joueurs sont prêts
socket.on('start', (msg) => {
	console.log('🎮 ready to start !');
	if (msg == 'ok') {
		console.log('✅ msg ok ! Redirection vers le jeu...');
		window.location.href = '/game.html';
	}
});

readyBtn.addEventListener('click', () => {
	if (!isReady) {
		isReady = true;

		socket.emit('playerReady');
		console.log('✅ Ready envoyé au serveur');
		readyBtn.disabled = true;
		readyBtn.textContent = 'WAITING FOR OTHERS...';
	}
});