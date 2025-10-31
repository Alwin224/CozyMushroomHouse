import * as THREE from 'three';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//scene
const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');

//lights
const light = new THREE.PointLight(0xf5f5dc, 1);
light.position.set(1, 1.5, 0);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(1.99, 1.4, -1.88);
scene.add(camera);

//dracoloader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/static/');

//gltfloader
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
    '/static/CozyMushroomHouse.glb',
    (gltf) => {
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.set(0, 0, 0);
        scene.add(gltf.scene);
    },
    undefined,
    (error) => {
        console.error('An error happened:', error);
    }
);

//orbitcontrols
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//animate
const tick = () => {
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
    console.log(camera.position.x)
    console.log(camera.position.y)
    console.log(camera.position.z)
};

tick();