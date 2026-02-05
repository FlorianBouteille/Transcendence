// Stocker les références aux labels
export const playerLabels = {};

export function createPlayerLabel(time) {
    const label = document.createElement('div');
    label.className = 'crownUi';
    label.textContent = time;
    label.style.position = 'absolute';
    label.style.color = 'white';
    label.style.pointerEvents = 'none';
    label.style.fontSize = '14px';
    label.style.fontWeight = 'bold';
    label.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    label.style.transform = 'translate(-50%, -100%)';
    document.body.appendChild(label);
    playerLabels[playerId] = label;
}

export function updatePlayerLabels(player, remotePlayers, sizes) {
    // Label du joueur local
    if (playerLabels['local']) {
        updateLabelPosition(playerLabels['local'], player.mesh.position, player.camera, sizes);
    }
    
    // Labels des joueurs distants
    Object.entries(remotePlayers).forEach(([id, remotePlayer]) => {
        if (playerLabels[id]) {
            updateLabelPosition(playerLabels[id], remotePlayer.mesh.position, player.camera, sizes);
        }
    });
}
