import * as THREE from 'three'
import {randomColor } from './utils.js'

export class Platform {
    constructor(scene, position, sizeX, sizeY, sizeZ, theMaterial) {
        const geometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
        let material;
        if (theMaterial && theMaterial != undefined)
            material = theMaterial;
        else
            material = new THREE.MeshStandardMaterial({ color: randomColor() })
        if (!theMaterial)
        material.roughness = 0.7
        material.metalness = 0.4
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

