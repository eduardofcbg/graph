/**
 * Created by eduardo on 07-06-2015.
 */

//get input from form action
RESOLUTION = parseInt(getParameterByName("r"));
MAX = parseInt(getParameterByName("max"));
MIN = parseInt(getParameterByName("min"));
SPEED = parseInt(getParameterByName("t"));
FUNC = "f(x, y, t) = " + getParameterByName("f");

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var pointResolution = 10*RESOLUTION;  //number of points per unit;

var clock = new THREE.Clock();
var scene = new THREE.Scene();

//creates camera and mouse controls for changing camera orientation
var camera = new THREE.PerspectiveCamera(10*RESOLUTION, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(1,40, 1);
camera.lookAt(scene.position);
var controls = new THREE.TrackballControls( camera );
controls.target.set( 0, 0, 0 );

//instanciates main object to be rendered
var renderer = new THREE.WebGLRenderer( {antialias: true} );
renderer.setSize( window.innerWidth, window.innerHeight-4);
renderer.setClearColor(0xdddddd);
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;

//adds canvas to the DOM
document.body.appendChild( renderer.domElement );
document.getElementsByTagName("canvas")[0].addEventListener("click", function() { toMove = false; });

//additional axis
var axis = new THREE.AxisHelper(MAX);
scene.add(axis);

//light for 3d
var light = new THREE.AmbientLight( 0x404040 );
var spotlight = new THREE.SpotLight(0xffffff);
spotlight.castShadow = true;
spotlight.position.set(15, 30, 30);
scene.add(spotlight);
scene.add( light );

//parse input
var parser = math.parser();
parser.eval(FUNC);
var f = parser.get('f');

//evaluate mathematical function for a set domain
function graph() {
    var particles = new THREE.Geometry();
    for(var x = MIN; x < MAX; x+=(1/pointResolution)) {
        for(var y = MIN; y < MAX; y+=(1/pointResolution)) {
            var vector = new THREE.Vector3(x, y, f(x, y, 0));
            particles.vertices.push(vector);
        }
    }
    return particles;
}

//get the graph and plot the points as particles
var cloud = new THREE.PointCloud( graph() );
scene.add(cloud);


//defines and angular movement for the camera
var rotSpeed = .002;
var toMove = true;
function moveCamera(){
    var x = camera.position.x;
    var y = camera.position.y;
    var z = camera.position.z;
    camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
    camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.lookAt(scene.position);
}

//main render function
var t = clock.getElapsedTime();
function render() {
    if (clock.getElapsedTime() - t > 0.001) {
        cloud.geometry.vertices.forEach(function(v) {
            v.setZ(f(v.x, v.y, t*SPEED));
        });
        t = clock.getElapsedTime();
        cloud.geometry.verticesNeedUpdate = true;
    }
    var delta = clock.getDelta();
    controls.update(delta);
    if (toMove) moveCamera();

    requestAnimationFrame( render );
    renderer.render( scene, camera );
}


render();