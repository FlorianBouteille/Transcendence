import * as THREE from 'three'

export class Crown
{
    constructor(posX, posY, posZ)
    {
        this.geo = new THREE.BoxGeometry(2, 2, 2);
        this.material = new THREE.MeshBasicMaterial({ color : 0xffff66, visible: true})
        this.mesh = new THREE.Mesh(this.geo, this.material);
        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
    }

    getBox()
    {
        return (this.box);
    }
}