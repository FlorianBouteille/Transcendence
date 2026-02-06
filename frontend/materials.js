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

// Charger les textures sci-fi wall
const scifiWallColorTexture = textureLoader.load('static/Sci-Fi_Wall_014_basecolor.jpg')
const scifiWallNormalTexture = textureLoader.load('static/Sci-Fi_Wall_014_normal.jpg')
const scifiWallAoTexture = textureLoader.load('static/Sci-Fi_Wall_014_ambientOcclusion.jpg')
const scifiWallRoughnessTexture = textureLoader.load('static/Sci-Fi_Wall_014_roughness.jpg')
const scifiWallMetallicTexture = textureLoader.load('static/Sci-Fi_Wall_014_metallic.jpg')
const scifiWallHeightTexture = textureLoader.load('static/Sci-Fi_Wall_014_height.png')

// Charger les textures sci-fi floor
const scifiFloorColorTexture = textureLoader.load('static/Sci-fi_Floor_002_basecolor.jpg')
const scifiFloorNormalTexture = textureLoader.load('static/Sci-fi_Floor_002_normal.jpg')
const scifiFloorAoTexture = textureLoader.load('static/Sci-fi_Floor_002_ambientOcclusion.jpg')
const scifiFloorMetallicTexture = textureLoader.load('static/Sci-fi_Floor_002_metallic.jpg')
const scifiFloorHeightTexture = textureLoader.load('static/Sci-fi_Floor_002_height.png')

// Charger les textures lava
const lavaColorTexture = textureLoader.load('static/Lava_001_COLOR.png')
const lavaNormalTexture = textureLoader.load('static/Lava_001_NRM.png')
const lavaAoTexture = textureLoader.load('static/Lava_001_OCC.png')
const lavaHeightTexture = textureLoader.load('static/Lava_001_DISP.png')
const lavaSpecTexture = textureLoader.load('static/Lava_001_SPEC.png')

// Charger les textures abstract organic
const organicColorTexture = textureLoader.load('static/Abstract_Organic_004_basecolor.jpg')
const organicNormalTexture = textureLoader.load('static/Abstract_Organic_004_normal.jpg')
const organicAoTexture = textureLoader.load('static/Abstract_Organic_004_ambientOcclusion.jpg')
const organicRoughnessTexture = textureLoader.load('static/Abstract_Organic_004_roughness.jpg')
const organicHeightTexture = textureLoader.load('static/Abstract_Organic_004_height.png')

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

// Configuration du wrapping et repeat pour les textures sci-fi wall
scifiWallColorTexture.wrapS = scifiWallColorTexture.wrapT = THREE.RepeatWrapping
scifiWallNormalTexture.wrapS = scifiWallNormalTexture.wrapT = THREE.RepeatWrapping
scifiWallAoTexture.wrapS = scifiWallAoTexture.wrapT = THREE.RepeatWrapping
scifiWallRoughnessTexture.wrapS = scifiWallRoughnessTexture.wrapT = THREE.RepeatWrapping
scifiWallMetallicTexture.wrapS = scifiWallMetallicTexture.wrapT = THREE.RepeatWrapping
scifiWallHeightTexture.wrapS = scifiWallHeightTexture.wrapT = THREE.RepeatWrapping

// Configuration du wrapping et repeat pour les textures sci-fi floor
scifiFloorColorTexture.wrapS = scifiFloorColorTexture.wrapT = THREE.RepeatWrapping
scifiFloorNormalTexture.wrapS = scifiFloorNormalTexture.wrapT = THREE.RepeatWrapping
scifiFloorAoTexture.wrapS = scifiFloorAoTexture.wrapT = THREE.RepeatWrapping
scifiFloorMetallicTexture.wrapS = scifiFloorMetallicTexture.wrapT = THREE.RepeatWrapping
scifiFloorHeightTexture.wrapS = scifiFloorHeightTexture.wrapT = THREE.RepeatWrapping

// Configuration des repeats pour un cube 3x0.5x3
scifiFloorColorTexture.repeat.set(3, 3)
scifiFloorNormalTexture.repeat.set(3, 3)
scifiFloorAoTexture.repeat.set(3, 3)
scifiFloorMetallicTexture.repeat.set(3, 3)
scifiFloorHeightTexture.repeat.set(3, 3)

