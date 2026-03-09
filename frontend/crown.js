import * as THREE from 'three'
import { randomColor } from './utils.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Cone by J-Toastie [CC-BY] via Poly Pizza

export class Crown
{
    constructor(posX, posY, posZ)
    {
        const loader = new GLTFLoader();
        this.geo = new THREE.BoxGeometry(2, 2, 2);
        this.material = new THREE.MeshBasicMaterial({ color : 0xffff66, visible: false})
        this.mesh = new THREE.Mesh(this.geo, this.material);
        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;
        this.box = new THREE.Box3();
        this.box.setFromObject(this.mesh); 
        loader.load('static/Cone.glb', (gltf) => 
        {
            this.visual = gltf.scene
            this.visual.scale.set(2.5, 2.5, 2.5) // à ajuster
            this.visual.rotateY(Math.PI / 2);
            this.visual.position.set(0, -1, 0) // recentrage par rapport à la box
            this.mesh.add(this.visual)
            // this.visual.traverse((child) => 
            // {
            //     if (child.isMesh) {
            //         child.material = new THREE.MeshStandardMaterial ({ color : randomColor() })
            //         this.material = child.material
            //     }
            // })
        })
        this.boxHelper = new THREE.Box3Helper(this.box, 0xff0000);
    }
   

    update(elapsedTime)
    {
        this.mesh.position.y += (Math.sin(elapsedTime)) / 12;
        this.box.setFromObject(this.mesh);
    }

    getBox()
    {
        return (this.box);
    }
}