import { connectWS }  from './src/network/socket.js';

const socket = connectWS();

const playersList = document.getElementById('players-list');
const readyBtn = document.getElementById('ready-btn');

// Variable pour savoir si le joueur a déjà cliqué sur Ready
let isReady = false;

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