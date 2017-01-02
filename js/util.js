// 公共方法
define(function () {

var $background = $('#background'),
    $canvas = $('#visual-canvas'),
    doc = document;

// document.getElementById的缩写
function getById(id) {
    return doc.getElementById(id);
}

// 去除文件后缀名
function getRidOfExtention(str) {
    return str.replace(/\.[0-9a-z]+$/i, '');
}

/** 
 * 取得整数随机数
 * @param {Number} down 下限
 * @param {Number} up 上限
 * @returns {Number} 结果
 */
function intRandom(low, up) {
    return Math.floor(Math.random() * (up - low) + low);
}

// 全屏切换
function fullscreenSwitch() {
    var element = doc.documentElement;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if(doc.cancelFullScreen) {
            doc.cancelFullScreen();
        } else if(doc.webkitCancelFullScreen) {
            doc.webkitCancelFullScreen();
        }
    } else {
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if(element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
    }
}

// 设置背景
function setBg(num) {
    $background.removeClass();
    $background.addClass('bg' + num);
}

function showCanvas() {
    $canvas.removeClass('hidden');
}

function hideCanvas() {
    $canvas.addClass('hidden');
}

// 在11, 12，13，14动态效果中绘制进度条
function drawProcessBar1(ctx,startx,starty,processbarWidth,r,rotateAngle,proc) {
    //绘制进度条
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(startx + processbarWidth, starty);
    ctx.closePath();
    ctx.stroke();

    // 绘制滚动条背景
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(startx + proc * processbarWidth, starty, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    // 绘制转动的两个半圆弧
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(startx + proc * processbarWidth, starty, 18, rotateAngle, rotateAngle + Math.PI / 4);
    ctx.arc(startx + proc * processbarWidth, starty, 18, rotateAngle + Math.PI / 4, rotateAngle, true);
    ctx.closePath();
    ctx.stroke();


    ctx.beginPath();
    ctx.arc(startx + proc * processbarWidth, starty, 18, rotateAngle + Math.PI, rotateAngle + 5 * Math.PI / 4);
    ctx.arc(startx + proc * processbarWidth, starty, 18, rotateAngle + 5 * Math.PI / 4, rotateAngle + Math.PI, true);
    ctx.closePath();
    ctx.stroke();

    // 绘制滚动图标
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(startx + proc * processbarWidth, starty, 15, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
}

return {
    getById: getById,
    getRidOfExtention: getRidOfExtention,
    intRandom: intRandom,
    drawProcessBar1:drawProcessBar1,
    fullscreenSwitch: fullscreenSwitch,
    setBg: setBg,
    showCanvas: showCanvas,
    hideCanvas: hideCanvas
}

});