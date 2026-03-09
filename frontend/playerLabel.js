// Stocker les références aux labels
export const playerLabels = {};

export function createPlayerLabel(playerId, name) {
    const label = document.createElement('div');
    label.className = 'player-label';
    label.textContent = name;
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

function updateLabelPosition(label, position3D, camera, sizes) {
    // Convertir position 3D → 2D écran
    const vector = position3D.clone();
    vector.y += 1; // Au-dessus de la tête
    vector.project(camera);
    
    // Si derrière la caméra, cacher
    if (vector.z > 1) {
        label.style.display = 'none';
        return;
    }
    
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
    
    label.style.display = 'block';
    label.style.left = x + 'px';
    label.style.top = y + 'px';
}