import { Platform } from './Platform.js'

export class BouncyPlatform extends Platform {
    constructor(scene, position, sizeX, sizeY, sizeZ, bounceStrength, material, randColor = false) {
        super(scene, position, sizeX, sizeY, sizeZ, material, randColor)
        this.bounceStrength = bounceStrength
    }

    copy() {
        const geom = this.mesh.geometry
        const clone = new BouncyPlatform(
            this.mesh.parent,
            this.basePosition.clone(),
            geom.parameters.width,
            geom.parameters.height,
            geom.parameters.depth,
            this.bounceStrength
        )
        return clone
    }
}
