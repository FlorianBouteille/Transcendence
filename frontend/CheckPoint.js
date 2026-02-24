import * as THREE from 'three'
import { particleTextures } from './materials';
import { randomColor } from './utils.js';

export class CheckPoint
{
    constructor(posX, posY, posZ)
    {
        this.geo = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color : 0xffffff , visible: false})
        this.mesh = new THREE.Mesh(this.geo, this.material);
        this.particleGeo = new THREE.BufferGeometry();
        this.active = false;
        this.updateColor = false;
        this.count = 50;
        const positions = new Float32Array(this.count * 3);
        const colors = new Float32Array(this.count * 3);
        for (let i = 0; i < positions.length; i++)
        {
            positions[i] = (Math.random() - 0.5) * 2;
            if (i % 3 === 0)
                colors[i] = Math.random();
            else
                colors[i] = 0;
        }
        this.particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.startingPositions = this.particleGeo.attributes.position.array.slice();
        this.particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.particleMaterial = new THREE.PointsMaterial();
        this.particleMaterial.vertexColors = true;
        this.particleMaterial.size = 0.5;
        this.particleMaterial.depthWrite = false;
        this.particleMaterial.transparent = true;
        this.particleMaterial.sizeAttenuation = true;
        this.particleMaterial.alphaMap = particleTextures[9];
        this.particles = new THREE.Points(this.particleGeo, this.particleMaterial);
        this.particles.position.x = posX;
        this.particles.position.y = posY;
        this.particles.position.z = posZ;
        for (let i = 0; i < this.count; i++)
        {
            const i3 = i * 3;
            this.particleGeo.attributes.position.array[i3 + 1] += Math.random() * 2;
        }
        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh);
    }

    update(elapsedTime)
    {
        if (this.active == true && this.updateColor == false)
        {
            const newColors = new Float32Array(150);
            for (let i = 0; i < newColors.length; i++)
            {
                if (i % 3 == 1)
                    newColors[i] = Math.random();
                else
                    newColors[i] = 0;
            }
            this.particleGeo.setAttribute('color', new THREE.BufferAttribute(newColors, 3));
            this.updateColor = true;
        }
        for (let i = 0; i < this.count; i++)
        {
            const i3 = i * 3;
            this.particleGeo.attributes.position.array[i3 + 1] += 0.01;
            if (this.particleGeo.attributes.position.array[i3 + 1] > 2.5 )
                this.particleGeo.attributes.position.array[i3 + 1] = this.startingPositions[i3 + 1]; 
        }
        this.particleGeo.attributes.position.needsUpdate = true;
    }

    getBox()
    {
        return (this.box);
    }
}