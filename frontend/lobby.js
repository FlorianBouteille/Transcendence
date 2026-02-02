import { connectWS } from './src/network/socket.js';

const socket = connectWS();

const playersList = document.getElementById('players-list');
const readyBtn = document.getElementById('ready-btn');

// Variable pour savoir si le joueur a déjà cliqué sur Ready
let isReady = false;
let isHost = false;

// ============== NOTIFICATION SYSTEM ==============
function showNotification(message, type = 'error', duration = 3000) {
	const notification = document.getElementById('notification');
	const messageElement = document.getElementById('notification-message');

	// Reset classes
	notification.className = 'notification';

	// Set message and type
	messageElement.textContent = message;
	notification.classList.add(type); // 'error', 'success', 'warning'

	// Show notification
	setTimeout(() => {
		notification.classList.add('show');
	}, 10);

	// Hide after duration
	setTimeout(() => {
		notification.classList.remove('show');
	}, duration);
}


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

window.addEventListener('beforeunload', () => {
	socket.emit('leaveQueue');
});
socket.on('gameStarted', ({ roomId }) => {
	console.log('Game found! Room:', roomId);
	window.location.href = `game.html?room=${roomId}`;
});

//=========ROOM-PRIVATE=========
document.getElementById('private-btn').onclick = () => {
	document.getElementById('custom-room-code').value = ''; // Clear input
	showView('private-choice');
};
document.getElementById('room-code').addEventListener('click', () => {
	const roomCode = document.getElementById('room-code').textContent;

	if (roomCode && roomCode !== '------') {
		navigator.clipboard.writeText(roomCode).then(() => {
			showNotification(`Code ${roomCode} copied!`, 'success', 2000);
		}).catch(err => {
			console.error('Failed to copy:', err);
			showNotification('Failed to copy code', 'error');
		});
	}
});
document.getElementById('back-btn-1').onclick = () => {
	showView('main-menu');
};



//----------CREATE ROOM----------
document.getElementById('create-room-btn').onclick = () => {
	let roomCode = document.getElementById('custom-room-code').value.trim().toUpperCase();
	if (roomCode.length === 0)
		roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
	socket.emit('createPrivateRoom', { roomCode: roomCode });
	showView('room-view');
	document.getElementById('room-code').textContent = roomCode;
	console.log('Room created with code:', roomCode);
};


socket.on('roomInexistant', ({ roomCode }) => {
	showNotification(`Code ${roomCode} is not an existing room! Try another one.`, 'error');
	document.getElementById('room-code-input').value = '';
	showView('private-choice');
});

socket.on('roomCodeTaken', ({ roomCode }) => {
	showNotification(`Code ${roomCode} is already taken! Try another one.`, 'error');
	document.getElementById('custom-room-code').value = '';

	showView('private-choice');
});

document.getElementById('leave-room-btn').onclick = () => {
	document.getElementById('custom-room-code').value = '';
	socket.emit('leavePrivate');
	showView('private-choice');
};
// --------JOIN ROOM---------
document.getElementById('join-room-btn').onclick = () => {
	document.getElementById('room-code-input').value = '';
	showView('join-room-section');
};

socket.on('roomJoinedSuccess', (data) => {
	console.log('Rejoint la room:', data.roomCode);
	document.getElementById('room-code').textContent = data.roomCode;
	showView('room-view');
});

document.getElementById('confirm-join-btn').onclick = () => {
	const roomCode = document.getElementById('room-code-input').value.trim().toUpperCase();

	if (roomCode.length === 0) {
		showNotification('Please enter a room code!', 'warning');
		return;
	}

	socket.emit('joinPrivateRoom', { roomCode: roomCode });
	console.log('Attempting to join room:', roomCode);
};
document.getElementById('back-btn-2').onclick = () => {
	socket.emit('leavePrivate');
	showView('private-choice');
};

socket.on('gameCountdown', ({ seconds }) => {
	const countdownElement = document.getElementById('game-countdown');
	const secondsElement = document.getElementById('countdown-seconds');

	if (countdownElement && secondsElement) {
		countdownElement.classList.remove('hidden');
		secondsElement.textContent = seconds;
	}
});
//=========RANDOM=========
document.getElementById('random-btn').onclick = () => {
	showView('queue-view');
};
document.getElementById('cancel-queue-btn').onclick = () => {
	socket.emit('leaveQueue');
	showView('main-menu');
};

socket.on('queueUpdate', ({ count }) => {
	document.getElementById('queue-count').textContent = count;
});
socket.on('countdown', ({ seconds }) => {
	const countdownElement = document.getElementById('countdown-timer');
	if (countdownElement) {
		countdownElement.textContent = seconds;
	}
});

socket.on('connect', () => {
	console.log('Connecte au serveur, ID:', socket.id);
});
socket.on('lobbyUpdate', (data) => {
	const { players, count, allReady } = data;

	playersList.innerHTML = players.map(player => {
		const readyIcon = player.ready ? '✅' : '⏳';
		const hostIcon = player.isHost ? '👑 ' : '';
		return `
            <div class="player-item">
                <span>${hostIcon}${readyIcon} Player ${player.id.substring(0, 6)}</span>
            </div>
        `;
	}).join('');

	document.getElementById('player-count').textContent = count;

	const me = players.find(p => p.id === socket.id);
	const isHost = me ? me.isHost : false;
	const amReady = me ? me.ready : false;

	const readyBtn = document.getElementById('ready-btn');
	const startBtn = document.getElementById('start-game-btn');

	readyBtn.classList.remove('hidden');
	if (amReady) {
		readyBtn.textContent = 'UNREADY ❌';
		readyBtn.disabled = false;
	} else {
		readyBtn.textContent = 'READY';
		readyBtn.disabled = false;
	}

	if (allReady && players.length > 1) {
		startBtn.classList.remove('hidden');
		startBtn.dataset.isHost = isHost;
	} else {
		startBtn.classList.add('hidden');
	}
});

// ✅ Toggle ready state
readyBtn.addEventListener('click', () => {
	socket.emit('toggleReady');
});

document.getElementById('start-game-btn').addEventListener('click', (e) => {
	const isHost = e.target.dataset.isHost === 'true';

	if (!isHost) {
		showNotification('Only the host (👑) can start the game!', 'warning');
		return;
	}

	socket.emit('startGame');
});



document.getElementById('start-game-btn').addEventListener('click', (e) => {
	const isHost = e.target.dataset.isHost === 'true';

	if (!isHost) {
		showNotification('Only the host (👑) can start the game!', 'warning');
		return;
	}

	socket.emit('startGame');
});

socket.on('start', (msg) => {
	console.log('🎮 ready to start !');
	if (msg == 'ok') {
		console.log('✅ msg ok ! Redirection vers le jeu...');
		window.location.href = '/game.html';
	}
});

