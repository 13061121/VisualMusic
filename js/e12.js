// 12号可视化效果
define(['analyser', 'util'], function (analyser, util) {


    var cover = 'e12.jpg';

    var canvas = util.getById('visual-canvas'),
        ctx = canvas.getContext('2d'),
        data, i, cx, cy, angle, beginAngle = 0,
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
        cy = canvas.height * 0.45;
        var startx = canvas.width * 0.1;
        var starty = canvas.height * 0.9;
        var processbarWdith = canvas.width * 0.8;
        var r = Math.min(canvas.width / 4, canvas.height / 4);
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

        //绘制进度条
        ctx.strokeStyle = "rgba(255,255,255,0.7)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startx, starty);
        ctx.lineTo(startx + processbarWdith, starty);
        ctx.closePath();
        ctx.stroke();

        // 绘制滚动条背景
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath();
        ctx.arc(startx + proc * processbarWdith, starty, r2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        // 绘制转动的两个半圆弧
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle, rotateAngle + Math.PI / 4);
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle + Math.PI / 4, rotateAngle, true);
        ctx.closePath();
        ctx.stroke();


        ctx.beginPath();
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle + Math.PI, rotateAngle + 5 * Math.PI / 4);
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle + 5 * Math.PI / 4, rotateAngle + Math.PI, true);
        ctx.closePath();
        ctx.stroke();

        // 绘制滚动图标
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(startx + proc * processbarWdith, starty, 15, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();

        //混淆music数据

        var outR = new Array(),
            inR = new Array(),
            ang, x, y, musicData,
            seg = twoPI / len;

        for (i = 0; i < len; i++) {
            var t = (i * 7) % len;
            ang = angle + t * seg;
            musicData = ( data[(i + len - 2) % len] + data[(i + len - 1) % len] + data[i] + data[(i + 1) % len] + data[(i + 2) % len] ) / 10;
            var cs = Math.cos(ang), sn = Math.sin(ang);
            x = (r + musicData) * cs;
            y = (r + musicData) * sn;
            outR[t] = [ang, x, y];
            x = (r - musicData) * cs;
            y = (r - musicData) * sn;
            inR[t] = [ang, x, y];
        }


        // 绘制music visualizer
        var color_t1 = 'rgba(220, 0, 0, 0.9)';
        var color_t2 = 'rgba(20, 225, 25, 0.9)';
        var grd = ctx.createLinearGradient(0, canvas.height * 0.25, 0, canvas.height * 0.75);
        grd.addColorStop(0, color_t1);
        grd.addColorStop(.5, color_t2);
        grd.addColorStop(1, color_t1);
        //ctx.strokeStyle = color;
        ctx.strokeStyle = grd;
        ctx.lineWidth = 2;
        var t = len - 1;
        for (i = 0; i < len; i ++) {
            ctx.beginPath();
            ctx.moveTo(cx + outR[t][1], cy + outR[t][2]);
            ctx.lineTo(cx + outR[i][1], cy + outR[i][2]);
            ctx.lineTo(cx + inR[i][1], cy + inR[i][2]);
            ctx.lineTo(cx + inR[t][1], cy + inR[t][2]);
            ctx.lineTo(cx + outR[t][1], cy + outR[t][2]);
            //ctx.arc(cx + (inR[i][1]+outR[i][1])/2, cy + (inR[i][2]+outR[i][2])/2, 2, angle, angle + twoPI);
            ctx.closePath();
            ctx.stroke();
            console.log(outR[i][1] - outR[t][1]);
            t = i;
        }
        beginAngle = (beginAngle + 0.005) % twoPI; //旋转速度

        ctx.restore();
    }

    function init() {
        util.setBg(12);
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