import * as THREE from 'three'
import { LinearPlatform } from './LinearPlatform.js'

export class SurviveGame
{
    constructor(scene, player, otherPlayers, platforms, socket)
    {
        this.socket = socket;
        this.player = player;
        this.hasDied = false;
        this.platforms = platforms;
        
        // Liste complète des joueurs vivants (incluant moi-même)
        this.alivePlayers = { ...otherPlayers };
        this.alivePlayers[socket.id] = player;
        this.create_ui();
        
        socket.on('playerDied', (data) =>
        {
            // Retirer le joueur mort de la liste
            delete this.alivePlayers[data.playerId];
            
            console.log(`💀 ${data.playerId} est mort! Restants: ${Object.keys(this.alivePlayers).length}`);
            
            // Si c'est moi qui suis mort
            if (data.playerId === socket.id && !this.hasDied) 
            {
                this.hasDied = true;
                this.player.checkPoint = new THREE.Vector3(0, 12, 0);
                this.player.respawn();
                this.player.currentPlatform = platforms[platforms.length - 1];
            }
        });
        
        socket.on('gameEnd', (data) =>
        {
            //this.showVictoryScreen(data);
        });
    }
    
    create_ui()
    {
        this.uiContainer = document.createElement('div');
        this.uiContainer.className = 'survive-ui';
        document.body.appendChild(this.uiContainer);
        const timeContainer = document.createElement('h2');
        timeContainer.id = 'time';
        timeContainer.innerText = '0.0';
        this.uiContainer.appendChild(timeContainer);
    }

    updateUi(elapsedTime)
    {
        const timeContainer = document.getElementById('time');
        timeContainer.innerText = elapsedTime.toFixed(1);
    }

    tick(elapsedTime)
    {
        if (elapsedTime - Math.floor(elapsedTime) < 0.01)
        {
            console.log(elapsedTime);
        }
        if (this.player.alive === false && !this.hasDied)
        {
            delete this.alivePlayers[this.socket.id];
            
            console.log('Je suis mort! Joueurs restants:', Object.keys(this.alivePlayers));
            
            this.socket.emit('died', {
                playerData: this.player.data,
                alivePlayers: Object.keys(this.alivePlayers), // Envoyer juste les IDs
                elapsedTime: elapsedTime
            });
        }
        // Calculer le multiplicateur de vitesse (augmente avec le temps)
        const speedMultiplier = Math.min(1.0 + (Math.floor(elapsedTime / 15) * 0.1), 6.0);
        
        // Appliquer le multiplicateur à toutes les plateformes linéaires
        this.platforms.forEach(platform => {
            if (platform instanceof LinearPlatform)
            {
                platform.speedMultiplier = speedMultiplier;
            }
        });
        this.updateUi(elapsedTime);
    }
    
    showVictoryScreen(data)
    {
        console.log('🏆 Winner:', data.winner);
        console.log('⏱️  Time:', data.elapsedTime, 'seconds');
        console.log('showing screen');
        console.log(data);
        window.location.href = `gameRecap.html?winner=${data.winner}&time=${data.elapsedTime}`;
    }
}