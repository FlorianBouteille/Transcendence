import * as THREE from 'three'
//import GameMode from '../backend/src/gameModes/GameMode'

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

const cubeTextureLoader = new THREE.CubeTextureLoader();

export const environmentMap = cubeTextureLoader.load([
    'static/env_map/px.png',
    'static/env_map/nx.png',
    'static/env_map/py.png',
    'static/env_map/ny.png',
    'static/env_map/pz.png',
    'static/env_map/nz.png'
])

export const environmentMap2 = cubeTextureLoader.load([
    'static/env_map2/px.png',
    'static/env_map2/nx.png',
    'static/env_map2/py.png',
    'static/env_map2/ny.png',
    'static/env_map2/pz.png',
    'static/env_map2/nz.png'
])

const textureLoader = new THREE.TextureLoader(loadingManager)

// Charger toutes les textures blocks
const blockWhiteTexture = textureLoader.load('static/Blocks_001_COLOR_A.jpg')
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

// Charger les textures fabric padded
const fabricColorTexture = textureLoader.load('static/Fabric_Padded_006_basecolor.jpg')
const fabricNormalTexture = textureLoader.load('static/Fabric_Padded_006_normal.jpg')
const fabricAoTexture = textureLoader.load('static/Fabric_Padded_006_ambientOcclusion.jpg')
const fabricRoughnessTexture = textureLoader.load('static/Fabric_Padded_006_roughness.jpg')
const fabricHeightTexture = textureLoader.load('static/Fabric_Padded_006_height.png')

// Charger les textures rubber floor
const rubberColorTexture = textureLoader.load('static/Rubber_Floor_001_basecolor.jpg')
const rubberNormalTexture = textureLoader.load('static/Rubber_Floor_001_normal.jpg')
const rubberAoTexture = textureLoader.load('static/Rubber_Floor_001_ambientOcclusion.jpg')
const rubberRoughnessTexture = textureLoader.load('static/Rubber_Floor_001_roughness.jpg')
const rubberHeightTexture = textureLoader.load('static/Rubber_Floor_001_height.png')

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

// Configuration du wrapping et repeat pour les textures fabric
fabricColorTexture.wrapS = fabricColorTexture.wrapT = THREE.RepeatWrapping
fabricNormalTexture.wrapS = fabricNormalTexture.wrapT = THREE.RepeatWrapping
fabricAoTexture.wrapS = fabricAoTexture.wrapT = THREE.RepeatWrapping
fabricRoughnessTexture.wrapS = fabricRoughnessTexture.wrapT = THREE.RepeatWrapping
fabricHeightTexture.wrapS = fabricHeightTexture.wrapT = THREE.RepeatWrapping

// Configuration du wrapping et repeat pour les textures rubber
rubberColorTexture.wrapS = rubberColorTexture.wrapT = THREE.RepeatWrapping
rubberNormalTexture.wrapS = rubberNormalTexture.wrapT = THREE.RepeatWrapping
rubberAoTexture.wrapS = rubberAoTexture.wrapT = THREE.RepeatWrapping
rubberRoughnessTexture.wrapS = rubberRoughnessTexture.wrapT = THREE.RepeatWrapping
rubberHeightTexture.wrapS = rubberHeightTexture.wrapT = THREE.RepeatWrapping

// Créer les materials
const blockWhiteMaterial = new THREE.MeshStandardMaterial({
	map: blockWhiteTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1
})

const blockYellowMaterial = new THREE.MeshStandardMaterial({
	map: blockWhiteTexture.clone(),
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1,
	emissive: new THREE.Color(0x073573),
	emissiveIntensity: 1
})

const blockGreenMaterial = new THREE.MeshStandardMaterial({
	map: blockGreenTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1,
	// emissive: new THREE.Color(0x139BF1),
	// emissiveIntensity: 1
})

const blockBlueMaterial = new THREE.MeshStandardMaterial({
	map: blockBlueTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1,
	// emissive: new THREE.Color(0x11D8C5),
	// emissiveIntensity: 1
})

const blockRedMaterial = new THREE.MeshStandardMaterial({
	map: blockRedTexture,
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1,
	// emissive: new THREE.Color(0x11D8C5),
	// emissiveIntensity: 1
})

const blockOrangeMaterial = new THREE.MeshStandardMaterial({
	map: blockWhiteTexture.clone(),
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1,
	emissive: new THREE.Color(0xF7B506),
	emissiveIntensity: 1
})

