import * as THREE from 'three'
import {randomColor } from './utils.js'

export class Platform {
    constructor(scene, position, sizeX, sizeY, sizeZ, theMaterial, randColor = false) {
        const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
        let material;
        if (theMaterial && theMaterial != undefined) {
            // Cloner le material pour éviter de modifier l'original
            if (Array.isArray(theMaterial)) {
                // Si c'est un array de materials (6 faces), cloner chaque material
                material = theMaterial.map(mat => mat.clone());
            } else {
                // Si c'est un material unique
                material = theMaterial.clone();
            }
        } else 
        {
            material = new THREE.MeshStandardMaterial({ color: randomColor() })
        }
        
        // Appliquer une couleur random par-dessus la texture si demandé
        if (randColor) {
            if (Array.isArray(material)) {
                // Si c'est un array de materials (6 faces)
                const color = randomColor();
                material.forEach(mat => {
                    mat.color = new THREE.Color(color);
                });
            } else if (theMaterial) {
                // Si c'est un material unique avec texture
                material.color = new THREE.Color(randomColor());
            }
        }
        
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.copy(position)
        scene.add(this.mesh)
        this.box = new THREE.Box3().setFromObject(this.mesh)
        //decommenter pour voir la hitbox des plateformes
        // this.boxHelper =  new THREE.Box3Helper(this.box, 0xff0000);
        // scene.add(this.boxHelper);
        this.basePosition = this.mesh.position.clone()
        this.previousPosition = this.mesh.position.clone()
        this.isActive = true
        this.isStatic = true
        this.enableJump = true
        this.bounceStrength = 0
    }

    copy() 
    {
        const geom = this.mesh.geometry
        const clone = new Platform(
            this.mesh.parent,
            this.basePosition.clone(),
            geom.parameters.width,
            geom.parameters.height,
            geom.parameters.depth
        )
        return clone
    }


    getBox() {
        return this.box
    }
}

