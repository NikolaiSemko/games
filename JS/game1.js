(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext(`2d`);
    const ship = document.querySelector('img');
    const PI6 = 2 * Math.PI / 3;
    let last = 0;
    let last2 = 0;
    let last3 = 0;
    let w, h, ang;
    let shots = [];
    let enemy = [];
    let speed = 0.7;
    let frequency = 500;
    let coef = 1;
    let dt = 0;
    let life = 100;
    let score = 0;
    let gameOver = false;
    var img = new Image();
    img.src = "./Images/space.jpg";
    let rectSize = 30;

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    let name = getCookie('name');
    let record = getCookie('score_game1');
    if (record != undefined) {
        record = parseInt(record);
    } else {
        record = 0;
    }

    class Enemy {
        constructor() {
            this.ang = Math.random() * Math.PI * 2;
            this.max = Math.sqrt(w * w / 4 + h * h / 4);
            this.speed = 0.005 + 0.015 * (1 - coef) + Math.random() * 0.01;
            let xx = w / 2 + Math.cos(this.ang) * this.max;
            let yy = h / 2 + Math.sin(this.ang) * this.max;
            this.start = { x: xx, y: yy };
            this.cur = { x: xx, y: yy };
            this.dx = this.speed * Math.cos(this.ang);
            this.dy = this.speed * Math.sin(this.ang);
            this.r = Math.random() * 20 + 20;
            this.R = Math.floor(Math.random() * (256)).toString(10);
            this.G = Math.floor(Math.random() * (256)).toString(10);
            this.B = Math.floor(Math.random() * (256)).toString(10);
            this.color = 'rgba(' + this.R + ' , ' + this.G + ' , ' + this.B + ', 0.9)';
        }
        draw() {
            this.cur.x -= this.dx * dt;
            this.cur.y -= this.dy * dt;
            createCircle(this.cur.x, this.cur.y, this.r, true, this.color);
        }
    }
    class Shot {
        constructor(r, x, y) {
            this.start = { x: x, y: y };
            this.cur = { x: x, y: y };
            this.dx = speed * Math.cos(ang - PI6);
            this.dy = speed * Math.sin(ang - PI6);
            this.r = r;
            this.R = Math.floor(127 + Math.random() * (128)).toString(10);
            this.G = Math.floor(127 + Math.random() * (128)).toString(10);
            this.B = Math.floor(127 + Math.random() * (128)).toString(10);
            this.color = 'rgba(' + this.R + ' , ' + this.G + ' , ' + this.B + ', 0.9)';
            //this.color = '#' + Math.floor(Math.random() * (256)).toString(16) + Math.floor(Math.random() * (256)).toString(16) + Math.floor(Math.random() * (256)).toString(16);
        }

        draw() {
            this.cur.x += this.dx * dt;
            this.cur.y += this.dy * dt;
            createCircle(this.cur.x, this.cur.y, this.r, true, '#F0FF');//this.color);
        }
    }
    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }

    function rotateShip({ layerX, layerY }) {
        ang = Math.atan((layerY - h / 2) / (layerX - w / 2)) + PI6;
        if (layerX < w / 2) ang += Math.PI;
        let sss = "rotate(" + ang.toString() + "rad)";
        ship.style.transform = sss;
    }
    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        ctx.font = (0.02 * w).toFixed(1).toString() + "px Turret Road";
        ctx.textAlign = "left";
    }
    function resize() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        ctx.font = (0.02 * w).toFixed(1).toString() + "px Turret Road";
    }
    function reDraw() {
        for (let i = 0; i < enemy.length; i++) {
            let xx = enemy[i].cur.x;
            let yy = enemy[i].cur.y;
            let del = false;
            for (let j = 0; j < shots.length; j++) {
                let x1 = shots[j].cur.x - xx;
                let y1 = shots[j].cur.y - yy;
                let rr = shots[j].r + enemy[i].r;
                if ((x1 * x1 + y1 * y1) < rr * rr) {
                    shots.splice(j, 1);
                    enemy[i].r -= 2;
                    score++;
                    coef = 1 - score / 500.0;
                    if (coef < 0.1) coef = 0.1;
                    if (enemy[i].r < 2) {
                        enemy.splice(i, 1);
                        del = true;
                    }
                    break;
                }
            }
            if (del) continue;
            enemy[i].draw();
            let x = enemy[i].cur.x - w / 2;
            let y = enemy[i].cur.y - h / 2;
            let r = 12 + enemy[i].r;
            if ((x * x + y * y) < r * r) {
                enemy.splice(i, 1);
                life -= 3;
                if (life < 1) {
                    gameOver = true;
                    if (name != undefined) {
                        let maxscore = getCookie('score_game1');
                        if (maxscore != undefined) {
                            if (score > parseInt(maxscore)) {
                                document.cookie = "score_game1=" + score.toString() + ";max-age=1e7";
                                record = score;
                            }
                        } else {
                            document.cookie = "score_game1=" + score.toString() + ";max-age=1e7";
                            record = score;
                        }
                    };
                }
            }
            x = enemy[i].cur.x - enemy[i].start.x;
            y = enemy[i].cur.y - enemy[i].start.y;
            if ((x * x + y * y) > enemy[i].max * enemy[i].max) {
                enemy.splice(i, 1);
            }
        }
        for (let i = 0; i < shots.length; i++) {
            shots[i].draw();
            let r = shots[i].r;
            let x = shots[i].cur.x;
            let y = shots[i].cur.y;

            if (x > w + r || x < -r || y > h + r || y < -r) {
                shots.splice(i, 1);
            }
        }
        if (gameOver) {
            let k = w / h;
            ctx.fillStyle = '#FFFF4080';
            ctx.strokeStyle = '#FFFF40AA';
            ctx.lineWidth = rectSize / 30;
            roundRect(ctx, w / 2 - rectSize / 2, h / 2 - 0.5 * rectSize / k, rectSize, rectSize / k, rectSize / 15, true, true);
            ctx.fillStyle = "#AAAAFFFF";
            ctx.textAlign = "center";
            ctx.font = (0.15 * rectSize).toFixed(1).toString() + "px Turret Road";
            ctx.fillText('Game Over', w / 2, h / 2);
            ctx.font = (0.10 * rectSize).toFixed(1).toString() + "px Turret Road";

            ctx.fillText('Your score: ' + score.toString(), w / 2, h / 2 + rectSize * 0.1);

            ctx.font = (0.02 * w).toFixed(1).toString() + "px Turret Road";
            ctx.textAlign = "left";
            rectSize *= 1.01;
            if (rectSize > 2 * w) {
                gameOver = false;
                enemy = [];
                life = 100;
                score = 0;
                coef = 1;
                rectSize = 30;
            }
        }
        ctx.fillStyle = "#FFFF80FF";
        ctx.fillText('Score: ' + score.toString(), 0.85 * w, 0.05 * h);
        ctx.fillText('Power: ' + ((1.1 - coef) * 100.0).toFixed(1).toString() + "%", 0.85 * w, 0.1 * h);
        ctx.fillText('Life: ' + life.toString() + "%", 0.85 * w, 0.15 * h);
        ctx.fillStyle = "#FFFF8080";
        roundRect(ctx, 0.02 * w, 0.009 * w, 0.06 * w, 0.02 * w, 0.002 * w, true, false);
        ctx.fillStyle = "#000000FF";
        ctx.font = (0.02 * w).toFixed(1).toString() + "px Turret Road";
        ctx.fillText('Home', 0.025 * w, 0.025 * w);    
        ctx.textAlign = "left";
        ctx.fillStyle = "#FFFFFFFF";
        if (name != undefined) {
            ctx.fillText('Hello '+ name +", Your record: " + record.toString(), 0.3 * w, 0.025 * w);   
        }

    }
    function loop() {
        ctx.fillStyle = "#000020FF";
        if (w <= 1920 && h <= 1080) {
            ctx.drawImage(img, 0, 0);
        } else {
            ctx.fillRect(0, 0, w, h);
        }
        if (!gameOver) {
            let now = new Date();
            if (last == 0) last = now;
            if (last2 == 0) last2 = now;
            dt = now - last2;
            dt3 = now - last3;
            if (now - last > frequency * coef) {
                shots.push(new Shot(10, w / 2, h / 2));
                shots.push(new Shot(5, w / 2 + w * 0.0345 * Math.sin(ang - PI6), h / 2 - w * 0.0345 * Math.cos(ang - PI6)));
                shots.push(new Shot(5, w / 2 - w * 0.0345 * Math.sin(ang - PI6), h / 2 + w * 0.0345 * Math.cos(ang - PI6)));
                last = now;
            }
            if (now - last3 > 1500 * Math.sqrt(coef)) {
                enemy.push(new Enemy());
                last3 = now;
            }
            last2 = now;
        }
        reDraw();
        window.requestAnimationFrame(loop);
    }

    canvas.addEventListener('mousemove', rotateShip);
    window.addEventListener("resize", resize);
    roundRect(ctx, 0.02 * w, 0.009 * w, 0.06 * w, 0.02 * w, 0.002 * w, true, false);
    canvas.addEventListener("click", (event) => {
        let x = event.layerX;
        let y = event.layerY;
        if (x > 0.02 * w && x < 0.08 * w && y > 0.009 * w && y < 0.029 * w) {
            window.location.href = './index.html';
            //history.go(-1);
        }
    });

    init();
    loop();

    // ******************************************************************************************
    /**
     * Draws a rounded rectangle using the current state of the canvas.
     * If you omit the last three params, it will draw a rectangle
     * outline with a 5 pixel border radius
     * @param {CanvasRenderingContext2D} ct
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the rectangle
     * @param {Number} height The height of the rectangle
     * @param {Number} [radius = 5] The corner radius; It can also be an object
     *                 to specify different radii for corners
     * @param {Number} [radius.tl = 0] Top left
     * @param {Number} [radius.tr = 0] Top right
     * @param {Number} [radius.br = 0] Bottom right
     * @param {Number} [radius.bl = 0] Bottom left
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     * ct.strokeStyle = "#0f0";
     * ct.fillStyle = "#ddd";
     * ct.strokeStyle = "rgb(255, 0, 0)";
     * ct.fillStyle = "rgba(255, 255, 0, .5)";
     * roundRect(ct, 300, 5, 200, 100, {tl: 50, br: 25}, true);
     */
    function roundRect(ct, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        if (typeof radius === "number") {
            radius = { tl: radius, tr: radius, br: radius, bl: radius };
        } else {
            let defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ct.beginPath();
        ct.moveTo(x + radius.tl, y);
        ct.lineTo(x + width - radius.tr, y);
        ct.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ct.lineTo(x + width, y + height - radius.br);
        ct.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ct.lineTo(x + radius.bl, y + height);
        ct.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ct.lineTo(x, y + radius.tl);
        ct.quadraticCurveTo(x, y, x + radius.tl, y);
        ct.closePath();
        if (fill) {
            ct.fill();
        }
        if (stroke) {
            ct.stroke();
        }
    }
    // ******************************************************************************************
})();