const blockPinkMaterial = new THREE.MeshStandardMaterial({
	map: blockWhiteTexture.clone(),
	aoMap: blockAmbientTexture,
	aoMapIntensity: 1,
	normalMap: blockNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: blockRoughnessTexture,
	roughness: 0.7,
	metalness: 0.1,
	emissive: new THREE.Color(0xF27601),
	emissiveIntensity: 1
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

const scifiMetalMaterial2 = new THREE.MeshStandardMaterial({
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

const fabricPaddedMaterial = new THREE.MeshStandardMaterial({
	map: fabricColorTexture.clone(),
	aoMap: fabricAoTexture,
	aoMapIntensity: 1,
	normalMap: fabricNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: fabricRoughnessTexture,
	roughness: 0.8,
	metalness: 0.0
})

const fabricPaddedRedMaterial = new THREE.MeshStandardMaterial({
	map: fabricColorTexture.clone(),
	aoMap: fabricAoTexture,
	aoMapIntensity: 1,
	normalMap: fabricNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: fabricRoughnessTexture,
	roughness: 0.8,
	metalness: 0.0,
	color: new THREE.Color(0xff6666)
})

const fabricPaddedGreenMaterial = new THREE.MeshStandardMaterial({
	map: fabricColorTexture.clone(),
	aoMap: fabricAoTexture,
	aoMapIntensity: 1,
	normalMap: fabricNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: fabricRoughnessTexture,
	roughness: 0.8,
	metalness: 0.0,
	color: new THREE.Color(0x66ff66)
})

const fabricPaddedBlueMaterial = new THREE.MeshStandardMaterial({
	map: fabricColorTexture.clone(),
	aoMap: fabricAoTexture,
	aoMapIntensity: 1,
	normalMap: fabricNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: fabricRoughnessTexture,
	roughness: 0.8,
	metalness: 0.0,
	color: new THREE.Color(0x6666ff)
})

const normalRed = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0xff0000),
	roughness: 0.5, 
	metalness: 0.1
})

const normalBlue = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0x0000ff),
	roughness: 0.5, 
	metalness: 0.5
})

const normalGreen = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0x00ff00),
	roughness: 0.5, 
	metalness: 0.5
})

const normalYellow = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0x00ff00),
	roughness: 0.5, 
	metalness: 0.5
})

const normalWhite = new THREE.MeshStandardMaterial({
	color: new THREE.Color(0xffffff),
	roughness: 0.9, 
	metalness: 0.1
})

const fabricPaddedYellowMaterial = new THREE.MeshStandardMaterial({
	map: fabricColorTexture.clone(),
	aoMap: fabricAoTexture,
	aoMapIntensity: 1,
	normalMap: fabricNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: fabricRoughnessTexture,
	roughness: 0.8,
	metalness: 0.0,
	color: new THREE.Color(0xffff66)
})

const rubberFloorRedMaterial = new THREE.MeshStandardMaterial({
	map: rubberColorTexture.clone(),
	aoMap: rubberAoTexture,
	aoMapIntensity: 1,
	normalMap: rubberNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: rubberRoughnessTexture,
	roughness: 0.9,
	metalness: 0.0,
	color: new THREE.Color(0xff6666),
	emissive: new THREE.Color(0xff6666),
	emissiveIntensity: 0.2
})

const rubberFloorMaterial = new THREE.MeshStandardMaterial({
	map: rubberColorTexture.clone(),
	aoMap: rubberAoTexture,
	aoMapIntensity: 1,
	normalMap: rubberNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: rubberRoughnessTexture,
	roughness: 0.9,
	metalness: 0.2,
})
const rubberFloorGreenMaterial = new THREE.MeshStandardMaterial({
	map: rubberColorTexture.clone(),
	aoMap: rubberAoTexture,
	aoMapIntensity: 1,
	normalMap: rubberNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: rubberRoughnessTexture,
	roughness: 0.9,
	metalness: 0.0,
	color: new THREE.Color(0x66ff66),
	emissive: new THREE.Color(0x66ff66),
	emissiveIntensity: 0.3
})

const rubberFloorBlueMaterial = new THREE.MeshStandardMaterial({
	map: rubberColorTexture.clone(),
	aoMap: rubberAoTexture,
	aoMapIntensity: 1,
	normalMap: rubberNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: rubberRoughnessTexture,
	roughness: 0.9,
	metalness: 0.0,
	color: new THREE.Color(0x6666ff),
	emissive: new THREE.Color(0x6666ff),
	emissiveIntensity: 0.3
})
const longBlockBlueMaterial = blockBlueMaterial.clone();

