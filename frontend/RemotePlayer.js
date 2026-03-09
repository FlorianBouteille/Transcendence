import * as THREE from 'three'
import { Player } from './Player.js'

export class RemotePlayer extends Player {
    constructor(scene, position, color) {
        super(scene, position, color)
        
        this.lastDirection = new THREE.Vector3(0, 0, 0);
        this.name = 'nameFromDb';
    }

    setPosition(x, y, z, rotation, isMoving = true) {
        const direction = new THREE.Vector3();
        direction.set(x - this.mesh.position.x, y - this.mesh.position.y, z - this.mesh.position.z);
        
        // Stocker l'état de mouvement reçu du serveur
        this.isMoving = isMoving;
        
        // Ne mettre à jour lastDirection que si on a un mouvement significatif
        if (direction.length() > 0.01) {
            this.lastDirection = direction.normalize();
            const angle = Math.atan2(direction.x, direction.z) - Math.PI/2;
            this.mesh.rotation.y = angle;
        } else if (!isMoving) {
            // Si pas de mouvement ET pas d'input, on force l'idle
            this.lastDirection.set(0, 0, 0);
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
        } else if (this.isMoving && this.lastDirection && this.lastDirection.length() > 0) {
            // Animation de marche/course
            this.updateAnimation(this.lastDirection, deltaTime);
        } else {
            // Animation idle
            this.updateAnimation(new THREE.Vector3(0, 0, 0), deltaTime);
        }
    }
}