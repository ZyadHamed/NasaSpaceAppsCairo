import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
 
var scene, camera, renderer, controls, draughts, board, circle, sphere, pointLight, pointLight2, pointLight3, pointLight4, helper, dirLight;
var angle = 30;
var Gamma = 0.80;
var IntensityMax = 255;

class Star extends THREE.Mesh
{

  radius = 1;
  pt1 = new THREE.PointLight( 0xff0000, 3);
  pt2 = new THREE.PointLight( 0xff0000, 3);
  pt3 = new THREE.PointLight( 0xff0000, 3);
  pt4 = new THREE.PointLight( 0xff0000, 3);
  constructor()
  {
    super();
    this.geometry = new THREE.SphereGeometry( 1, 32, 16 );
    this.material = new THREE.MeshBasicMaterial( { color: 0x6A4236 });

  }

  setTemperature(x)
  {
    this._temperature = x;
    
  }
}

/**
 * Taken from Earl F. Glynn's web page:
 * <a href="http://www.efg2.com/Lab/ScienceAndEngineering/Spectra.htm">Spectra Lab Report</a>
 */
function waveLengthToRGB(Wavelength) {
    var factor;
    var Red, Green, Blue;

    if((Wavelength >= 380) && (Wavelength < 440)) {
        Red = -(Wavelength - 440) / (440 - 380);
        Green = 0.0;
        Blue = 1.0;
    } else if((Wavelength >= 440) && (Wavelength < 490)) {
        Red = 0.0;
        Green = (Wavelength - 440) / (490 - 440);
        Blue = 1.0;
    } else if((Wavelength >= 490) && (Wavelength < 510)) {
        Red = 0.0;
        Green = 1.0;
        Blue = -(Wavelength - 510) / (510 - 490);
    } else if((Wavelength >= 510) && (Wavelength < 580)) {
        Red = (Wavelength - 510) / (580 - 510);
        Green = 1.0;
        Blue = 0.0;
    } else if((Wavelength >= 580) && (Wavelength < 645)) {
        Red = 1.0;
        Green = -(Wavelength - 645) / (645 - 580);
        Blue = 0.0;
    } else if((Wavelength >= 645) && (Wavelength < 781)) {
        Red = 1.0;
        Green = 0.0;
        Blue = 0.0;
    } else {
        Red = 0.0;
        Green = 0.0;
        Blue = 0.0;
    }

    // Let the intensity fall off near the vision limits

    if((Wavelength >= 380) && (Wavelength < 420)) {
        factor = 0.3 + 0.7 * (Wavelength - 380) / (420 - 380);
    } else if((Wavelength >= 420) && (Wavelength < 701)) {
        factor = 1.0;
    } else if((Wavelength >= 701) && (Wavelength < 781)) {
        factor = 0.3 + 0.7 * (780 - Wavelength) / (780 - 700);
    } else {
        factor = 0.0;
    }


    var rgb = [0, 0, 0];
    rgb[0] = Red == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Red * factor, Gamma));
    rgb[1] = Green == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Green * factor, Gamma));
    rgb[2] = Blue == 0.0 ? 0 : Math.round(IntensityMax * Math.pow(Blue * factor, Gamma));
    return "0x" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

