// 15号可视化效果
define(['analyser', 'util', 'renderer'], function (analyser, util, renderer) {

    var cover = 'e15.jpg',
        camera, scene,
        material, geometry, cube,
        materials, geometries, cubes,
        centerParticles, centerGeometry, centerMaterial,
        littleParticles, littleGeometry, littleMaterial,
        outerParticles, outerGeometry, outerMaterial,
        camera_a, camera_r, camera_d, camera_h, camera_f,
        i, h, sprite,
        rr = 600, r = 100,
        cr = 200, lr = 20, oradius = 1000,
        count = 1000, lcount = 500, ocount = 3000,
        langle = 0, lh = 0,
        data, len=20, total, avg,
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

        camera_a += avg * 0.00005;
        camera_a %= twoPI;

        langle += avg * 0.0001;
        langle %= twoPI;

        if (camera_d == camera_r)
            camera_d = Math.floor(900 + 300 * Math.random());
        if (camera_d > camera_r) {
            camera_r++;
        } else {
            camera_r--;
        }

        if (camera_f == camera_h)
            camera_f = Math.floor(2 * oradius * Math.random() - oradius);
        if (camera_f > camera_h) {
            camera_h++;
        } else {
            camera_h--;
        }

        camera.position.set(camera_r * Math.cos(camera_a), camera_r * Math.sin(camera_a), camera_h);
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });

        for (i = 0; i < len; i++) {
            var ang = Math.PI * 2 * i / len;
            scene.remove(cubes[i]);
            geometries[i].dispose();
            materials[i].dispose();
            geometry = new THREE.TorusGeometry(r + 0.8 * data[i * 5], 2, 4, 30, 2 * Math.PI);
            material = new THREE.MeshBasicMaterial();
            material.color.setHSL(h + i / 20, 1.0, 0.8);
            cube = new THREE.Mesh(geometry, material);
            geometries[i] = geometry;
            materials[i] = material;
            cubes[i] = cube;
            scene.add(cube);
            cube.position.set(rr * Math.cos(ang), rr * Math.sin(ang), 0);
            cube.rotation.set(Math.PI / 2, ang, 0);
        }

        centerMaterial.color.setHSL(h, 1.0, 0.8);

        for (var vertex of centerGeometry.vertices) {
            var t = vertex.postiondata[0];
            if (t < cr)
                t++;
            else
                t = 0;
            vertex.x = vertex.postiondata[1] * t;
            vertex.y = vertex.postiondata[2] * t;
            vertex.z = vertex.postiondata[3] * t;

            vertex.postiondata[0] = t;
        }

        if (Math.random() > 0.5)
            lh++;
        else
            lh--;

        if (lh > r)
            lh -= r;

        littleParticles.position.set(rr * Math.cos(langle), rr * Math.sin(langle), lh);

        littleMaterial.color.setHSL(((h * 360 + 120) % 360) / 360, 1.0, 1.0);

        for (var vertex of littleGeometry.vertices) {
            var alpha = Math.PI * 2 * Math.random(),
                theta = Math.PI * Math.random(),
                t = lr;
            vertex.x = Math.sin(theta) * Math.cos(alpha) * t;
            vertex.y = Math.sin(theta) * Math.sin(alpha) * t;
            vertex.z = Math.cos(theta) * t;
        }

        renderer.render(scene, camera);
    }

    function init() {
        util.setBg(15);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        camera.position.x = 800;
        camera.position.y = 800;
        camera.position.z = 500;
        camera_a = 0;
        camera_d = camera_r = 800;
        camera_h = camera_f = 500;

        camera.up.x = 0;//相机以哪个方向为上方
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });

        scene = new THREE.Scene();

        geometries = [];
        materials = [];
        cubes = [];

        // 绘制圆环

        for (i = 0; i < len; i++) {
            var ang = Math.PI * 2 * i / len;
            geometry = new THREE.TorusGeometry(r, 2, 4, 30, 2 * Math.PI);
            material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            cube = new THREE.Mesh(geometry, material);
            geometries[i] = geometry;
            materials[i] = material;
            cubes[i] = cube;
            scene.add(cube);
            cube.position.set(rr * Math.cos(ang), rr * Math.sin(ang), 0);
            cube.rotation.set(Math.PI / 2, ang, 0);
        }

        //绘制内部“实心”小球

        centerGeometry = new THREE.Geometry();
        centerMaterial = new THREE.PointCloudMaterial({
            size: 2,
            sizeAttenuation: false,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
        });
        centerMaterial.color.setHSL(0.3, 0.9, 0.5);
        for (i = 0; i < count; i++) {
            var vertex = new THREE.Vector3(),
                alpha = Math.PI * 2 * Math.random(),
                theta = Math.PI * Math.random(),
                t = Math.random() * cr,
                k1 = Math.sin(theta) * Math.cos(alpha),
                k2 = Math.sin(theta) * Math.sin(alpha),
                k3 = Math.cos(theta);
            vertex.x = k1 * t;
            vertex.y = k2 * t;
            vertex.z = k3 * t;
            vertex.postiondata = [t, k1, k2, k3];
            centerGeometry.vertices.push(vertex);
        }
        centerParticles = new THREE.PointCloud(centerGeometry, centerMaterial);
        centerParticles.sortParticles = true;
        scene.add(centerParticles);

        // 绘制转动的“空心”小球

        // littleGeometry = new THREE.SphereGeometry(lr,20,20);
        // littleMaterial = new THREE.MeshBasicMaterial({ color: 0x550000 } );
        // littleParticles = new THREE.Mesh(littleGeometry, littleMaterial);
        // scene.add(littleParticles);


        littleGeometry = new THREE.Geometry();
        littleMaterial = new THREE.PointCloudMaterial({
            size: 1,
            sizeAttenuation: false,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
        });
        littleMaterial.color.setHSL(0.3, 0.9, 0.5);
        for (i = 0; i < lcount; i++) {
            var vertex = new THREE.Vector3(),
                alpha = Math.PI * 2 * Math.random(),
                theta = Math.PI * Math.random(),
                k1 = Math.sin(theta) * Math.cos(alpha),
                k2 = Math.sin(theta) * Math.sin(alpha),
                k3 = Math.cos(theta);
            vertex.x = k1 * lr;
            vertex.y = k2 * lr;
            vertex.z = k3 * lr;
            littleGeometry.vertices.push(vertex);
        }
        littleParticles = new THREE.PointCloud(littleGeometry, littleMaterial);
        littleParticles.sortParticles = true;
        scene.add(littleParticles);

        // 绘制外围的“空心”大球背景

        outerGeometry = new THREE.Geometry();
        outerMaterial = new THREE.PointCloudMaterial({
            size: 3,
            sizeAttenuation: false,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
        });
        outerMaterial.color.setHSL(1.0, 1.0, 1.0);

        var n=Math.ceil(Math.sqrt((ocount-2)/4)),
            segz = Math.PI/2/n,zangle=0;

        for (i=-n;i<n+2;i++){
            var size = (n-Math.abs(i))*4 | 1,
                segr = twoPI /size,
                k3 = oradius*Math.cos(zangle),
                t = oradius*Math.sin(zangle);
            for(var j=0;j<size;j++){
                var vertex = new THREE.Vector3(),
                    rangle = j*segr;
                    k1 = Math.cos(rangle),
                    k2= Math.sin(rangle);
                vertex.x = k1 * t;
                vertex.y = k2 * t;
                vertex.z = k3 ;
                outerGeometry.vertices.push(vertex);
            }
            zangle+=segz;
        }

        outerParticles = new THREE.PointCloud(outerGeometry, outerMaterial);
        outerParticles.sortParticles = true;
        scene.add(outerParticles);

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