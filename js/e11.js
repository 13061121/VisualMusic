// 11号可视化效果
define(['analyser', 'util'], function (analyser, util) {

    var cover = 'e11.jpg';

    var canvas = util.getById('visual-canvas'),
        ctx = canvas.getContext('2d'),
        data, i, cx, cy, beginAngle = 0,
        len = analyser.getFftSize() / 5,
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

        // 绘制music visualizer
        var wid = canvas.width*0.8/len;
        var heig = canvas.height / 2;
        var color_t1 ='rgba(220, 10, 10, 1.0)';
        var color_t2 ='rgba(10, 225, 10, 1.0)';
        var grd=ctx.createLinearGradient(0,canvas.height*0.2,0,canvas.height*0.8);
        grd.addColorStop(.2,color_t1);
        grd.addColorStop(.5,color_t2);
        grd.addColorStop(.8,color_t1);
        //ctx.strokeStyle = color;
        ctx.strokeStyle = grd;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (i = 0; i < len; i += 1) {
            var t = canvas.width*0.1+i*wid;
            ctx.moveTo(t,  heig-data[i]);
            ctx.lineTo(t,  heig+data[i]);
            ctx.lineTo(t+wid,  heig+data[i]);
            ctx.lineTo(t+wid,  heig-data[i]);
            ctx.lineTo(t,  heig-data[i]);
        }
        ctx.closePath();
        ctx.stroke();
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