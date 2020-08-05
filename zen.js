var camera;
var canvas = document.querySelector('#c');
var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
});

renderer.setClearColor('white')

var controls;

var spheres = [];


function main() {
  const scene = new THREE.Scene();

  //var esferaMaterial = new THREE.MeshLambertMaterial()
  // esferaMaterial.emissive(new THREE.Color('0xff0000'));
  //var esfera = new THREE.SphereBufferGeometry( 10, 32, 16 );
  //for ( var i = 0; i < 1500; i ++ ) {

    //var esferaMesh = new THREE.Mesh( esfera, esferaMaterial );
    //esferaMesh.position.x = Math.random() * 2000;
   // esferaMesh.position.y = Math.random() * 2000;
    //esferaMesh.position.z = Math.random() * 2000;
    //esferaMesh.scale.x = esferaMesh.scale.y = esferaMesh.scale.z = Math.random() * 2;
    //scene.add( esferaMesh );

   // spheres.push( esferaMesh );

  //}

  renderer.autoClearColor = false;

  const fov = 75;
  const aspect = 2; // the canvas default
  const near = 0.1;
  const far = 800;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // camera.position.z = 5;
  // camera.position.y = 1;
  // camera.position.x = 3;


  const fogNear = 1;
  const fogFar = 800;
  const color = 0xed9000;
  scene.fog = new THREE.Fog(color, fogNear, fogFar);
  scene.background = new THREE.Color( color);


  // const controls = new THREE.OrbitControls(camera, canvas);
  // camera.position.set( 0, 0, 1 );
  // controls.update();

  //----------------------------------------------------------------------------------------
  // AudioSources
  //----------------------------------------------------------------------------------------
  var audioLoader = new THREE.AudioLoader();
  var listener = new THREE.AudioListener();
  camera.add( listener );

  var audioSource = new THREE.SphereBufferGeometry( 20, 32, 16 );
  var audioSourceMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, flatShading: true, shininess: 0 } );
  var mesh1 = new THREE.Mesh( audioSource, audioSourceMaterial );
  mesh1.position.set( 0, 150, 0 );
  scene.add( mesh1 );

  var sound1 = new THREE.PositionalAudio( listener );
  audioLoader.load( 'grotesque.mp3', function ( buffer ) {

    sound1.setBuffer( buffer );
    // sound1.setVolume(0.3);
    sound1.setRefDistance( 20 );
    sound1.play();

  } );
  mesh1.add( sound1 );




  //----------------------------------------------------------------------------------------
  //----------------------------------------------------------------------------------------

  controls = new THREE.FirstPersonControls( camera, renderer.domElement );
  camera.position.z = 600;
  camera.position.x = 500;
  camera.position.y = 150;
  controls.movementSpeed = 85;
  controls.lookSpeed = .045;
  controls.domElement = renderer.domElement;
  controls.autoForward = false;


  controls.dragToLook = false;

  {
    const color = 0xa23500;
    const intensity = 8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  //El (gltf) => { } es otra manera de escribir function(){}.
  var loader = new THREE.GLTFLoader();
  loader.load('EscenaFinal.gltf', (gltf) => {
    gltf.scene.scale.set(500, 500, 500) // scale here
    // gltf.scene.rotation.set( 0.8, 0, 0)
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
  console.log(camera.position.x, camera.position.y);

  renderer.setClearColor( 0xffffff );

  //FUNCIÓN DE ANIMACIÓN-------------------------------------------------------------------- /

  function render(time) {
    var delta = clock.getDelta();
    time *= 0.0001;
    controls.update(delta);

    // camera.position.z -= 0.5;

    console.log(camera.position.z);

    if(camera.position.z <= -1300){

      camera.position.z = 1800;
      camera.position.x = 0;
      camera.position.y = 5;
    }

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
