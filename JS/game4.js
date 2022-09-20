// https://developer.mozilla.org/en-US/docs/Games/Tutorials
// MDN docs used as a reference

// Select the canvas using querySelector

const canvas = document.querySelector("#board");

// Gives access to the canvas to "draw/create elements"
const ctx = canvas.getContext("2d");

//Start game ui
const startBtn = document.querySelector("#startBtn");
const resetBtn = document.querySelector("resetBtn");
const gameuiEl = document.querySelector("#game-ui");

// Loading images as the object, the src gives the source. Images already have pre-determined widths and heights but can be changed below.
// https://icons8.com/icons/set/game for the player sprite
// https://www.shutterstock.com/image-vector/pixel-background-forest-games-mobile-applications-726397486 for the background art

let player = new Image();
player.src = "images/player.png";

let background = new Image();
background.src = "images/forest.png";

let foreground = new Image();
foreground.src = "images/fg2.png";

let obstacleOne = new Image();
obstacleOne.src = "images/obstacleOne.png";

let obstacleTwo = new Image();
obstacleTwo.src = "images/obstacleTwo.png";

// Set the score and display it in HTML
const scoreEl = document.querySelector("#scoreEl");
let score = 0;

// Set spaceSpace the the width of the safe area to go through, the surface is the safe space plus the obstacle height = surface of the obstacles
let safeSpace = 400;
let surface = obstacleOne.height + safeSpace;

// Starting player position
let pX = 10;
let pY = 200;

// variable of gravity which always pushes the player down unless key is pressed

let gravity = 0.85;

// key to press to change player height
document.addEventListener("click", playerUp);

// move the player up 50px
function playerUp() {
	pY -= 50;
}

let obstacle = []; //Using an array to create the obstacles with push method
// start the array at index zero
obstacle[0] = {
	x: canvas.width,
	y: 0,
};

// Function to draw the images
function startGame() {
	// animates the game
	let animationStart = requestAnimationFrame(startGame);
	// document.querySelector("#start").style.visibility = "hidden";
	ctx.drawImage(background, 0, 0); // Drawing the background, 0 and 0 are X & Y coordinates

	for (var i = 0; i < obstacle.length; i++) {
		// ctx.drawImage(obstacleOne, 100, 0); //Drawing the north obstacle
		ctx.drawImage(obstacleOne, obstacle[i].x, obstacle[i].y);
		// ctx.drawImage(obstacleTwo, 100, 0 + constant); //Drawing the south obstacle, the pY is the obstacle height plus the "safe space"
		ctx.drawImage(obstacleTwo, obstacle[i].x, obstacle[i].y + surface);
		obstacle[i].x--; //moves the obstacle to the left
		// if this obstacle reaches that width push a new obstacle in the array, higher numbers makes the game more difficult as it decreases the space before the next obstacle
		if (obstacle[i].x == 275) {
			obstacle.push({
				x: canvas.width,
				// uses the math.foor/random function to generate a random height for the obstacle
				y: Math.floor(Math.random() * obstacleOne.height) - obstacleOne.height,
			});
		}
		// Rules
		// game ends when the player's width or players coordinate is greater or equal to the obstacle x coordinate
		// game ends when the player's width is less than or equal to the obstacle's width or x coordinate
		// game ends when the player's height hits the obstacle height
		// game ends when the player hits the surface which is the top or bottom surface of the obstacle
		// game ends when the player hits the ground
		if (
			(pX + player.width >= obstacle[i].x &&
				pX <= obstacle[i].x + obstacleOne.width &&
				(pY <= obstacle[i].y + obstacleOne.height ||
					pY + player.height >= obstacle[i].y + surface)) ||
			pY + player.height >= canvas.height - foreground.height
		) {
			// location.reload();
			// alert("Game Over!" + " " + "Your score is" + " " + score + ".");
			// Game over!
			// cancels the animation
			cancelAnimationFrame(animationStart);
			gameuiEl.style.display = "flex";
		}
		// If the obstacle passes the player x coordinate, score goes up by 1!
		if (obstacle[i].x == 40) {
			score++;
			scoreEl.innerHTML = score;
		}
	}

	// let ground = canvas.height - foreground.height;

	ctx.drawImage(foreground, 0, canvas.height - foreground.height);
	ctx.drawImage(player, pX, pY, 40, 40); //Drawing the player, pY is the height of the player from the "ceiling", 40 and 40 are w and h
	pY += gravity; //The player character is always being pushed down by the gravity which will be a number change the player height constantly unless a key is pressed
}
// Start game button becomes restart as well, added a sessionstorage key to identify if it is started properly
let isStarted = false;

window.onload = function () {
	let reloading = sessionStorage.getItem("reloading");
	if (reloading) {
		sessionStorage.removeItem("reloading");
		document.getElementById("startBtn").click();
	}
};

function reloadPage() {
	sessionStorage.setItem("reloading", "true");
	document.location.reload();
}

startBtn.addEventListener("click", () => {
	if (isStarted) {
		reloadPage();
	} else {
		startGame();
		isStarted = true;
	}
	gameuiEl.style.display = "none";
});
