import * as THREE from 'three'
import { Platform } from './Platform.js'

export class LinearPlatform extends Platform {
    constructor(scene, positionA, positionB, sizeX, sizeY, sizeZ, travelTime, delay = 0, pauseTime = 0, finalStayTime = 0, material) {
        super(scene, positionA, sizeX, sizeY, sizeZ, material)
        
        this.positionA = positionA.clone()
        this.positionB = positionB.clone()
        this.travelTime = travelTime
        this.delay = delay
        this.pauseTime = pauseTime
        this.finalStayTime = finalStayTime
        this.isActive = true;
        this.isStatic = false;
        
        // Calcule le cycle total
        this.cycleTime = travelTime + finalStayTime + pauseTime
        this.totalElapsedTime = 0 // Temps global accumulé
        this.speedMultiplier = 1.0 // Multiplicateur de vitesse externe
        this.activeSpeedMultiplier = 1.0 // Multiplicateur appliqué au début du cycle
    }

    update(elapsedTime) 
    {
        this.previousPosition = this.mesh.position.clone()
        
        this.totalElapsedTime = elapsedTime
        
        // Calculer le travelTime effectif avec le multiplicateur de vitesse
        const effectiveTravelTime = this.travelTime / this.activeSpeedMultiplier
        const effectiveCycleTime = effectiveTravelTime + this.finalStayTime + this.pauseTime
        
        let timeInCycle = (this.totalElapsedTime - this.delay) % effectiveCycleTime
        
        if (this.totalElapsedTime < this.delay) {
            this.mesh.position.copy(this.positionA)
            this.mesh.visible = false
            // Mettre à jour le multiplicateur quand invisible
            this.activeSpeedMultiplier = this.speedMultiplier
        }
        else if (timeInCycle < effectiveTravelTime) {
            this.mesh.visible = true
            const progress = timeInCycle / effectiveTravelTime
            this.mesh.position.lerpVectors(this.positionA, this.positionB, progress)
        }
        else if (timeInCycle < effectiveTravelTime + this.finalStayTime) {
            this.mesh.visible = true
            this.mesh.position.copy(this.positionB)
        }
        else {
            this.mesh.visible = false
            this.mesh.position.copy(this.positionA)
            // Mettre à jour le multiplicateur quand invisible
            this.activeSpeedMultiplier = this.speedMultiplier
        }
        
        if (!this.mesh.visible)
            this.box.makeEmpty();
        else
            this.box.setFromObject(this.mesh)
    }

    copy() {
        const geom = this.mesh.geometry
        const clone = new LinearPlatform(
            this.mesh.parent,
            this.positionA.clone(),
            this.positionB.clone(),
            geom.parameters.width,
            geom.parameters.height,
            geom.parameters.depth,
            this.travelTime,
            this.delay,
            this.pauseTime,
            this.finalStayTime
        )
        return clone
    }
}