// Configuration du wrapping pour les textures lava
lavaColorTexture.wrapS = lavaColorTexture.wrapT = THREE.RepeatWrapping
lavaNormalTexture.wrapS = lavaNormalTexture.wrapT = THREE.RepeatWrapping
lavaAoTexture.wrapS = lavaAoTexture.wrapT = THREE.RepeatWrapping
lavaHeightTexture.wrapS = lavaHeightTexture.wrapT = THREE.RepeatWrapping
lavaSpecTexture.wrapS = lavaSpecTexture.wrapT = THREE.RepeatWrapping

// Configuration du wrapping pour les textures organic
organicColorTexture.wrapS = organicColorTexture.wrapT = THREE.RepeatWrapping
organicNormalTexture.wrapS = organicNormalTexture.wrapT = THREE.RepeatWrapping
organicAoTexture.wrapS = organicAoTexture.wrapT = THREE.RepeatWrapping
organicRoughnessTexture.wrapS = organicRoughnessTexture.wrapT = THREE.RepeatWrapping
organicHeightTexture.wrapS = organicHeightTexture.wrapT = THREE.RepeatWrapping

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

// Material à 6 faces pour cube 10x1x10 avec continuité de texture
const scifiMetalMaterial = [
	// Right face (X+)
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Left face (X-)
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Top face (Y+)
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Bottom face (Y-)
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Front face (Z+)
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Back face (Z-)
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	})
];

// Configurer les repeats pour cube 10x1x10
// Top/Bottom faces (10x10): repeat 3.33,3.33
scifiMetalMaterial[2].map.repeat.set(3.33, 3.33);
scifiMetalMaterial[2].normalMap.repeat.set(3.33, 3.33);
scifiMetalMaterial[2].aoMap.repeat.set(3.33, 3.33);
scifiMetalMaterial[2].roughnessMap.repeat.set(3.33, 3.33);
scifiMetalMaterial[2].metalnessMap.repeat.set(3.33, 3.33);

scifiMetalMaterial[3].map.repeat.set(3.33, 3.33);
scifiMetalMaterial[3].normalMap.repeat.set(3.33, 3.33);
scifiMetalMaterial[3].aoMap.repeat.set(3.33, 3.33);
scifiMetalMaterial[3].roughnessMap.repeat.set(3.33, 3.33);
scifiMetalMaterial[3].metalnessMap.repeat.set(3.33, 3.33);

// Side faces (10x1): repeat 3.33,0.33
for (let i of [0, 1, 4, 5]) {
	scifiMetalMaterial[i].map.repeat.set(3.33, 0.33);
	scifiMetalMaterial[i].normalMap.repeat.set(3.33, 0.33);
	scifiMetalMaterial[i].aoMap.repeat.set(3.33, 0.33);
	scifiMetalMaterial[i].roughnessMap.repeat.set(3.33, 0.33);
	scifiMetalMaterial[i].metalnessMap.repeat.set(3.33, 0.33);
}

// Configuration wrapping pour toutes les textures clonées
scifiMetalMaterial.forEach(mat => {
	mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
	mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
	mat.aoMap.wrapS = mat.aoMap.wrapT = THREE.RepeatWrapping;
	mat.roughnessMap.wrapS = mat.roughnessMap.wrapT = THREE.RepeatWrapping;
	mat.metalnessMap.wrapS = mat.metalnessMap.wrapT = THREE.RepeatWrapping;
});

// Ajuster les offsets des textures pour aligner les faces
// (fonction helper définie plus bas dans le fichier)
function setFaceOffsetHelper(materialArray, faceIndex, offsetX, offsetY) {
	const mat = materialArray[faceIndex];
	if (mat.map) mat.map.offset.set(offsetX, offsetY);
	if (mat.normalMap) mat.normalMap.offset.set(offsetX, offsetY);
	if (mat.aoMap) mat.aoMap.offset.set(offsetX, offsetY);
	if (mat.roughnessMap) mat.roughnessMap.offset.set(offsetX, offsetY);
	if (mat.metalnessMap) mat.metalnessMap.offset.set(offsetX, offsetY);
}

// Appliquer les offsets par défaut pour scifiMetalMaterial
setFaceOffsetHelper(scifiMetalMaterial, 0, 0, 0.09); // back face
setFaceOffsetHelper(scifiMetalMaterial, 1, -0.33, 0.17); // back face
setFaceOffsetHelper(scifiMetalMaterial, 4, 0, 0.66); // back face
setFaceOffsetHelper(scifiMetalMaterial, 5, 0.17, 0.09); // back face

