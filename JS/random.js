function randomGame() {
	let myRandomGame = Math.round(Math.random() * 3);
	const randomGame = [];
	randomGame[0] = "game1.html";
	randomGame[1] = "game2.html";
	randomGame[2] = "game3.html";
	randomGame[3] = "game4.html";
	window.location = randomGame[myRandomGame];
}

let randomBtn = document.querySelector(".logo");

randomBtn.addEventListener("click", randomGame);
