(() => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext(`2d`);

    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    let rectSize = 30;

    let gameOver = false;
    let food = [];

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    let name = getCookie('name');
    let record = getCookie('score_game2');
    if (record != undefined) {
        record = parseInt(record);
    } else {
        record = 0;
    }

    // ******************************************************************************************
    class Snake {
        constructor() {
            this.n = 3;
            this.step = 0.002;
            this.r = 0.01;
            this.x = [0.13 + this.r * 4, 0.13 + this.r * 2, 0.13];
            this.y = [0.5, 0.5, 0.5];
            this.dx = this.step;
            this.dy = 0;
            this.color = "#208020";
        }
        draw() {
            for (let i = 0; i < this.n; i++) {
                createCircle(this.x[i] * w, this.y[i] * h, this.r * w, true, this.color);
            }
        }
    };
    // ******************************************************************************************
    let snake = new Snake();
    // ******************************************************************************************
    class Food {
        constructor() {
            this.x = 0;
            this.y = 0;
            this.r = snake.r;
            let rr = this.r * this.r * 4;
            while (true) {
                this.x = this.r + Math.random() * (1 - this.r * 2);
                this.y = this.r * w / h + Math.random() * (1 - this.r * 2 * w / h);
                let i = 0;
                for (; i < snake.n; i++) {
                    let dx = snake.x[i] - this.x;
                    let dy = snake.y[i] - this.y;
                    if ((dx * dx + dy * dy) < rr) {
                        continue;
                    }
                }
                if (i == snake.n) {
                    break;
                }
            }
            // this.R = Math.floor(127 + Math.random() * (128)).toString(10);
            // this.G = Math.floor(127 + Math.random() * (128)).toString(10);
            // this.B = Math.floor(127 + Math.random() * (128)).toString(10);
            // this.color = 'rgba(' + this.R + ' , ' + this.G + ' , ' + this.B + ', 1)';
            this.color = "#ff4080";
        }

        draw() {
            createCircle(this.x * w, this.y * h, this.r * w, true, this.color);
        }
    }

    food[0] = new Food();
    food[1] = new Food();
    food[2] = new Food();

    // ******************************************************************************************
    function createCircle(x, y, rad, fill, color) {
        ctx.fillStyle = ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.closePath();
        fill ? ctx.fill() : ctx.stroke();
    }
    // ******************************************************************************************
    function init() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        ctx.font = (0.03 * w).toFixed(1).toString() + "px 'Indie Flower', cursive";
        ctx.textAlign = "left";
    }
    // ******************************************************************************************
    function resize() {
        w = canvas.width = innerWidth;
        h = canvas.height = innerHeight;
        ctx.font = (0.03 * w).toFixed(1).toString() + "px 'Indie Flower', cursive";
    }
    // ******************************************************************************************
    function reDraw() {
        for (let i = 0; i < food.length; i++) {
            food[i].draw();
        }
        snake.draw();
        ctx.fillStyle = "#2040AA90";
        ctx.fillText('Score: ' + (snake.n - 3).toString(), 0.85 * w, 0.05 * h);
        if (gameOver) {
            let k = w / h;
            ctx.fillStyle = '#40804080';
            ctx.strokeStyle = '#408040FF';
            ctx.lineWidth = rectSize / 30;
            roundRect(ctx, w / 2 - rectSize / 2, h / 2 - 0.5 * rectSize / k, rectSize, rectSize / k, rectSize / 15, true, true);
            ctx.fillStyle = "#AAAAFFFF";
            ctx.textAlign = "center";
            ctx.font = (0.15 * rectSize).toFixed(1).toString() + "px 'Indie Flower', cursive";
            ctx.fillText('Game Over', w / 2, h / 2);
            ctx.font = (0.10 * rectSize).toFixed(1).toString() + "px 'Indie Flower', cursive";

            ctx.fillText('Your score: ' + (snake.n - 3).toString(), w / 2, h / 2 + rectSize * 0.1);

            ctx.font = (0.02 * w).toFixed(1).toString() + "px 'Indie Flower', cursive";
            ctx.textAlign = "left";
            rectSize *= 1.01;
            if (rectSize > 2 * w) {
                gameOver = false;
                delete snake;
                snake = new Snake();
                rectSize = 30;
            }
        }
        ctx.fillStyle = '#0080B0FF';
        roundRect(ctx, 0.93 * w, 0.009 * w, 0.06 * w, 0.02 * w, 0.002 * w, true, false);
        ctx.fillStyle = "#AAAAFFFF";
        ctx.textAlign = "center";
        ctx.font = (0.02 * w).toFixed(1).toString() + "px 'Indie Flower', cursive";
        ctx.fillText('Home', 0.96 * w, 0.025 * w);
        ctx.textAlign = "left";
        ctx.fillStyle = "#000050FF";
        if (name != undefined) {
            ctx.fillText('Hello ' + name + ", Your record: " + record.toString(), 0.3 * w, 0.025 * w);
        }

    }
    // ******************************************************************************************
    function loop() {
        ctx.fillStyle = "#80FF90FF";
        ctx.fillRect(0, 0, w, h);
        if (!gameOver) {
            snake.x[0] += snake.dx;
            snake.y[0] += snake.dy;
            let rr = snake.r * w;
            for (let i = 1; i < snake.n; i++) {
                let x0 = snake.x[i - 1] * w;
                let y0 = snake.y[i - 1] * h;
                let x1 = snake.x[i] * w;
                let y1 = snake.y[i] * h;
                let dx = x1 - x0;
                let dy = y1 - y0;
                let r1 = Math.sqrt(dx * dx + dy * dy);
                let k = (rr * 2) / r1;
                snake.x[i] = k * dx / w + snake.x[i - 1];
                snake.y[i] = k * dy / h + snake.y[i - 1];
            }
            let x0 = snake.x[0] * w;
            let y0 = snake.y[0] * h;
            let rrr = rr * rr * 3;
            for (let i = 0; i < food.length; i++) {
                let dx = food[i].x * w - x0;
                let dy = food[i].y * h - y0;
                if ((dx * dx + dy * dy) < rrr) {
                    snake.x.splice(0, 0, snake.x[0] + 2 * snake.r * snake.dx / snake.step);
                    snake.y.splice(0, 0, snake.y[0] + 2 * snake.r * snake.dy / (snake.step));
                    snake.n++;
                    food.splice(i, 1);
                    food[2] = new Food();
                    break;
                }
            }
            x0 = snake.x[0] * w;
            y0 = snake.y[0] * h;
            if (x0 < 0 || x0 > w || y0 < 0 || y0 > h) {
                gameOver = true;
            }

            for (let i = 1; i < snake.n; i++) {
                let dx = snake.x[i] * w - x0;
                let dy = snake.y[i] * h - y0;
                if ((dx * dx + dy * dy) < rrr) {
                    gameOver = true;
                    break;
                }
            }
            if (gameOver) {
                if (name != undefined) {
                    let maxscore = getCookie('score_game2');
                    if (maxscore != undefined) {
                        if ((snake.n-3) > parseInt(maxscore)) {
                            document.cookie = "score_game2=" + (snake.n-3).toString() + ";max-age=1e7";
                            record = (snake.n-3);
                        }
                    } else {
                        document.cookie = "score_game2=" + (snake.n-3).toString() + ";max-age=1e7";
                        record = (snake.n-3);
                    }
                };
            }
        }
        reDraw();
        window.requestAnimationFrame(loop);
    }
    // ******************************************************************************************
    document.onkeydown = function (event) {
        const key = event.key;
        if (key != "ArrowRight" && key != "ArrowLeft" &&
            key != "ArrowUp" && key != "ArrowDown") return;
        snake.dy = 0;
        snake.dx = 0;
        let k1 = w / h;
        if (key == "ArrowRight") {
            snake.dx = snake.step;
        } else
            if (key == "ArrowLeft") {
                snake.dx = -snake.step;
            } else
                if (key == "ArrowDown") {
                    snake.dy = k1 * snake.step;
                } else {
                    snake.dy = -k1 * snake.step;
                }
    };

    window.addEventListener("resize", resize);
    canvas.addEventListener("click", (event) => {
        let x = event.layerX;
        let y = event.layerY;
        if (x > 0.93 * w && x < 0.99 * w && y > 0.009 * w && y < 0.029 * w) {
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