// Material à 6 faces pour plateforme longue 70x1x4.5 avec continuité de texture
const scifiMetalLongMaterial = [
	// Right face (X+) - 4.5x1
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Left face (X-) - 4.5x1
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Top face (Y+) - 70x4.5
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Bottom face (Y-) - 70x4.5
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Front face (Z+) - 70x1
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	}),
	// Back face (Z-) - 70x1
	new THREE.MeshStandardMaterial({
		map: scifiColorTexture.clone(),
		aoMap: scifiAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiRoughnessTexture.clone(),
		metalnessMap: scifiMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.2
	})
];

// Configurer les repeats pour plateforme 70x1x4.5
// Top/Bottom faces (70x4.5): repeat 23.33,1.5
scifiMetalLongMaterial[2].map.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[2].normalMap.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[2].aoMap.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[2].roughnessMap.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[2].metalnessMap.repeat.set(23.33, 1.5);

scifiMetalLongMaterial[3].map.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[3].normalMap.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[3].aoMap.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[3].roughnessMap.repeat.set(23.33, 1.5);
scifiMetalLongMaterial[3].metalnessMap.repeat.set(23.33, 1.5);

// Right/Left faces (4.5x1): repeat 1.5,0.33
scifiMetalLongMaterial[0].map.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[0].normalMap.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[0].aoMap.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[0].roughnessMap.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[0].metalnessMap.repeat.set(1.5, 0.33);

scifiMetalLongMaterial[1].map.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[1].normalMap.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[1].aoMap.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[1].roughnessMap.repeat.set(1.5, 0.33);
scifiMetalLongMaterial[1].metalnessMap.repeat.set(1.5, 0.33);

// Front/Back faces (70x1): repeat 23.33,0.33
scifiMetalLongMaterial[4].map.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[4].normalMap.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[4].aoMap.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[4].roughnessMap.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[4].metalnessMap.repeat.set(23.33, 0.33);

scifiMetalLongMaterial[5].map.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[5].normalMap.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[5].aoMap.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[5].roughnessMap.repeat.set(23.33, 0.33);
scifiMetalLongMaterial[5].metalnessMap.repeat.set(23.33, 0.33);

// Configuration wrapping pour toutes les textures clonées
scifiMetalLongMaterial.forEach(mat => {
	mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
	mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
	mat.aoMap.wrapS = mat.aoMap.wrapT = THREE.RepeatWrapping;
	mat.roughnessMap.wrapS = mat.roughnessMap.wrapT = THREE.RepeatWrapping;
	mat.metalnessMap.wrapS = mat.metalnessMap.wrapT = THREE.RepeatWrapping;
});

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

// Material à 6 faces pour cube 3x0.5x3 avec continuité de texture
const scifiWallMaterial = [
	// Right face (X+)
	new THREE.MeshStandardMaterial({
		map: scifiWallColorTexture.clone(),
		aoMap: scifiWallAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiWallNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiWallRoughnessTexture.clone(),
		metalnessMap: scifiWallMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.3
	}),
	// Left face (X-)
	new THREE.MeshStandardMaterial({
		map: scifiWallColorTexture.clone(),
		aoMap: scifiWallAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiWallNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiWallRoughnessTexture.clone(),
		metalnessMap: scifiWallMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.3
	}),
	// Top face (Y+)
	new THREE.MeshStandardMaterial({
		map: scifiWallColorTexture.clone(),
		aoMap: scifiWallAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiWallNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiWallRoughnessTexture.clone(),
		metalnessMap: scifiWallMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.3
	}),
	// Bottom face (Y-)
	new THREE.MeshStandardMaterial({
		map: scifiWallColorTexture.clone(),
		aoMap: scifiWallAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiWallNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiWallRoughnessTexture.clone(),
		metalnessMap: scifiWallMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.3
	}),
	// Front face (Z+)
	new THREE.MeshStandardMaterial({
		map: scifiWallColorTexture.clone(),
		aoMap: scifiWallAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiWallNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiWallRoughnessTexture.clone(),
		metalnessMap: scifiWallMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.3
	}),
	// Back face (Z-)
	new THREE.MeshStandardMaterial({
		map: scifiWallColorTexture.clone(),
		aoMap: scifiWallAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiWallNormalTexture.clone(),
		normalScale: new THREE.Vector2(2, 2),
		roughnessMap: scifiWallRoughnessTexture.clone(),
		metalnessMap: scifiWallMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.3
	})
];
setFaceOffsetHelper(scifiWallMaterial, 0, -0.11, -0.44); // back face
setFaceOffsetHelper(scifiWallMaterial, 1, -0.13, 0.04); // back face
setFaceOffsetHelper(scifiWallMaterial, 4, 0, 0.04); // back face
setFaceOffsetHelper(scifiWallMaterial, 5, 0, -0.16); // back face

