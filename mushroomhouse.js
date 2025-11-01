import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';

const loadingScreen = document.getElementById('loadingScreen');
const enterbutton = document.getElementById('enterbutton');
const mainContent = document.getElementById('mainContent');

const audio = document.getElementById('bgAudio');
const toggleBtn = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

let isMuted = false; //start the audio as unmuted
audio.muted = false;

// SVG paths for icons
const icons = {
    muted: 'M12 3.5v17l-6-6H2v-5h4l6-6z', //svg icon for the speaker that is muted
    unmuted: 'M12 3.5v17l-6-6H2v-5h4l6-6zm7.5 8c0 2.21-1.79 4-4 4v-8c2.21 0 4 1.79 4 4z' //svg icon for the speaker that is unmuted so without waves
};

//the toggle button for the muted and unmuted buttons
toggleBtn.addEventListener('click', async () => {
    if (isMuted) {
        try { await audio.play(); } catch (err) { console.log(err); }
        audio.muted = false;
        audioIcon.setAttribute('d', icons.unmuted);
        isMuted = false;
    } else {
        audio.muted = true;
        audioIcon.setAttribute('d', icons.muted);
        isMuted = true;
    }
});

//scene
const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');

//lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xf5f5dc, 1);
dirLight.position.set(5, 5, 5);
dirLight.target.position.set(0, 2, 0);
scene.add(dirLight);
scene.add(dirLight.target);

const fillLight = new THREE.PointLight(0xffffff, 0.3);
fillLight.position.set(0, 2, 5);
scene.add(fillLight);

//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(1.99, 1.4, -1.88);
scene.add(camera);

//orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;

//renderer
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//loaders
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/static/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let modelLoaded = false;

//loading the gltf model from blender
gltfLoader.load(
    '/static/CozyMushroomHouse.glb',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.rotation.y = 3.9;
        model.position.y += 2; //adjusting the height of the model up

        //added a box to help with the frame of the zoom
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);

        const initialZ = Math.abs(maxDim / Math.sin(fov / 2)) * 1.5;
        const targetZ = initialZ * 0.3;

        //set the camera to look at the model and set the postion of the model as the target
        camera.position.set(center.x, center.y + 0.5, center.z + initialZ);
        camera.lookAt(center);
        controls.target.copy(center);
        controls.update();

        //used this to animate to the model itself when the start button is clicked
        gsap.to(camera.position, {
            duration: 3,
            x: center.x,
            y: center.y + 0.5,
            z: center.z + targetZ,
            ease: 'power2.inOut',
            onUpdate: () => {
                camera.lookAt(center);
                controls.target.copy(center);
            }
        });

        modelLoaded = true;//the model is loaded
    },
    undefined,
    (error) => console.error('An error happened:', error)
);

const clock = new THREE.Clock();

//tick function for rendering
const tick = () => {
    requestAnimationFrame(tick);
    controls.update();
    renderer.render(scene, camera);
};

//enter button event listener for the loading screen
enterbutton.addEventListener('click', async () => {
    if (!modelLoaded) return; //waits for the model to load

    loadingScreen.style.display = 'none';
    mainContent.style.display = 'block';

    //plays the music immediately
    try {
        await audio.play();
    } catch (e) {
        console.log("Autoplay blocked:", e);
    }

    //sets the icon to unmuted
    audioIcon.setAttribute('d', icons.unmuted);
    isMuted = false;

    tick();
});
