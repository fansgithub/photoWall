import snowImageData from './images/snow.png';
import flowerImageData0 from './images/flower-0.png';
import flowerImageData1 from './images/flower-1.png';
import flowerImageData2 from './images/flower-2.png';
import flowerImageData3 from './images/flower-3.png';

// 存储所有的雪花
const snows = [];

// 下落的加速度
const G = 0.01;

// 速度上限，避免速度过快
const SPEED_LIMIT_X = 1;
const SPEED_LIMIT_Y = 1;

const W = window.innerWidth;
const H = window.innerHeight;

let tickCount = 150;
let ticker = 0;
let lastTime = Date.now();
let deltaTime = 0;
let flakeSize = 5;

let canvas = null;
let ctx = null;

let snowImage = null;
let flowerImages = [];

function init(options) {
    createCanvas();
    canvas.width = W;
    canvas.height = H;
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none;';
    document.body.appendChild(canvas);
    // 小屏幕时延长添加雪花时间，避免屏幕上出现太多的雪花
    if (W < 768) {
        tickCount = 350;
    }

    if (options) {
        if (options.tickCount) {
            tickCount = options.tickCount;
        }
    }

    snowImage = new Image();
    snowImage.src = snowImageData;
    flowerImages = [];
    for (let i = 0; i < 4; i++) {
        let flowerImage = new Image();
        let imageData;
        switch (i) {
            case 1:
                imageData = flowerImageData1;
                break;
            case 2:
                imageData = flowerImageData2;
                break;
            case 3:
                imageData = flowerImageData3;
                break;
            default:
                imageData = flowerImageData0;
                break;
        }
        flowerImage.src = imageData;
        flowerImages.push(flowerImage);
    }

    loop();
}

function loop() {
    if (!ctx) {
        return;
    }
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, W, H);

    const now = Date.now();
    deltaTime = now - lastTime;
    lastTime = now;
    ticker += deltaTime;

    if (ticker > tickCount) {
        let radiusBase = 5;
        // 随机生成当前雪花类型
        let type = Math.floor(Math.random() * 10000) % 20;
        if (type > 16) {
            type = 'dot';
        } else if(type > 3) {
            type = 'snow';
            radiusBase = 3;
        }
        snows.push(
            new Snow(Math.random() * W, 0, Math.random() * 5 + radiusBase, type)
        );
        ticker %= tickCount;
    }

    snows.map(function(s, i) {
        s.update();
        s.draw();
        if (s.y >= H) {
            snows.splice(i, 1);
        }
    });
}

function Snow(x, y, radius, type) {
    this.x = x;
    this.y = y;
    this.sx = 0;
    this.sy = 0;
    this.deg = 0;
    this.radius = radius;
    this.size = Math.random() * flakeSize + 2;
    this.ax = Math.random() < 0.5 ? 0.005 : -0.005;
    this.type = type;
}

Snow.prototype.update = function() {
    const deltaDeg = Math.random() * 0.6 + 0.2;

    this.sx += this.ax;
    if (this.sx >= SPEED_LIMIT_X || this.sx <= -SPEED_LIMIT_X) {
        this.ax *= -1;
    }

    if (this.sy < SPEED_LIMIT_Y) {
        this.sy += G;
    }

    this.deg += deltaDeg;
    this.x += this.sx;
    this.y += this.sy;
}

Snow.prototype.draw = function() {
    const radius = this.radius;

    if (this.type === 'dot') {
        let snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");
        /* 此处是雪花颜色，默认是白色 */
        snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
        /* 若要改为其他颜色，请自行查 */
        snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");
        /* 找16进制的RGB 颜色代码。 */
        ctx.save();
        ctx.fillStyle = snowFlake;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, radius);
        ctx.fill();
        ctx.restore();
    } else {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.deg * Math.PI / 180);
        let currentImage;
        if (this.type === 'snow') {
            currentImage = snowImage;
        } else {
            currentImage = flowerImages[this.type];
        }
        ctx.drawImage(currentImage, -radius, -radius, radius * 5, radius * 5);
        ctx.restore();
    }
}

function createCanvas() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
}

function end() {
    if (canvas) {
        document.body.removeChild(canvas);
    }
    tickCount = 150;
    canvas = null;
    ctx = null;
    snowImage = null;
    flowerImages = [];
    snows.splice(0, snows.length);
}

export default {
    start: function () {
        if (canvas) {
            return;
        }
        init({tickCount: 500});
    },
    end,
}