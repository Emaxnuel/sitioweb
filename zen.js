var camera;
var canvas = document.querySelector('#c');
var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer({
  canvas
});

var controls;


function main() {

  renderer.autoClearColor = false;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 100;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 5;
  // camera.position.y = 1;
  // camera.position.x = 3;




  const scene = new THREE.Scene();
  const fogNear = 100;
  const fogFar = 1;
  const color = 'white';
  scene.fog = new THREE.Fog(color, fogNear, fogFar);
  scene.background = new THREE.Color(color);

  // const controls = new THREE.OrbitControls(camera, canvas);
  // camera.position.set( 0, 0, 1 );
  // controls.update();


  controls = new THREE.FlyControls(camera, renderer.domElement);

  controls.movementSpeed = 1000;
  controls.domElement = renderer.domElement;
  controls.autoForward = false;


  controls.dragToLook = false; {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  //El (gltf) => { } es otra manera de escribir function(){}.
  var loader = new THREE.GLTFLoader();
  loader.load('zen.gltf', (gltf) => {
    gltf.scene.scale.set(100, 100, 100) // scale here
    scene.add(gltf.scene);
  });

  const bgScene = new THREE.Scene();
  let bgMesh; {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      'neblina.jpg',
    );
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;

    const shader = THREE.ShaderLib.equirect;
    const material = new THREE.ShaderMaterial({
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
    });
    material.uniforms.tEquirect.value = texture;
    const plane = new THREE.BoxBufferGeometry(2, 2, 2);
    bgMesh = new THREE.Mesh(plane, material);
    bgScene.add(bgMesh);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  var skyGeo = new THREE.SphereGeometry(1000, 25, 25);
  var material = new THREE.MeshPhongMaterial({
    color: 'whitehite',
  });
  var sky = new THREE.Mesh(skyGeo, material);
  sky.material.side = THREE.BackSide;
  sky.position.set(0, 0, 0);
  scene.add(sky);


  // Cámara en primera persona (PointerLockControls)
  // var controls = new THREE.PointerLockControls(camera, document.body);
  // controls.movementSpeed = 1000;
  // controls.lookSpeed = 0.1;

  // scene.add(controls.getObject());
  // var onKeyDown = function (event) {

  //   switch (event.keyCode) {

  //     case 38: // up
  //     case 87: // w
  //       moveForward = true;
  //       break;

  //     case 37: // left
  //     case 65: // a
  //       moveLeft = true;
  //       break;

  //     case 40: // down
  //     case 83: // s
  //       moveBackward = true;
  //       break;

  //     case 39: // right
  //     case 68: // d
  //       moveRight = true;
  //       break;

  //     case 32: // space
  //       if (canJump === true) velocity.y += 350;
  //       canJump = false;
  //       break;

  //   }

  // };

  // var onKeyUp = function (event) {

  //   switch (event.keyCode) {

  //     case 38: // up
  //     case 87: // w
  //       moveForward = false;
  //       break;

  //     case 37: // left
  //     case 65: // a
  //       moveLeft = false;
  //       break;

  //     case 40: // down
  //     case 83: // s
  //       moveBackward = false;
  //       break;

  //     case 39: // right
  //     case 68: // d
  //       moveRight = false;
  //       break;

  //   }

  // };

  // document.addEventListener('keydown', onKeyDown, false);
  // document.addEventListener('keyup', onKeyUp, false);


  // Fin de bloque

  function render(time) {
    var delta = clock.getDelta();
    time *= 0.0001;
    controls.update(delta);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    bgMesh.position.copy(camera.position);
    renderer.render(bgScene, camera);
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
