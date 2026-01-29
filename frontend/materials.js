import * as THREE from 'three'

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () => {
    console.log('loading started')
}
loadingManager.onLoad = () => {
    console.log('loading finished')
}
loadingManager.onProgress = () => {
    console.log('loading progressing')
}
loadingManager.onError = () => {
    console.log('loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// Charger toutes les textures blocks
const blockRedTexture = textureLoader.load('static/Blocks_001_COLOR_B.jpg')
const blockGreenTexture = textureLoader.load('static/Blocks_001_COLOR_C.jpg')
const blockBlueTexture = textureLoader.load('static/Blocks_001_COLOR_D.jpg')
const blockHeightTexture = textureLoader.load('static/Blocks_001_DISP.png')
const blockNormalTexture = textureLoader.load('static/Blocks_001_NORM.jpg')
const blockAmbientTexture = textureLoader.load('static/Blocks_001_OCC.jpg')
const blockRoughnessTexture = textureLoader.load('static/Blocks_001_ROUGH.jpg')

// Charger les textures sci-fi metal panel
const scifiColorTexture = textureLoader.load('static/Sci_fi_Metal_Panel_002_basecolor.jpg')
const scifiNormalTexture = textureLoader.load('static/Sci_fi_Metal_Panel_002_normal.jpg')
const scifiAoTexture = textureLoader.load('static/Sci_fi_Metal_Panel_002_ambientOcclusion.jpg')
const scifiRoughnessTexture = textureLoader.load('static/Sci_fi_Metal_Panel_002_roughness.jpg')
const scifiMetallicTexture = textureLoader.load('static/Sci_fi_Metal_Panel_002_metallic.jpg')

// Configuration du wrapping et repeat pour les textures blocks
blockRedTexture.wrapS = blockRedTexture.wrapT = THREE.RepeatWrapping
blockGreenTexture.wrapS = blockGreenTexture.wrapT = THREE.RepeatWrapping
blockBlueTexture.wrapS = blockBlueTexture.wrapT = THREE.RepeatWrapping
blockHeightTexture.wrapS = blockHeightTexture.wrapT = THREE.RepeatWrapping
blockNormalTexture.wrapS = blockNormalTexture.wrapT = THREE.RepeatWrapping
blockAmbientTexture.wrapS = blockAmbientTexture.wrapT = THREE.RepeatWrapping
blockRoughnessTexture.wrapS = blockRoughnessTexture.wrapT = THREE.RepeatWrapping

// Configuration du wrapping et repeat pour les textures sci-fi
scifiColorTexture.wrapS = scifiColorTexture.wrapT = THREE.RepeatWrapping
scifiNormalTexture.wrapS = scifiNormalTexture.wrapT = THREE.RepeatWrapping
scifiAoTexture.wrapS = scifiAoTexture.wrapT = THREE.RepeatWrapping
scifiRoughnessTexture.wrapS = scifiRoughnessTexture.wrapT = THREE.RepeatWrapping
scifiMetallicTexture.wrapS = scifiMetallicTexture.wrapT = THREE.RepeatWrapping

// Ajuster le repeat pour éviter l'étirement sur les grandes surfaces
scifiColorTexture.repeat.set(10, 2)
scifiNormalTexture.repeat.set(10, 2)
scifiAoTexture.repeat.set(10, 2)
scifiRoughnessTexture.repeat.set(10, 2)
scifiMetallicTexture.repeat.set(10, 2)

// Créer les materials
const blockRedMaterial = new THREE.MeshStandardMaterial({
	map: blockRedTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1
})

const blockGreenMaterial = new THREE.MeshStandardMaterial({
	map: blockGreenTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1
})

const blockBlueMaterial = new THREE.MeshStandardMaterial({
	map: blockBlueTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1
})

const scifiMetalMaterial = new THREE.MeshStandardMaterial({
	map: scifiColorTexture,
	aoMap: scifiAoTexture,
	aoMapIntensity: 1,
	normalMap: scifiNormalTexture,
	normalScale: new THREE.Vector2(2, 2),
	roughnessMap: scifiRoughnessTexture,
	metalnessMap: scifiMetallicTexture,
	metalness: 1,
	roughness: 0.2
})
setScifiTextureRepeat(15, 1);
setBlockTexturesRepeat(1, 1);
// Map de materials disponibles
export const materials = {
	blockred: blockRedMaterial,
	blockgreen: blockGreenMaterial,
	blockblue: blockBlueMaterial,
	scifimetal: scifiMetalMaterial
}
setMaterialColorFilter(materials.scifimetal, 0x0012ab, 0.4);

function setScifiTextureRepeat(x, y) {
	scifiColorTexture.repeat.set(x, y)
	scifiNormalTexture.repeat.set(x, y)
	scifiAoTexture.repeat.set(x, y)
	scifiRoughnessTexture.repeat.set(x, y)
	scifiMetallicTexture.repeat.set(x, y)
}

function setBlockTexturesRepeat(x, y) {
	blockRedTexture.repeat.set(x, y)
	blockGreenTexture.repeat.set(x, y)
	blockBlueTexture.repeat.set(x, y)
	blockHeightTexture.repeat.set(x, y)
	blockNormalTexture.repeat.set(x, y)
	blockAmbientTexture.repeat.set(x, y)
	blockRoughnessTexture.repeat.set(x, y)
}

function setMaterialColorTint(material, color) {
	material.color.set(color)
}

// Ajouter un léger filtre de couleur avec intensité contrôlable
function setMaterialColorFilter(material, color, intensity = 0.2) {
	material.emissive.set(color)
	material.emissiveIntensity = intensity
}

// Exemples d'utilisation :
// setMaterialColorTint(materials.scifimetal, 0x8888ff) // teinte bleue forte (écrase les couleurs)
// setMaterialColorFilter(materials.scifimetal, 0x4444ff, 0.1) // léger filtre bleu (intensity entre 0 et 1)
