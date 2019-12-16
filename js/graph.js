
function rotateCamera(camera, scene) {
    var rotSpeed = .002;
    var x = camera.position.x;
    var y = camera.position.y;
    var z = camera.position.z;
    camera.position.x = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
    camera.position.y = y * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
    camera.lookAt(scene.position);
}

function render(speed, f, grapher) {
    var {
        scene,
        clock,
        camera,
        renderer,
        cloud,
        controls,
        t,
        moveCamera
    } = grapher

    if (clock.getElapsedTime() - t > 0.001) {
        cloud.geometry.vertices.forEach(function(v) {
            v.setZ(f(v.x, v.y, t * speed));
        });
        grapher.t = clock.getElapsedTime();
        cloud.geometry.verticesNeedUpdate = true;
    }

    var delta = clock.getDelta();
    controls.update(delta);

    if (moveCamera) rotateCamera(camera, scene);

    requestAnimationFrame(function() {
        render(speed, f, grapher)
    });
    renderer.render(scene, camera);
}

function evalFunction(pointResolution, min, max, f) {
    var particles = new THREE.Geometry();
    for (var x = min; x < max; x += (1 / pointResolution)) {
        for (var y = min; y < max; y += (1 / pointResolution)) {
            var vector = new THREE.Vector3(x, y, f(x, y, 0));
            particles.vertices.push(vector);
        }
    }
    return particles;
}

function addToDom(renderer, cb) {
    document.body.appendChild(renderer.domElement);
    document.getElementsByTagName("canvas")[0].addEventListener("click", cb);
}

function graph(resolution, min, max, speed, f) {
    var scene = new THREE.Scene();
    var clock = new THREE.Clock();
    var t = clock.getElapsedTime()

    var camera = new THREE.PerspectiveCamera(10 * resolution, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(1, 40, 1);
    camera.lookAt(scene.position);

    var controls = new THREE.TrackballControls(camera);
    controls.target.set(0, 0, 0);

    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight - 4);
    renderer.setClearColor(0xdddddd);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    var axis = new THREE.AxisHelper(max);
    scene.add(axis);

    var light = new THREE.AmbientLight(0x404040);
    var spotlight = new THREE.SpotLight(0xffffff);
    spotlight.castShadow = true;
    spotlight.position.set(15, 30, 30);
    scene.add(spotlight);
    scene.add(light);

    var pointResolution = 10 * resolution;
    cloud = new THREE.PointCloud(evalFunction(pointResolution, min, max, f));
    scene.add(cloud);

    var moveCamera = true;
    var grapher = {
        scene,
        clock,
        t,
        camera,
        renderer,
        cloud,
        t,
        controls,
        moveCamera
    };

    addToDom(renderer, function() {
        grapher.moveCamera = false;
    })

    render(speed, f, grapher);
}
