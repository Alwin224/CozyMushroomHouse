
import * as THREE from 'three'
const scene = new THREE.Scene();

//canvas 
const canvas = document.querySelector('canvas.webgl')

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(window.innerWidth, window.innerHeight);
 