function init() {
  draughts = new Draughts();
 
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
 
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
 
  const square = new THREE.BoxGeometry(1, 0.1, 1);
  const lightsquare = new THREE.MeshPhongMaterial({transparent:false, opacity:1});
  var sphereMaterial = new THREE.MeshPhongMaterial( { transparent:true, opacity:1} );
  const darksquare = new THREE.MeshBasicMaterial( { color: 0x6A4236 });

  const light = new THREE.AmbientLight( 0xd0d0d0, 0.1);
  scene.add( light );

 circle = new THREE.SphereGeometry( 1, 32, 16 );
 var sunMat = new THREE.MeshLambertMaterial({color: 0x00ff00});
 sphere = new THREE.Mesh(circle, sphereMaterial);
 sphere.position.set(5, 0, 5);
 //sphere.material.color.setHex(waveLengthToRGB(565));
 //alert(waveLengthToRGB(500));
 scene.add(sphere);

 pointLight = new THREE.PointLight( 0xff0000, 1);
 pointLight.color.setHex(waveLengthToRGB(740));
 pointLight.position.set( 0, 0, 0 );
 scene.add(pointLight);

 helper = new THREE.PointLightHelper(pointLight, 2);
 scene.add(helper);


  pointLight2 = new THREE.PointLight( 0xff0000, 1);
 pointLight2.position.set( 10, 0, 0 );
 pointLight2.color.setHex(waveLengthToRGB(650));
 scene.add(pointLight2);

 let helper2 = new THREE.PointLightHelper(pointLight2, 2);
 scene.add(helper2);

  pointLight3 = new THREE.PointLight( 0xff0000, 1);
 pointLight3.position.set( 10, 0, 10 );
 pointLight3.color.setHex(waveLengthToRGB(740));
 scene.add(pointLight3);

 let helper3 = new THREE.PointLightHelper(pointLight3, 2);
 scene.add(helper3);


  pointLight4 = new THREE.PointLight( 0xff0000, 1);
 pointLight4.position.set( 0, 0, 10 );
 pointLight4.color.setHex(waveLengthToRGB(650));
 scene.add(pointLight4);

 let helper4 = new THREE.PointLightHelper(pointLight4, 2);

 let star = new Star();
 star.position.set(0, 0, 0);
 scene.add(star);
 scene.add(helper4);
/*
 dirLight = new THREE.DirectionalLight(0xff0000, 1000);
 dirLight.position.set(10000, 0, 0);
 dirLight.target = sphere;
 scene.add(dirLight);

 let dirLight2 = new THREE.DirectionalLight(0xff0000, 10000000);
 dirLight2.position.set(0, 10000, 0);
 dirLight2.target = sphere;
 scene.add(dirLight2);

 let dirLight3 = new THREE.DirectionalLight(0xff0000, 10000000);
 dirLight3.position.set(0, 0, 10000);
 dirLight3.target = sphere;
 scene.add(dirLight3);

 let dirLight4 = new THREE.DirectionalLight(0xff0000, 10000000);
 dirLight4.position.set(-10000, 0, 0);
 dirLight4.target = sphere;
 scene.add(dirLight4);

 let dirLight5 = new THREE.DirectionalLight(0xff0000, 10000000);
 dirLight5.position.set(0, -10000, 0);
 dirLight5.target = sphere;
 scene.add(dirLight5);

 let dirLight6 = new THREE.DirectionalLight(0xff0000, 10000000);
 dirLight6.position.set(0, 0, -10000);
 dirLight6.target = sphere;
 scene.add(dirLight6);
 */
  camera.position.y = 1;
  camera.position.z = 3;
 
  controls = new OrbitControls(camera, renderer.domElement);
 
  controls.target.set(4.5, 0, 4.5);
 
  controls.enablePan = true;
  controls.maxPolarAngle = Math.PI / 2;
 
  controls.enableDamping = true;
 
  window.requestAnimationFrame(animate);
}
 
function animate() {
  controls.update();
  sphere.rotation.z += 0.01;
  if(angle > 150)
  {
    angle = 30;
  }
  angle += 0.0001;
  pointLight.intensity = Math.abs(3 * Math.sin(angle * (180 / Math.PI)));
  pointLight2.intensity = Math.abs(3 * Math.sin(angle * (180 / Math.PI)));
  pointLight3.intensity = Math.abs(3 * Math.sin(angle * (180 / Math.PI)));
  pointLight4.intensity = Math.abs(3 * Math.sin(angle * (180 / Math.PI)));
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
 
function onWindowResize() {
 
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
 
  renderer.setSize( window.innerWidth, window.innerHeight );
 
}
 
 
window.addEventListener('resize', onWindowResize);
 
window.onload = init;