// Configurer les repeats pour chaque face avec continuité
// Top/Bottom faces: repeat 1,1
scifiWallMaterial[2].map.repeat.set(1, 1);
scifiWallMaterial[2].normalMap.repeat.set(1, 1);
scifiWallMaterial[2].aoMap.repeat.set(1, 1);
scifiWallMaterial[2].roughnessMap.repeat.set(1, 1);
scifiWallMaterial[2].metalnessMap.repeat.set(1, 1);

scifiWallMaterial[3].map.repeat.set(1, 1);
scifiWallMaterial[3].normalMap.repeat.set(1, 1);
scifiWallMaterial[3].aoMap.repeat.set(1, 1);
scifiWallMaterial[3].roughnessMap.repeat.set(1, 1);
scifiWallMaterial[3].metalnessMap.repeat.set(1, 1);

// Side faces: repeat 1,0.166
for (let i of [0, 1, 4, 5]) {
	scifiWallMaterial[i].map.repeat.set(1, 0.166);
	scifiWallMaterial[i].normalMap.repeat.set(1, 0.166);
	scifiWallMaterial[i].aoMap.repeat.set(1, 0.166);
	scifiWallMaterial[i].roughnessMap.repeat.set(1, 0.166);
	scifiWallMaterial[i].metalnessMap.repeat.set(1, 0.166);
}

// Configuration wrapping pour toutes les textures clonées
scifiWallMaterial.forEach(mat => {
	mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
	mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
	mat.aoMap.wrapS = mat.aoMap.wrapT = THREE.RepeatWrapping;
	mat.roughnessMap.wrapS = mat.roughnessMap.wrapT = THREE.RepeatWrapping;
	mat.metalnessMap.wrapS = mat.metalnessMap.wrapT = THREE.RepeatWrapping;
});

const scifiFloorMaterial = new THREE.MeshStandardMaterial({
	map: scifiFloorColorTexture,
	aoMap: scifiFloorAoTexture,
	aoMapIntensity: 1,
	normalMap: scifiFloorNormalTexture,
	normalScale: new THREE.Vector2(1.5, 1.5),
	metalnessMap: scifiFloorMetallicTexture,
	metalness: 1,
	roughness: 0.4
})

// Material à 6 faces pour cube 3x0.5x3 avec continuité de texture
// Ordre des faces dans BoxGeometry: [right, left, top, bottom, front, back]
const scifiFloorCubeMaterials = [
	// Right face (X+) - 3x0.5
	new THREE.MeshStandardMaterial({
		map: scifiFloorColorTexture.clone(),
		aoMap: scifiFloorAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiFloorNormalTexture.clone(),
		normalScale: new THREE.Vector2(1.5, 1.5),
		metalnessMap: scifiFloorMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.4
	}),
	// Left face (X-) - 3x0.5
	new THREE.MeshStandardMaterial({
		map: scifiFloorColorTexture.clone(),
		aoMap: scifiFloorAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiFloorNormalTexture.clone(),
		normalScale: new THREE.Vector2(1.5, 1.5),
		metalnessMap: scifiFloorMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.4
	}),
	// Top face (Y+) - 3x3
	new THREE.MeshStandardMaterial({
		map: scifiFloorColorTexture.clone(),
		aoMap: scifiFloorAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiFloorNormalTexture.clone(),
		normalScale: new THREE.Vector2(1.5, 1.5),
		metalnessMap: scifiFloorMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.4
	}),
	// Bottom face (Y-) - 3x3
	new THREE.MeshStandardMaterial({
		map: scifiFloorColorTexture.clone(),
		aoMap: scifiFloorAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiFloorNormalTexture.clone(),
		normalScale: new THREE.Vector2(1.5, 1.5),
		metalnessMap: scifiFloorMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.4
	}),
	// Front face (Z+) - 3x0.5
	new THREE.MeshStandardMaterial({
		map: scifiFloorColorTexture.clone(),
		aoMap: scifiFloorAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiFloorNormalTexture.clone(),
		normalScale: new THREE.Vector2(1.5, 1.5),
		metalnessMap: scifiFloorMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.4
	}),
	// Back face (Z-) - 3x0.5
	new THREE.MeshStandardMaterial({
		map: scifiFloorColorTexture.clone(),
		aoMap: scifiFloorAoTexture.clone(),
		aoMapIntensity: 1,
		normalMap: scifiFloorNormalTexture.clone(),
		normalScale: new THREE.Vector2(1.5, 1.5),
		metalnessMap: scifiFloorMetallicTexture.clone(),
		metalness: 1,
		roughness: 0.4
	})
];
setFaceOffsetHelper(scifiFloorCubeMaterials, 0, 0, -0.16); // back face
setFaceOffsetHelper(scifiFloorCubeMaterials, 1, 0, -0.16); // back face
setFaceOffsetHelper(scifiFloorCubeMaterials, 4, 0, -0.04); // back face
setFaceOffsetHelper(scifiFloorCubeMaterials, 5, 0, -0.04); // back face

