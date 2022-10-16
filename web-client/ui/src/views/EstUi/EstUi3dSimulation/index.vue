<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // gltf加载器
import { onMounted, reactive } from 'vue';
let domThree: any = reactive({});
// ---------------------------------------------------------------------
// scene  camera
// ---------------------------------------------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.25,
  20
);
camera.position.set(2, 1, 7);
camera.lookAt(0, 0, 0);
// ---------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------
let gridHelper = new THREE.GridHelper(1200, 200, 0x888888, 0x444444);
gridHelper.position.y = -50;
gridHelper.name = 'Grid';
scene.add(gridHelper);
// ---------------------------------------------------------------------
// Axes
// ---------------------------------------------------------------------
let axes = new THREE.AxesHelper(1200);
axes.name = 'AxesHelper';
scene.add(axes);
var ambientLight = new THREE.AmbientLight('white');
ambientLight.position.set(100, 150, 135);
scene.add(ambientLight);
// ---------------------------------------------------------------------
// renderer
// ---------------------------------------------------------------------
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
domThree = renderer.domElement;
let controls = new OrbitControls(camera, domThree);

// ---------------------------------------------------------------------
// 添加gltf模型
// ---------------------------------------------------------------------
const loader = new GLTFLoader();
loader.load(
  new URL('./Synapticon-ASample.gltf', import.meta.url).href,
  function (gltf: any) {
    gltf.scene.traverse(function (child: any) {
      // if (child.isMesh) {
      // }
    });
    scene.add(gltf.scene);
  }
);
animate();
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
onMounted(() => {
  document.getElementById('threeDom')?.appendChild(domThree);
});
</script>

<template>
  <div id="threeDom"></div>
</template>

<style scoped></style>
