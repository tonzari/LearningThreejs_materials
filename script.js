import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { CubeTextureLoader } from 'three'

/**
 * DEBUG 
 */
const debugGUI = new dat.GUI()


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
//door
const albedoTexture = textureLoader.load('/textures/door/color.jpg')
const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const aoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
//matcap
const matcapClay = textureLoader.load('/textures/matcaps/1.png')
const matcapGrey = textureLoader.load('/textures/matcaps/2.png')
const matcapChrome = textureLoader.load('/textures/matcaps/3.png')
const matcapPeach = textureLoader.load('/textures/matcaps/4.png')
const matcapRim = textureLoader.load('/textures/matcaps/5.png')
const matcapCandle = textureLoader.load('/textures/matcaps/6.png')
const matcapGreen = textureLoader.load('/textures/matcaps/7.png')
const matcapRainbowRim = textureLoader.load('/textures/matcaps/8.png')

//environment map
const cubeTextureLoader = new CubeTextureLoader()

const envMapTexutre = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',
])

/*
Objects
*/
const dirLight = new THREE.DirectionalLight(0xebd0ae, 0.5)
scene.add(dirLight, dirLight.target)
dirLight.position.set(0,4,4)

const ambLight = new THREE.AmbientLight(0xebd0ae, 0.2)
scene.add(ambLight)

const matcapMat = new THREE.MeshMatcapMaterial(
    {
        matcap: matcapRainbowRim
    }
)

const standardMaterial = new THREE.MeshStandardMaterial(
    { 
        map: albedoTexture, 
        alphaMap: alphaTexture, 
        aoMap: aoTexture, 
        normalMap: normalTexture, 
        roughnessMap: roughnessTexture,
        metalnessMap: metalnessTexture,
        bumpMap: heightTexture,
        envMap: envMapTexutre
    })

debugGUI
    .add(standardMaterial, 'metalness')
    .min(0)
    .max(1)
    .step(0.0001)

debugGUI
    .add(standardMaterial, 'roughness')
    .min(0)
    .max(1)
    .step(0.0001)

standardMaterial.transparent = true // this is required for the alpha map to work

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    standardMaterial
)
sphere.position.x = -1.5

const sphereMatcap = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    matcapMat
)
sphereMatcap.position.set(-1.5, 1.5, 0)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,4),
    standardMaterial
)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
plane.position.x = 1.5

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.3,.2,16,32),
    standardMaterial
)

scene.add(plane, sphere, torus, sphereMatcap)
dirLight.target = plane


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const rotationSpeed = elapsedTime * 0.1

    // Update objects
    sphere.rotation.y = rotationSpeed
    torus.rotation.y = rotationSpeed

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()