// Configurer les repeats pour chaque face avec continuité
// Top/Bottom faces (3x3): repeat 1,1 (divisé par 3 pour texture plus grosse)
scifiFloorCubeMaterials[2].map.repeat.set(1, 1);
scifiFloorCubeMaterials[2].normalMap.repeat.set(1, 1);
scifiFloorCubeMaterials[2].aoMap.repeat.set(1, 1);
scifiFloorCubeMaterials[2].metalnessMap.repeat.set(1, 1);

scifiFloorCubeMaterials[3].map.repeat.set(1, 1);
scifiFloorCubeMaterials[3].normalMap.repeat.set(1, 1);
scifiFloorCubeMaterials[3].aoMap.repeat.set(1, 1);
scifiFloorCubeMaterials[3].metalnessMap.repeat.set(1, 1);

// Side faces (3x0.5): repeat 1,0.166
for (let i of [0, 1, 4, 5]) {
	scifiFloorCubeMaterials[i].map.repeat.set(1, 0.166);
	scifiFloorCubeMaterials[i].normalMap.repeat.set(1, 0.166);
	scifiFloorCubeMaterials[i].aoMap.repeat.set(1, 0.166);
	scifiFloorCubeMaterials[i].metalnessMap.repeat.set(1, 0.166);
}

// Configuration wrapping pour toutes les textures clonées
scifiFloorCubeMaterials.forEach(mat => {
	mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
	mat.normalMap.wrapS = mat.normalMap.wrapT = THREE.RepeatWrapping;
	mat.aoMap.wrapS = mat.aoMap.wrapT = THREE.RepeatWrapping;
	mat.metalnessMap.wrapS = mat.metalnessMap.wrapT = THREE.RepeatWrapping;
});

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

const lavaMaterial = new THREE.MeshStandardMaterial({
	map: lavaColorTexture,
	aoMap: lavaAoTexture,
	aoMapIntensity: 1,
	normalMap: lavaNormalTexture,
	normalScale: new THREE.Vector2(1, 1),
	roughnessMap: lavaSpecTexture,
	roughness: 0.3,
	metalness: 0,
	emissive: new THREE.Color(0xff4400),
	emissiveMap: lavaColorTexture,
	emissiveIntensity: 0.5
})

const organicMaterial = new THREE.MeshStandardMaterial({
	map: organicColorTexture,
	aoMap: organicAoTexture,
	aoMapIntensity: 1,
	normalMap: organicNormalTexture,
	normalScale: new THREE.Vector2(1, 1),
	roughnessMap: organicRoughnessTexture,
	roughness: 0.8,
	metalness: 0
})


setScifiTextureRepeat(1, 1);
setBlockTexturesRepeat(1, 1);
setOrganicTextureRepeat(12, 12);
setLavaTextureRepeat(12, 12);
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
	scifimetallong: scifiMetalLongMaterial,
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
	scifiwall: scifiWallMaterial,
	scififloor: scifiFloorMaterial,
	scifloorcube: scifiFloorCubeMaterials,
	lava: lavaMaterial,
	organic: organicMaterial,
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

export function setLavaTextureRepeat(x, y) {
	lavaColorTexture.repeat.set(x, y)
	lavaNormalTexture.repeat.set(x, y)
	lavaAoTexture.repeat.set(x, y)
	lavaHeightTexture.repeat.set(x, y)
	lavaSpecTexture.repeat.set(x, y)
}

export function setOrganicTextureRepeat(x, y) {
	organicColorTexture.repeat.set(x, y)
	organicNormalTexture.repeat.set(x, y)
	organicAoTexture.repeat.set(x, y)
	organicRoughnessTexture.repeat.set(x, y)
	organicHeightTexture.repeat.set(x, y)
}

