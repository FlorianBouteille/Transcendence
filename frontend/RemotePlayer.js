import * as THREE from 'three'
import { Player } from './Player.js'

export class RemotePlayer extends Player {
    constructor(scene, position, color) {
        super(scene, position, color)
        
        this.lastDirection = new THREE.Vector3(0, 0, 0);
    }

    setPosition(x, y, z, rotation) {
        const direction = new THREE.Vector3();
        direction.set(x - this.mesh.position.x, y - this.mesh.position.y, z - this.mesh.position.z);
        
        if (direction.length() > 0.01) {
            this.lastDirection = direction.normalize();
            
            // Calculer et appliquer la rotation en fonction de la direction
            const angle = Math.atan2(direction.x, direction.z) - Math.PI/2;
            this.mesh.rotation.y = angle;
        }
        
        // Mettre à jour la position
        this.mesh.position.set(x, y, z);
    }

    update(deltaTime) 
    {
        // Utiliser isGrounded et isJumping pour déterminer l'animation
        if (this.isJumping) {
            // Animation de saut
            this.updateAnimation(this.lastDirection, deltaTime);
        } else if (!this.isGrounded) {
            // Animation de chute
            this.updateAnimation(this.lastDirection, deltaTime);
        } else if (this.lastDirection && this.lastDirection.length() > 0) {
            // Animation de marche/course
            this.updateAnimation(this.lastDirection, deltaTime);
        } else {
            // Animation idle
            this.updateAnimation(new THREE.Vector3(0, 0, 0), deltaTime);
        }
    }
}