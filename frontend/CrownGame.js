import * as THREE from 'three'

export class CrownGame
{
    constructor(scene, player, crown, socket)
    {
        this.crown = crown;
        this.socket = socket;
        this.player = player;
        scene.add(crown.mesh);
        socket.on('gameEnd', (data) =>
        {
            this.showVictoryScreen(data);
        });
    }
    
    tick(elapsedTime)
    {
        this.crown.update(elapsedTime);
        if (this.crown.getBox().intersectsBox(this.player.getBox()))
            this.socket.emit("first", { playerData: this.player.data, elapsedTime: elapsedTime });
        if (this.player.alive == false)
        {
            this.player.respawn();
            this.player.alive = true;
        }
    }
    showVictoryScreen(data)
    {
        window.location.href = `gameRecap.html?winner=${data.winner}&time=${data.elapsedTime}`;
    }
}