function setMaterialColorTint(material, color) {
	material.color.set(color)
}

function setMaterialColorFilter(material, color, intensity = 0.2) {
	material.emissive.set(color)
	material.emissiveIntensity = intensity
}

/**
 * Ajuste l'offset des textures pour une face spécifique d'un material à 6 faces
 * @param {Array} materialArray - Array de 6 materials (scifimetal, scifiwall, etc.)
 * @param {number} faceIndex - Index de la face (0=right, 1=left, 2=top, 3=bottom, 4=front, 5=back)
 * @param {number} offsetX - Décalage horizontal (0 à 1)
 * @param {number} offsetY - Décalage vertical (0 à 1)
 */
export function setFaceTextureOffset(materialArray, faceIndex, offsetX, offsetY) {
	if (!Array.isArray(materialArray) || faceIndex < 0 || faceIndex > 5) {
		console.error('Invalid parameters for setFaceTextureOffset');
		return;
	}
	
	const mat = materialArray[faceIndex];
	if (mat.map) mat.map.offset.set(offsetX, offsetY);
	if (mat.normalMap) mat.normalMap.offset.set(offsetX, offsetY);
	if (mat.aoMap) mat.aoMap.offset.set(offsetX, offsetY);
	if (mat.roughnessMap) mat.roughnessMap.offset.set(offsetX, offsetY);
	if (mat.metalnessMap) mat.metalnessMap.offset.set(offsetX, offsetY);
}

/**
 * Ajuste l'offset de toutes les faces d'un material à 6 faces
 * @param {Array} materialArray - Array de 6 materials
 * @param {Object} offsets - Objet avec les offsets pour chaque face
 * Exemple: { right: {x: 0, y: 0}, left: {x: 0, y: 0}, top: {x: 0, y: 0}, ... }
 */
export function setAllFacesTextureOffset(materialArray, offsets) {
	console.log('calling function');
	const faceNames = ['right', 'left', 'top', 'bottom', 'front', 'back'];
	
	faceNames.forEach((faceName, index) => {
		if (offsets[faceName]) {
			setFaceTextureOffset(
				materialArray, 
				index, 
				offsets[faceName].x || 0, 
				offsets[faceName].y || 0
			);
		}
	});
}

/**
 * Ajuste l'offset des textures pour un material simple (non-array)
 * @param {Material} material - Material Three.js
 * @param {number} offsetX - Décalage horizontal (0 à 1)
 * @param {number} offsetY - Décalage vertical (0 à 1)
 */
export function setSingleMaterialTextureOffset(material, offsetX, offsetY) {
	if (material.map) material.map.offset.set(offsetX, offsetY);
	if (material.normalMap) material.normalMap.offset.set(offsetX, offsetY);
	if (material.aoMap) material.aoMap.offset.set(offsetX, offsetY);
	if (material.roughnessMap) material.roughnessMap.offset.set(offsetX, offsetY);
	if (material.metalnessMap) material.metalnessMap.offset.set(offsetX, offsetY);
}

// Exemples d'utilisation :
// setMaterialColorFilter(materials.scifimetal, 0x4444ff, 0.1) // léger filtre bleu (intensity entre 0 et 1)
// setFaceTextureOffset(materials.scifimetal, 2, 0.5, 0) // Décaler la face top (index 2) de 0.5 sur X
// setAllFacesTextureOffset(materials.scifiwall, { top: {x: 0.5, y: 0}, bottom: {x: 0.5, y: 0} })

export const particleTextures = [];

particleTextures[0] = textureLoader.load('static/particles/1.png');
particleTextures[1] = textureLoader.load('static/particles/2.png');
particleTextures[2] = textureLoader.load('static/particles/3.png');
particleTextures[3] = textureLoader.load('static/particles/4.png');
particleTextures[4] = textureLoader.load('static/particles/5.png');
particleTextures[5] = textureLoader.load('static/particles/6.png');
particleTextures[6] = textureLoader.load('static/particles/7.png');
particleTextures[7] = textureLoader.load('static/particles/8.png');
particleTextures[8] = textureLoader.load('static/particles/9.png');
particleTextures[9] = textureLoader.load('static/particles/10.png');
particleTextures[10] = textureLoader.load('static/particles/11.png');
particleTextures[11] = textureLoader.load('static/particles/12.png');
particleTextures[12] = textureLoader.load('static/particles/13.png');

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