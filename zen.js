//
//> Variables globales

var camera;
const canvas = document.querySelector('#c');
const scene = new THREE.Scene();
var clock = new THREE.Clock();

function zen() {

  // Renderer
  var renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });

  renderer.setClearColor('white')

  // Luz
  const lightColor = 0xFFFFFF;
  const intensity = 5;
  const light = new THREE.DirectionalLight(lightColor, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // Cámara
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 500;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 0);

  // Fog
  const fogNear = 1;
  const fogFar = 500;
  const fogColor = 'white';
  scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  scene.background = new THREE.Color('white');

  // Controles
  const firtPersoncontrols = new THREE.FirstPersonControls(camera, renderer.domElement);
  firtPersoncontrols.movementSpeed = 85;
  firtPersoncontrols.lookSpeed = .045;
  firtPersoncontrols.domElement = renderer.domElement;
  firtPersoncontrols.autoForward = false;
  firtPersoncontrols.dragToLook = false;

  // Orbes/Esferas flotantes
  var spheresArray = [];
  var sphereMaterial = new THREE.MeshLambertMaterial({
    flatShading: true,
  });
  var sphere = new THREE.SphereBufferGeometry(10, 32, 16);
  for (var i = 0; i < 1500; i++) {

    var sphereMesh = new THREE.Mesh(sphere, sphereMaterial);
    sphereMesh.position.x = Math.random() * 2000;
    sphereMesh.position.y = Math.random() * 2000;
    sphereMesh.position.z = Math.random() * 2000;
    sphereMesh.scale.x = sphereMesh.scale.y = sphereMesh.scale.z = Math.random() * 2;
    scene.add(sphereMesh);
    spheresArray.push(sphereMesh);
  }

  //
  //> AudioSources
  //

  var audioLoader = new THREE.AudioLoader();
  var listener = new THREE.AudioListener();
  camera.add(listener);

  var audioSource = new THREE.SphereBufferGeometry(20, 32, 16);
  var audioSourceMaterial = new THREE.MeshPhongMaterial({
    color: 0x01eaca,
    flatShading: true,
    shininess: 0
  });
  var mesh1 = new THREE.Mesh(audioSource, audioSourceMaterial);
  mesh1.position.set(100, 30, 0);
  scene.add(mesh1);

  var sound1 = new THREE.PositionalAudio(listener);
  audioLoader.load('audioAferra.mp3', function (buffer) {

    sound1.setBuffer(buffer);
    // sound1.setVolume(0.3);
    sound1.setRefDistance(20);
    sound1.play();

  });
  mesh1.add(sound1);

  var audioLoader2 = new THREE.AudioLoader();
  var listener2 = new THREE.AudioListener();
  camera.add(listener2);

  var audioSource2 = new THREE.SphereBufferGeometry(20, 32, 16);
  var audioSourceMaterial2 = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    flatShading: true,
    shininess: 0
  });
  var mesh2 = new THREE.Mesh(audioSource2, audioSourceMaterial2);
  mesh2.position.set(650, 60, 0);
  scene.add(mesh2);

  var sound2 = new THREE.PositionalAudio(listener2);
  audioLoader2.load('audioAqui.mp3', function (buffer) {

    sound2.setBuffer(buffer);
    // sound2.setVolume(0.3);
    sound2.setRefDistance(20);
    sound2.play();

  });
  mesh2.add(sound1);

  //El (gltf) => { } es otra manera de escribir function(){}.
  var gltfloader = new THREE.GLTFLoader();
  gltfloader.load('zen.gltf', (gltfGarden) => {
    gltfGarden.scene.scale.set(500, 500, 500) // scale here
    // gltfGarden.scene.rotation.set( 0.8, 0, 0)
    scene.add(gltfGarden.scene);
  });

  //
  //> Animación
  //

  function animate(time) {
    var delta = clock.getDelta();
    time *= 0.0001;
    firtPersoncontrols.update(delta);

    if (checkResponsiveSize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

function checkResponsiveSize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

//
//> "We write to taste life twice, in the moment and in retrospect.""
//

zen();

//
//> - Anais Nin
//
