// 15号可视化效果
define(['analyser', 'util', 'renderer'], function (analyser, util, renderer) {

    var cover = 'e15.jpg',
        camera, scene,
        material, geometry, particle, particles,
        materialProcessbar,geometryProcessbar,meshProcessbars,
        i, h, r = 10,proc=0,
        SEPARATION = 100, AMOUNTX = 30, AMOUNTY = 30,
        data, len = 20, total, avg,
        musicdata, camera_a=0,square_r = SEPARATION*AMOUNTY,
        twoPI = 2 * Math.PI,
        ang_look = twoPI/4;
        initOrNot = false;

    function draw() {
        if (!material) {
            init();
            return;
        }
        data = analyser.getData();
        proc =analyser.getCurrentTime()/analyser.getDuration();

        var time = Date.now() * 0.00005;
        h = ( 360 * ( 1.0 + time ) % 360 ) / 360;

        camera.positionstotal = 0;

        total = 0;

        for (i = 0; i < len; i++) {
            total += data[i]
        }
        avg = Math.floor(total / len);

        camera_a = Math.abs(ang_look-time%(ang_look*2))-ang_look/2;

        camera.position.set(0.8*square_r * Math.cos(camera_a), 0.8*square_r * Math.sin(camera_a), camera.position.z);
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });

        geometryProcessbar = new THREE.BoxGeometry(proc*1.07*square_r,0.01*square_r,0.01*square_r,1,1,1);
        materialProcessbar.color.setHSL(((h * 360 + 180) % 360) / 360, 0.6, 0.7);
        meshProcessbars[4].geometry.dispose();

        for(i=4;i<8;i++){
            scene.remove(meshProcessbars[i]);
            var meshProcessbar = new THREE.Mesh(geometryProcessbar,materialProcessbar);
            var t = i*twoPI/4;
            meshProcessbar.position.set(Math.cos(t)*0.53*square_r,Math.sin(t)*0.53*square_r,0);
            meshProcessbar.rotateZ(t+twoPI/4);
            meshProcessbars[i] =meshProcessbar;
            scene.add(meshProcessbar);
        }

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

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2 * SEPARATION * AMOUNTY);
        camera.position.x = 0.8 * SEPARATION * AMOUNTY;
        camera.position.y = 0.8 * SEPARATION * AMOUNTY;
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

        geometryProcessbar = new THREE.BoxGeometry(1.07*square_r,0.01*square_r,0.01*square_r,1,1,1); //长度为宽度再加上对应两条间的间距
        materialProcessbar = new THREE.MeshBasicMaterial({
            transparent:true,
            opacity: 0.3,
            color: 0xffffff,
            side: THREE.FrontSide,
            shading: THREE.SmoothShading,
        });
        meshProcessbars = [];

        for(i=0;i<4;i++){
            var meshProcessbar = new THREE.Mesh(geometryProcessbar,materialProcessbar);
            var t = i*twoPI/4;
            meshProcessbar.position.set(Math.cos(t)*0.53*square_r,Math.sin(t)*0.53*square_r,0);
            meshProcessbar.rotateZ(t+twoPI/4);
            meshProcessbars[i] =meshProcessbar;
            scene.add(meshProcessbar);
        }

        geometryProcessbar = new THREE.BoxGeometry(1,0.01*square_r,0.01*square_r,1,1,1);
        materialProcessbar = new THREE.MeshBasicMaterial({
            opacity: 1,
            color: 0xff00ff,
            side: THREE.FrontSide,
            shading: THREE.SmoothShading,
        });

        for(i=0;i<4;i++){
            var meshProcessbar = new THREE.Mesh(geometryProcessbar,materialProcessbar);
            var t = i*twoPI/4;
            meshProcessbar.position.set(Math.cos(t)*0.53*square_r,Math.sin(t)*0.53*square_r,0);
            meshProcessbar.rotateZ(t+twoPI/4);
            meshProcessbars[i+4] =meshProcessbar;
            scene.add(meshProcessbar);
        }

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