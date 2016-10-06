// 7号可视化效果
define(['analyser', 'util'], function (analyser, util) {

    var cover = 'e11.jpg';

    var canvas = util.getById('visual-canvas'),
        ctx = canvas.getContext('2d'),
        data, i, len, cx, cy, angle, beginAngle = 0, total,
        len = analyser.getFftSize() / 5, r = 2,
        twoPI = 2 * Math.PI,
        angleGap = twoPI / 3,
        color = 'rgba(186, 135, 72, 0.5)',
        r2 = 0,
        rotateAngle = 0;
        is_increase = true,
        initOrNot = false;

    function draw() {
        ctx.save();
        data = analyser.getData();
        angle = beginAngle;
        proc = analyser.getCurrentTime() / analyser.getDuration();
        cx = canvas.width / 2;
        cy = canvas.height / 2;
        startx = canvas.width * 0.1;
        starty = canvas.height * 0.9;
        processbarWdith = canvas.width * 0.8;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        total = 0;
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
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle+0, rotateAngle+Math.PI/4);
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle+Math.PI/4,rotateAngle+0,true);
        ctx.closePath();
        ctx.stroke();


        ctx.beginPath();
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle+Math.PI, rotateAngle+5*Math.PI/4);
        ctx.arc(startx + proc * processbarWdith, starty, 18, rotateAngle+5*Math.PI/4,rotateAngle+Math.PI, true);
        ctx.closePath();
        ctx.stroke();

        // 绘制滚动图标
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(startx + proc * processbarWdith, starty, 15, 0, 2 * Math.PI)
        ctx.closePath();
        ctx.fill();

        // 绘制music visualizer
        ctx.strokeStyle = color;
        ctx.lineWidth = 10;
        for (i = 12; i < len; i += 2) {
            angle += 0.2;
            ctx.beginPath();
            ctx.moveTo(cx + r * data[i] * Math.sin(angle), cy + r * data[i] * Math.cos(angle));
            ctx.lineTo(cx + r * data[i] * Math.sin(angle + angleGap), cy + r * data[i] * Math.cos(angle + angleGap));
            ctx.lineTo(cx + r * data[i] * Math.sin(angle + angleGap * 2), cy + r * data[i] * Math.cos(angle + angleGap * 2));
            ctx.closePath();
            ctx.stroke();
            total += data[i];
        }
        beginAngle = (beginAngle + 0.00001 * total) % twoPI;
        ctx.restore();
    }

    function init() {
        util.setBg(11);
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