// Cloner chaque texture pour avoir des instances indépendantes
longBlockBlueMaterial.map = blockBlueTexture.clone();
longBlockBlueMaterial.normalMap = blockNormalTexture.clone();
longBlockBlueMaterial.aoMap = blockAmbientTexture.clone();
longBlockBlueMaterial.roughnessMap = blockRoughnessTexture.clone();

// Configurer le wrapping pour les nouvelles textures
longBlockBlueMaterial.map.wrapS = longBlockBlueMaterial.map.wrapT = THREE.RepeatWrapping;
longBlockBlueMaterial.normalMap.wrapS = longBlockBlueMaterial.normalMap.wrapT = THREE.RepeatWrapping;
longBlockBlueMaterial.aoMap.wrapS = longBlockBlueMaterial.aoMap.wrapT = THREE.RepeatWrapping;
longBlockBlueMaterial.roughnessMap.wrapS = longBlockBlueMaterial.roughnessMap.wrapT = THREE.RepeatWrapping;

// Maintenant tu peux changer le repeat
function setRepeat(x, y)
{
	longBlockBlueMaterial.map.repeat.set(x, y);
	longBlockBlueMaterial.normalMap.repeat.set(x, y);
	longBlockBlueMaterial.aoMap.repeat.set(x, y);
	longBlockBlueMaterial.roughnessMap.repeat.set(x, y);
}
setRepeat(20, 1);



const rubberFloorYellowMaterial = new THREE.MeshStandardMaterial({
	map: rubberColorTexture.clone(),
	aoMap: rubberAoTexture,
	aoMapIntensity: 1,
	normalMap: rubberNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	roughnessMap: rubberRoughnessTexture,
	roughness: 0.9,
	metalness: 0.0,
	color: new THREE.Color(0xffff66),
	emissive: new THREE.Color(0xffff66),
	emissiveIntensity: 0.3
})

const TransparentMaterial = new THREE.MeshStandardMaterial({
	transparent: true,
	color: new THREE.Color(0xab12ef),
	opacity: 1
})

const InvisibleMaterial = new THREE.MeshStandardMaterial({
	transparent: true,
	color: new THREE.Color(0xab12ef),
	opacity: 0.01
})

setScifiTextureRepeat(1, 1);
setBlockTexturesRepeat(1, 1);
// Map de materials disponibles
export const materials = {
	normalred: normalRed,
	normalblue: normalBlue,
	normalgreen: normalGreen,
	normalyellow: normalYellow,
	normalwhite: normalWhite,
	blockgreen: blockGreenMaterial,
	blockred: blockRedMaterial,
	blockblue: blockBlueMaterial,
	longblockblue: longBlockBlueMaterial,
	blockyellow: blockYellowMaterial,
	blockorange: blockOrangeMaterial,
	blockpink: blockPinkMaterial,
	blockwhite: blockWhiteMaterial,
	scifimetal: scifiMetalMaterial,
	scifimetal2: scifiMetalMaterial2,
	fabricpadded: fabricPaddedMaterial,
	fabricpaddedred: fabricPaddedRedMaterial,
	fabricpaddedgreen: fabricPaddedGreenMaterial,
	fabricpaddedblue: fabricPaddedBlueMaterial,
	fabricpaddedyellow: fabricPaddedYellowMaterial,
	rubberfloor: rubberFloorMaterial,
	rubberfloorred: rubberFloorRedMaterial,
	rubberfloorgreen: rubberFloorGreenMaterial,
	rubberfloorblue: rubberFloorBlueMaterial,
	rubberflooryellow: rubberFloorYellowMaterial,
	transparent: TransparentMaterial,
	invisible: InvisibleMaterial
}


function setScifiTextureRepeat(x, y) {
	scifiColorTexture.repeat.set(x, y)
	scifiNormalTexture.repeat.set(x, y)
	scifiAoTexture.repeat.set(x, y)
	scifiRoughnessTexture.repeat.set(x, y)
	scifiMetallicTexture.repeat.set(x, y)
}

function setBlockTexturesRepeat(x, y) {
	blockRedTexture.repeat.set(x, y)
	blockWhiteTexture.repeat.set(x, y)
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

function setMaterialColorFilter(material, color, intensity = 0.2) {
	material.emissive.set(color)
	material.emissiveIntensity = intensity
}

// Exemples d'utilisation :
// setMaterialColorFilter(materials.scifimetal, 0x4444ff, 0.1) // léger filtre bleu (intensity entre 0 et 1)

export function getRandomBlockMaterial(materials)
{
    const rand = Math.random();
    if (rand < -1.33)
        return (materials.blockred);
    if (rand < -1.66)
        return (materials.blockgreen);
    else 
        return (materials.blockblue);
}