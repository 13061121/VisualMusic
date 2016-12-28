// 15号可视化效果
define(['analyser', 'util', 'renderer'], function (analyser, util, renderer) {

    var cover = 'e15.jpg',
        camera, scene,
        material, geometry, particle, particles,
        i, h, r = 10,
        SEPARATION = 100, AMOUNTX = 30, AMOUNTY = 30,
        data, len = 20, total, avg,
        musicdata,
        twoPI = 2 * Math.PI,
        initOrNot = false;

    function draw() {
        if (!material) {
            init();
            return;
        }
        data = analyser.getData();

        var time = Date.now() * 0.00005;
        h = ( 360 * ( 1.0 + time ) % 360 ) / 360;

        camera.positionstotal = 0;

        total = 0;

        for (i = 0; i < len; i++) {
            total += data[i]
        }
        avg = Math.floor(total / len);

        var tArray = [], t = Math.floor(data.length * 0.4 / AMOUNTY);
        for (i = 0; i < AMOUNTY; i++) {
            tArray[i] = data[i * t] * 2;
        }

        musicdata.shift();
        musicdata.push(tArray);

        i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++];
                material.emissive.setHSL(h, 0.6, 0.7);
                musicdata[ix][iy] *= 0.95;
                particle.position.set(particle.position.x, particle.position.y, musicdata[ix][iy]);
            }
        }

        renderer.render(scene, camera);
    }

    function init() {
        util.setBg(15);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1.5 * SEPARATION * AMOUNTY);
        camera.position.x = 0.8 * SEPARATION * AMOUNTY;
        camera.position.y = 0.2 * SEPARATION * AMOUNTY;
        camera.position.z = 0.2 * SEPARATION * AMOUNTY;

        camera.up.x = 0;//相机以哪个方向为上方
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });

        scene = new THREE.Scene();

        particles = [];

        geometry = new THREE.SphereGeometry(r, 12, 12);
        material = new THREE.MeshPhongMaterial({
            opacity: 1,
            color: 0xff0000,
            emissive: 0xff00ff,
            side: THREE.FrontSide,
            shading: THREE.SmoothShading
        });

        i = 0;

        musicdata = [];

        for (var ix = 0; ix < AMOUNTX; ix++) {
            var tArray = [];
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i] = new THREE.Mesh(geometry, material);
                particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
                particle.position.y = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
                particle.position.z = tArray[iy] = r;
                scene.add(particle);
                i++;
            }
            musicdata[ix] = tArray;
        }

        initOrNot = true;
    }

    function isInit() {
        return initOrNot;
    }

    function enable() {
        renderer.show();
    }

    function disable() {
        renderer.hide();
    }

    return {
        draw: draw,
        init: init,
        isInit: isInit,
        cover: cover,
        enable: enable,
        disable: disable
    }

});