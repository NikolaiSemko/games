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

    function createCircle2(x, y, r, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.filter = "blur(2px)";
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        //ctx.closePath();
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
        ctx.font = (0.001 * w).toFixed(1).toString() + "vw Turret Road";
        ctx.textAlign = "left";
    }
    function resize() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        ctx.font = (0.001 * w).toFixed(1).toString() + "vw Turret Road";
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
                    ctx.fillStyle = "#FF0080FF";
                    ctx.textAlign = "center";
                    ctx.font = (0.004 * w).toFixed(1).toString() + "vw Turret Road";
                    ctx.fillText('Game Over', w / 2, h / 2);
                    ctx.font = (0.001 * w).toFixed(1).toString() + "vw Turret Road";
                    ctx.textAlign = "left";

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
        ctx.fillStyle = "#FFFF80FF";
        ctx.fillText('Score: ' + score.toString(), 0.85 * w, 0.05 * h);
        ctx.fillText('Power: ' + ((1.1 - coef) * 100.0).toFixed(1).toString() + "%", 0.85 * w, 0.1 * h);
        ctx.fillText('Life: ' + life.toString() + "%", 0.85 * w, 0.15 * h);

    }
    function loop() {
        if (gameOver) return;
        ctx.fillStyle = "#000040FF";
        ctx.fillRect(0, 0, w, h);
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
        reDraw();
        window.requestAnimationFrame(loop);
    }

    canvas.addEventListener('mousemove', rotateShip);
    window.addEventListener("resize", resize);

    init();
    loop();

})();
