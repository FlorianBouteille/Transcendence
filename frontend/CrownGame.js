import * as THREE from 'three'

export class CrownGame
{
    constructor(scene, player, crown, socket)
    {
        this.crown = crown;
        this.socket = socket;
        this.player = player;
        this.over = false;
        this.uiContainer;
        this.create_ui()
        scene.add(crown.mesh);
        //scene.add(crown.boxHelper);
        socket.on('gameEnd', (data) =>
        {
            this.showVictoryScreen(data);
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
        this.crown.update(elapsedTime);
        if (this.crown.getBox().intersectsBox(this.player.getBox()) && this.over == false)
        {
            this.over = true;
            this.socket.emit("first", { playerData: this.player.data, elapsedTime: elapsedTime });
        }
        if (this.player.alive == false)
        {
            this.player.respawn();
            this.player.alive = true;
        }
        this.updateUi(elapsedTime);
    }

    showVictoryScreen(data)
    {
        if (data.winner == this.socket.id)
            window.location.href = `gameRecap.html?id=${data.gameId}`;
        else
            window.location.href = `gameFailed.html?id=${data.gameId}`;
    }
}