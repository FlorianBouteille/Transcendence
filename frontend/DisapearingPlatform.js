import { Platform } from './Platform.js'

export class DisapearingPlatform extends Platform
{
    constructor(scene, position, sizeX, sizeY, sizeZ, duration, life, death, material)
    {
        super(scene, position, sizeX, sizeY, sizeZ, material)
        this.duration = duration
        this.aliveTime = life
        this.deadTime = death
        this.isActive = true
        this.cycleTime = life + duration + death
        
        // IMPORTANT : Cloner le material pour que chaque plateforme ait le sien
        this.mesh.material = this.mesh.material.clone()
        this.mesh.material.transparent = true
        this.mesh.material.opacity = 1
    }

    update(elapsedTime)
    {
        let timeInCycle = elapsedTime % this.cycleTime;
        
        if (timeInCycle < this.aliveTime)
        {
            // Phase "alive" : plateforme visible et solide
            this.mesh.visible = true;
            this.mesh.material.opacity = 1;
        }
        else if (timeInCycle < this.aliveTime + this.duration)
        {
            // Phase "disappearing" : en train de disparaître
            this.mesh.visible = true;
            const disappearProgress = (timeInCycle - this.aliveTime) / this.duration;
            this.mesh.material.opacity = 1 - disappearProgress;
        }
        else
        {
            // Phase "dead" : plateforme invisible
            this.mesh.visible = false;
            this.mesh.material.opacity = 0;
        }

        if (!this.mesh.visible)
            this.box.makeEmpty();
        else
            this.box.setFromObject(this.mesh)
    }
    
    copy() {
        const geom = this.mesh.geometry
        const clone = new DisapearingPlatform(
            this.mesh.parent,
            this.basePosition.clone(),
            geom.parameters.width,
            geom.parameters.height,
            geom.parameters.depth,
            this.duration,
            this.aliveTime,
            this.deadTime,
            this.mesh.material
        )
        return clone
    }
}