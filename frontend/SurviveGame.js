import * as THREE from 'three'

export class SurviveGame
{
    constructor(scene, player, otherPlayers, socket)
    {
        this.socket = socket;
        this.player = player;
        this.hasDied = false;
        
        // Liste complète des joueurs vivants (incluant moi-même)
        this.alivePlayers = { ...otherPlayers };
        this.alivePlayers[socket.id] = player;
        
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
            }
        });
        
        socket.on('gameEnd', (data) =>
        {
            this.showVictoryScreen(data);
        });
    }
    
    tick(elapsedTime)
    {
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