// https://developer.mozilla.org/en-US/docs/Games/Tutorials
// MDN docs used as a reference

// Select the canvas using querySelector

const canvas = document.querySelector("#board");

// Gives access to the canvas to "draw/create elements"
const ctx = canvas.getContext("2d");

//Load Images

// Loading audio, the src gives the source.
// let audioOne = new audio();
// audioOne.src = "./Images/audio.png";

// Setting variables for ./Images

// Loading ./Images as the object, the src gives the source.
// let image = new image();
// imageOne.src = "./Images/img.png";

let player = new Image();
player.src = "./Images/player.png";

let background = new Image();
background.src = "./Images/forest.png";

let foreground = new Image();
foreground.src = "./Images/fg2.png";

let obstacleOne = new Image();
obstacleOne.src = "./Images/obstacleOne.png";

let obstacleTwo = new Image();
obstacleTwo.src = "./Images/obstacleTwo.png";

// Set the score
let score = 0;

// Set spaceSpace the the width of the safe area to go through, the surface is the safe space plus the obstacle height = surface of the obstacles
let safeSpace = 400;
let surface = obstacleOne.height + safeSpace;

// Starting player position
let pX = 50;
let pY = 200;

// variable of gravity which always pushes the player down unless key is pressed

let gravity = 0.85;

// key to press to change player height
document.addEventListener("click", playerUp);

// move the player up 50px
function playerUp() {
	pY -= 50;
}

const obstacle = []; //Using an array to create the obstacles with push method
// start the array at index zero
obstacle[0] = {
	x: canvas.width,
	y: 0,
};

// Function to draw the ./Images
function startGame() {
	ctx.drawImage(background, 0, 0); // Drawing the background, 0 and 0 are X & Y coordinates

	for (var i = 0; i < obstacle.length; i++) {
		// ctx.drawImage(obstacleOne, 100, 0); //Drawing the north obstacle
		ctx.drawImage(obstacleOne, obstacle[i].x, obstacle[i].y);
		// ctx.drawImage(obstacleTwo, 100, 0 + constant); //Drawing the south obstacle, the pY is the obstacle height plus the "safe space"
		ctx.drawImage(obstacleTwo, obstacle[i].x, obstacle[i].y + surface);
		obstacle[i].x--; //moves the obstacle to the left
		// if this obstacle reaches that width push a new obstacle in the array
		if (obstacle[i].x == 200) {
			obstacle.push({
				x: canvas.width,
				// uses the math.foor/random function to generate a random height for the obstacle
				y: Math.floor(Math.random() * obstacleOne.height) - obstacleOne.height,
			});
		}
		if (
			(pX + player.width >= obstacle[i].x &&
				pX <= obstacle[i].x + obstacleOne.width &&
				(pY <= obstacle[i].y + obstacleOne.height ||
					pY + player.height >= obstacle[i].y + surface)) ||
			pY + player.height >= canvas.height - foreground.height
		) {
			// location.reload();
			alert("Game Over!" + " " + "Your score is" + " " + score + ".");
			cancelAnimationFrame();
		}
		// If the obstacle passes the player x coordinate, score goes up by 1!
		if (obstacle[i].x == 40) {
			score++;
		}
	}

	// let ground = canvas.height - foreground.height

	ctx.drawImage(foreground, 0, canvas.height - foreground.height);
	ctx.drawImage(player, pX, pY); //Drawing the player, pY is the height of the player from the "ceiling"
	pY += gravity; //The player character is always being pushed down by the gravity which will be a number change the player height constantly unless a key is pressed
	// Set the font of the score, the colour and position
	ctx.font = "80px Arial";
	ctx.fillStyle = "#FFFFFF";
	ctx.fillText(score, 220, 600);

	requestAnimationFrame(startGame); //animates the game, super important and was stuck on this because my ./Images was not showing up.
}

startGame();

// Rules
// game ends when the player's width or players coordinate is greater or equal to the obstacle x coordinate
// game ends when the player's width is less than or equal to the obstacle's width or x coordinate
// game ends when the player's height hits the obstacle height
// game ends when the player hits the surface which is the top or bottom surface of the obstacle
// game ends when the player hits the ground

// Things to do, add a end screen and start screen with score
// add cookies
// add maybe sounds and possibly random coins if I have time
