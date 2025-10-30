import * as THREE from 'three'

//scene
const scene = new THREE.Scene();

//canvas 
const canvas = document.querySelector('canvas.webgl')

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
