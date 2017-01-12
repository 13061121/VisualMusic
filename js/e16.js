// 15号可视化效果
define(['analyser', 'util', 'renderer'], function (analyser, util, renderer) {

    var cover = 'e16.jpg',
        camera, scene,
        material, geometry, particle, particles,
        materialProcessbar, geometryProcessbar, meshProcessbars,
        materialBackground,
        centerMaterial, centerGeometry, centerParticles,
        outerMaterial, outerMesh,
        visibleMaterial, visibleGeometry, visibleParticles, vertexcount = 0,
        i, h, r = 12, proc = 0,
        SEPARATION = 100, AMOUNTX = 25, AMOUNTY = 25,
        data, len = 20, total, avg, count = 10000,
        musicdata, camera_a = 0,
        square_r = SEPARATION * AMOUNTY, square_r2 = 0.53 * square_r, square_r3 = Math.sqrt(2) * 0.535 * square_r,
        twoPI = 2 * Math.PI,
        initOrNot = false;

    function getUnvisibleVextex() {
        var t = (vertexcount + 1) % count;
        while (visibleGeometry.vertices[t].postiondata[3] && (t != vertexcount))t = (t + 1) % count;
        vertexcount = t;
        return vertexcount;
    }

    function draw() {
        if (!material) {
            init();
            return;
        }
        data = analyser.getData();
        proc = analyser.getCurrentTime() / analyser.getDuration();

        var time = Date.now() * 0.00005;
        h = ( 360 * ( 1.0 + time ) % 360 ) / 360;

        camera.positionstotal = 0;

        total = 0;

        for (i = 0; i < len; i++) {
            total += data[i]
        }
        avg = Math.floor(total / len);

        camera_a = (camera_a + avg * 0.00001) % twoPI;

        camera.position.set(square_r * Math.cos(camera_a), square_r * Math.sin(camera_a), camera.position.z);
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });


        // 彩色进度条重绘

        materialProcessbar.color.setHSL(((h * 360 + 180) % 360) / 360, 1.0, 0.9);

        proc = 0.00001+proc*0.99999;

        for (i = 4; i < 8; i++) {
            meshProcessbars[i].scale.set(proc, 1, 1);
        }

        materialBackground.color.setHSL(((h * 360 + 300) % 360) / 360, 0.3, 0.4);

        outerMesh.rotation.y += avg * 0.0001;
        outerMesh.rotation.x += avg * 0.0002;
        outerMesh.rotation.z += avg * 0.0003;

        outerMaterial.color.setHSL(h, 1.0, 0.9);

        // 更新粒子位置


        for (i = 0; i < centerGeometry.vertices.length; i++) {
            var vertex = centerGeometry.vertices[i],
                t = vertex.postiondata[0],
                rt = vertex.postiondata[1],
                v = vertex.postiondata[2],
                absx = Math.abs(vertex.x),
                absy = Math.abs(vertex.y);
            if ((vertex.z != 0) && (rt < square_r3)) {
                if ((vertex.x == 0) && (vertex.y == 0)) {
                    if (vertex.z > -square_r3) {
                        vertex.z -= v;
                        continue;
                    } else {
                        t = Math.random() * twoPI;
                        rt = 1;
                        v = 1 + Math.random() * 2;
                    }
                } else {
                    rt += v;
                    t = (t - 0.00001 * total) % twoPI;
                    vertex.z = -Math.sqrt(square_r3 * square_r3 - rt * rt);
                }
            } else {
                vertex.z = 0;
                if ((absx + absy) == 0) {

                    vertex.z = -1;
                    continue;
                } else if ((absy > square_r2) || (absx > square_r2))
                    rt -= v;
                else if (((absy == 0) && (absx <= square_r)) || ((absx != 0) && (absy >= absx))) {
                    vertex.x = Math.sign(vertex.x) * Math.floor(absx * 0.99);
                    continue;
                } else {
                    vertex.y = Math.sign(vertex.y) * Math.floor(absy * 0.99);
                    continue;
                }
            }
            vertex.x = rt * Math.cos(t);
            vertex.y = rt * Math.sin(t);
            vertex.postiondata[0] = t;
            vertex.postiondata[1] = rt;
        }

        centerGeometry.verticesNeedUpdate = true;

        centerMaterial.color.setHSL(((h * 360 + 180) % 360) / 360, 0.9, 0.8);

        // 绘制逃逸小球粒子

        var zeroPoint = new THREE.Vector3(),
            angseg = twoPI / (2 * (AMOUNTX + AMOUNTY));

        for (i = 0; i < visibleGeometry.vertices.length; i++) {
            vertex = visibleGeometry.vertices[i];
            t = vertex.postiondata[0];
            rt = vertex.postiondata[1];
            v = vertex.postiondata[2];
            var isVisible = vertex.postiondata[3],
                isZUp = vertex.postiondata[4];
            absx = Math.abs(vertex.x);
            absy = Math.abs(vertex.y);
            if (!isVisible)
                continue;
            if (isZUp) {
                if (vertex.distanceTo(zeroPoint) > square_r3) {
                    vertex.postiondata[4] = false;
                    rt = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
                    t += Math.random() * angseg;
                } else {
                    vertex.z += v;
                    continue;
                }
            } else {
                if ((vertex.z != 0) && (rt < square_r3)) {
                    rt += v;
                    t = (t + 0.00001 * total) % twoPI;
                    vertex.z = Math.sqrt(square_r3 * square_r3 - rt * rt);
                } else {
                    vertex.z = 0;
                    if ((absx + absy) == 0) {
                        vertex.z = vertex.x = vertex.y = 0;
                        vertex.postiondata[3] = false;
                    }
                    else if ((absy > square_r2) || (absx > square_r2))
                        rt -= v;
                    else if (((absy == 0) && (absx <= square_r)) || ((absx != 0) && (absy >= absx))) {
                        vertex.x = Math.sign(vertex.x) * Math.floor(absx * 0.99);
                        continue;
                    } else {
                        vertex.y = Math.sign(vertex.y) * Math.floor(absy * 0.99);
                        continue;
                    }
                }
            }
            vertex.x = rt * Math.cos(t);
            vertex.y = rt * Math.sin(t);
            vertex.postiondata[0] = t;
            vertex.postiondata[1] = rt;
        }

        visibleMaterial.color.setHSL(h, 0.9, 0.8);

        var tArray = [];
        t = Math.floor(data.length * 0.4 / AMOUNTY);
        for (i = 0; i < AMOUNTY; i++) {
            tArray[i] = data[i * t] * 2;
        }

        musicdata.shift();
        musicdata.push(tArray);

        i = 0;

        material.emissive.setHSL(h, 0.7, 0.4);

        var ruler = 2 * r;

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++];
                musicdata[ix][iy] *= 0.95;
                if (Math.abs(musicdata[ix][iy] - particle.position.z) > ruler) {
                    var t = vertexcount;
                    var k = getUnvisibleVextex(),
                        vertex = visibleGeometry.vertices[k];
                    if (t != k) {
                        vertex.x = particle.position.x + (Math.random() * 2 - 1) * r;
                        vertex.y = particle.position.y + (Math.random() * 2 - 1) * r;
                        vertex.z = particle.position.z;
                        t = Math.atan2(vertex.y, vertex.x);
                        if (vertex.x < 0)
                            t += Math.PI;
                        vertex.postiondata = [t, 1, 3 + Math.random() * 10, true, true];
                    }
                }
                particle.position.set(particle.position.x, particle.position.y, r + musicdata[ix][iy]);
            }
        }

        visibleGeometry.verticesNeedUpdate = true;

        renderer.render(scene, camera);
    }

    function init() {
        util.setBg(16);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2 * square_r);
        camera.position.x = square_r;
        camera.position.y = square_r;
        camera.position.z = 0.2 * square_r;

        camera.up.x = 0;//相机以哪个方向为上方
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });

        scene = new THREE.Scene();

        // 绘制进度条背景

        geometryProcessbar = new THREE.BoxGeometry(1.07 * square_r, 0.01 * square_r, 0.01 * square_r, 1, 1, 1); //长度为宽度再加上对应两条间的间距
        materialProcessbar = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.3,
            color: 0xffffff
        });
        meshProcessbars = [];

        for (i = 0; i < 4; i++) {
            var meshProcessbar = new THREE.Mesh(geometryProcessbar, materialProcessbar);
            var t = i * twoPI / 4;
            meshProcessbar.position.set(Math.cos(t) * square_r2, Math.sin(t) * square_r2, 0);
            meshProcessbar.rotateZ(t + twoPI / 4);
            meshProcessbars[i] = meshProcessbar;
            scene.add(meshProcessbar);
        }

        // 绘制滚动圆环

        var outerGeometry = new THREE.TorusGeometry(square_r3, 3, 4, 100, twoPI);
        outerMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.3,
            color: 0xffffff,
            side: THREE.FrontSide,
            shading: THREE.SmoothShading,
        });
        outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
        scene.add(outerMesh);

        outerMaterial = new THREE.MeshBasicMaterial({
            opacity: 1,
            color: 0xffffff,
            side: THREE.FrontSide,
            shading: THREE.SmoothShading,
        });
        outerMesh = new THREE.Mesh(outerGeometry, outerMaterial);
        scene.add(outerMesh);

        // 绘制进度条

        geometryProcessbar = new THREE.BoxGeometry(1.07 * square_r, 0.01 * square_r, 0.01 * square_r, 1, 1, 1);
        materialProcessbar = new THREE.MeshBasicMaterial({color: 0xffffff});

        for (i = 0; i < 4; i++) {
            var meshProcessbar = new THREE.Mesh(geometryProcessbar, materialProcessbar);
            var t = i * twoPI / 4;
            meshProcessbar.position.set(Math.cos(t) * square_r2, Math.sin(t) * square_r2, 0);
            meshProcessbar.rotateZ(t + twoPI / 4);
            meshProcessbar.scale.set(0.000001, 1, 1);
            meshProcessbars[i + 4] = meshProcessbar;
            scene.add(meshProcessbar);
        }

        //  绘制浮动粒子

        centerGeometry = new THREE.Geometry();
        for (i = 0; i < count; i++) {
            var vertex = new THREE.Vector3(),
                t = Math.random() * twoPI,
                rt = Math.random() * square_r * 0.53,
                v = 1 + Math.random() * 6;
            vertex.x = rt * Math.cos(t);
            vertex.y = rt * Math.sin(t);
            vertex.z = -square_r2 * 1.5;
            vertex.postiondata = [t, rt, v];
            centerGeometry.vertices.push(vertex);
        }
        centerMaterial = new THREE.PointsMaterial({
            size: 2,
            color: 0x0000ff,
            sizeAttenuation: false,
            transparent: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
        });


        centerMaterial.color.setHSL(0.4, 1.0, 0.8);
        centerParticles = new THREE.Points(centerGeometry, centerMaterial);
        //centerParticles.sortParticles = true;
        scene.add(centerParticles);

        // 绘制从小球逃逸的粒子

        visibleGeometry = new THREE.Geometry();
        for (i = 0; i < count; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = 0;
            vertex.y = 0,
                vertex.z = 0;
            vertex.postiondata = [0, 0, 0, false, false];
            visibleGeometry.vertices.push(vertex);
        }
        visibleMaterial = new THREE.PointsMaterial({
            size: 2.5,
            color: 0x0000ff,
            sizeAttenuation: false,
            transparent: false,
            blending: THREE.AdditiveBlending,
            depthTest: false,
        });

        visibleMaterial.color.setHSL(0.4, 1.0, 0.8);
        visibleParticles = new THREE.Points(visibleGeometry, visibleMaterial);
        visibleParticles.sortParticles = true;
        scene.add(visibleParticles);

        // 绘制浮动小球地面
        //长度为宽度再加上对应两条间的间距
        var geometryBackground = new THREE.BoxGeometry(1.05 * square_r, 1.05 * square_r, 5, 1, 1, 1);
        materialBackground = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.3,
            color: 0x00ff00,
            side: THREE.FrontSide,
            shading: THREE.SmoothShading,
        });

        var meshBackground = new THREE.Mesh(geometryBackground, materialBackground);
        scene.add(meshBackground);

        // 绘制浮动小球

        particles = [];

        geometry = new THREE.SphereGeometry(r, 12, 12);
        material = new THREE.MeshPhongMaterial({
            depthTest: true,
            depthWrite: true,
            side: THREE.FrontSide,
            color: 0xff0000,
            emissive: 0xffff00,
            shininess: 50,
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