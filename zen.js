var camera;
var canvas = document.querySelector('#c');
var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
});

renderer.setClearColor('white')

var controls;


function main() {

  renderer.autoClearColor = false;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 400;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 5;
  // camera.position.y = 1;
  // camera.position.x = 3;




  const scene = new THREE.Scene();
  const fogNear = 1;
  const fogFar = 400;
  const color = 'white';
  scene.fog = new THREE.Fog(color, fogNear, fogFar);
  scene.background = new THREE.Color( 'white' );


  // const controls = new THREE.OrbitControls(camera, canvas);
  // camera.position.set( 0, 0, 1 );
  // controls.update();


  controls = new THREE.FlyControls(camera, renderer.domElement);

  controls.movementSpeed = 100;
  controls.domElement = renderer.domElement;
  controls.autoForward = false;


  controls.dragToLook = false;

  {
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


  renderer.setClearColor( 0xffffff );
  function render(time) {
    var delta = clock.getDelta();
    time *= 0.0001;
    controls.update(delta);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    // bgMesh.position.copy(camera.position);
    // renderer.render(bgScene, camera);
    renderer.render(scene, camera);


    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
