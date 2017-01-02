// 14号可视化效果
define(['analyser', 'util'], function (analyser, util) {

    var cover = 'e14.jpg';

    var canvas = util.getById('visual-canvas'),
        ctx = canvas.getContext('2d'),
        data, i, cx, cy, beginAngle = 0,
        len = analyser.getFftSize() / 4,
        twoPI = 2 * Math.PI,
        //color = 'rgba(186, 135, 72, 0.5)',
        r2 = 0,
        rotateAngle = 0,
        is_increase = true,
        initOrNot = false;

    function draw() {
        ctx.save();
        data = analyser.getData();
        angle = beginAngle;
        var proc = analyser.getCurrentTime() / analyser.getDuration();
        cx = canvas.width / 2;
        cy = canvas.height / 2;
        var startx = canvas.width * 0.1;
        var starty = canvas.height * 0.9;
        var r = canvas.height * 0.15;
        var processbarWidth = canvas.width * 0.8;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        var total = 0;
        if (is_increase && r2 == 60) {
            is_increase = false;
        }
        if (!is_increase && r2 == 25) {
            is_increase = true;
        }
        if (is_increase) {
            r2++;
        } else {
            r2--;
        }

        rotateAngle += 0.08;

        util.drawProcessBar1(ctx,startx,starty,processbarWidth,r2,rotateAngle,proc);

        //混淆music数据

        var outR = [],
            inR = [],
            ang, x, y, t, musicData,
            seg = twoPI / len;

        for (i = 0; i < len; i++) {
            t = (i * 7) % len;
            ang = angle + t * seg;
            musicData = data[i] * 0.8;
            var cs = Math.cos(ang),
                sn = Math.sin(ang);
            x = (r + musicData) * cs;
            y = (r + musicData) * sn;
            outR[t] = [ang, x, y];
            x = r * cs;
            y = r * sn;
            inR[t] = [ang, x, y];
        }

        // 绘制music visualizer
        var wid = seg * r;
        var centerx = canvas.width * 0.5;
        var centery = canvas.height * 0.5;
        var color_t1 = 'rgba(220, 10, 10, 0.9)';
        var color_t2 = 'rgba(120, 185, 0, 0.9)';
        var grd = ctx.createRadialGradient(centerx, centery,r, centerx, centery,r*2.5);
        grd.addColorStop(0, color_t1);
        grd.addColorStop(1, color_t2);
        ctx.fillStyle = grd;
        ctx.lineWidth = 2;
        var halfPi = Math.PI / 2;
        for (i = 0; i < len; i += 2) {
            ctx.beginPath();
            ctx.arc(centerx + inR[i][1], centery + inR[i][2], wid / 2, halfPi + inR[i][0], Math.PI + halfPi + inR[i][0]);
            ctx.arc(centerx + outR[i][1], centery + outR[i][2], wid / 2, outR[i][0] - halfPi, halfPi + outR[i][0]);
            ctx.closePath();
            ctx.fill();
        }
        beginAngle = (beginAngle + 0.005) % twoPI; //旋转速度

        ctx.restore();
    }

    function init() {
        util.setBg(14);
        initOrNot = true;
    }

    function isInit() {
        return initOrNot;
    }

    function enable() {
        util.showCanvas();
    }

    function disable() {
        util.hideCanvas();
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