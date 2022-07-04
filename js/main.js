const player1 = document.getElementById("player__paddle");
const player2 = document.getElementById("computer__paddle");
const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(player1);
const computerPaddle = new Paddle(player2);
const playerScore = document.getElementById("player__score");
const computerScore = document.getElementById("computer__score");
const button = document.querySelectorAll(".button");
const playerVComputerButton = document.getElementById("button__computer");
const playerVPlayerButton = document.getElementById("button__player");
const howToPlayButton = document.getElementById("button__how-to-play");
const howToPlayTitle = document.querySelector(".how__to__play");
const closeButton = document.querySelector(".close-container");
const gameMenuStart = document.querySelector(".game__menu-start");
const gameMenuEnd = document.querySelector(".game__menu-end");
const btnPlayAgain = document.getElementById("button__replay");
const btnBackToMenu = document.getElementById("button__back-menu");
const titleNotify = document.querySelector(".notification");
let isPlayAgain = false;
let isBackToMenu = false;
let isPlayComputer = false;
const pointTarget = 3;
let keys = {
  w: false,
  s: false,
  i: false,
  k: false,
};

let lastTime;

// ------------------------ Game Loop ------------------------
function gameLoop(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()]);

    if (isPlayComputer) {
      computerPaddle.update(delta, ball.y);
    }
    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );

    document.documentElement.style.setProperty("--hue", hue + delta * 0.01);
    if (isLose()) {
      handleLose();
    }
  }
  lastTime = time;
  handleEndGame(
    playerScore.textContent,
    computerScore.textContent,
    isPlayComputer
  );
}

// ------------------------ Count Point ------------------------
function isLose() {
  const rect = ball.rect();
  return rect.right >= window.innerWidth || rect.left <= 0;
}

function handleLose() {
  const rect = ball.rect();
  if (rect.right >= window.innerWidth) {
    playerScore.textContent = parseInt(playerScore.textContent) + 1;
  } else {
    computerScore.textContent = parseInt(computerScore.textContent) + 1;
  }

  ball.reset();
  if (isPlayComputer) {
    computerPaddle.reset();
  }
}

function handleEndGame(pointP1, pointP2, isComputer) {
  if (pointP1 == pointTarget || pointP2 == pointTarget) {
    gameMenuEnd.classList.remove("disabled");
    if (isPlayAgain) {
      gameMenuEnd.classList.add("disabled");
      isPlayAgain = false;
      window.requestAnimationFrame(gameLoop);
    }
    if (isBackToMenu) {
      gameMenuEnd.classList.add("disabled");
      gameMenuStart.classList.remove("disabled");
    }
    if (isComputer) {
      removeEventMoveMouse();
      showNotifications("Player Win !", "Computer Win !", pointP1, pointP2);
    } else {
      removeEventPvP();
      showNotifications("Player 1 Win !", "Player 2 Win !", pointP1, pointP2);
    }
  } else {
    window.requestAnimationFrame(gameLoop);
  }
}

function showNotifications(context1, context2, p1, p2) {
  if (p1 == pointTarget) {
    titleNotify.textContent = context1;
  } else if (p2 == pointTarget) {
    titleNotify.textContent = context2;
  }
}

function showEndGameForm() {
  playerScore.textContent = 0;
  computerScore.textContent = 0;
  gameMenuEnd.classList.add("disabled");
}

// ------------------------ Adding Event Listeners ------------------------
function addEventMoveMouse() {
  document.addEventListener("mousemove", handleMouseMovePaddle);
}

function removeEventMoveMouse() {
  document.removeEventListener("mousemove", handleMouseMovePaddle);
}

function handleMouseMovePaddle(e) {
  playerPaddle.position = (e.y / window.innerHeight) * 100;
}

function handleEventKeyDown(event) {
  const paddleSpeedPlayer = 6;

  if (event.key === "w") {
    keys.w = true;
  }
  if (event.key === "s") {
    keys.s = true;
  }
  if (event.key === "i") {
    keys.i = true;
  }
  if (event.key === "k") {
    keys.k = true;
  }

  if (keys.w && keys.i) {
    // ca 2 cung len
    playerPaddle.position -= paddleSpeedPlayer;
    computerPaddle.position -= paddleSpeedPlayer;
  } else if (keys.s && keys.k) {
    // ca 2 cung xuong
    playerPaddle.position += paddleSpeedPlayer;
    computerPaddle.position += paddleSpeedPlayer;
  } else if (keys.w && keys.k) {
    // player 1 len va player 2 xuong
    playerPaddle.position -= paddleSpeedPlayer;
    computerPaddle.position += paddleSpeedPlayer;
  } else if (keys.s && keys.i) {
    // player 1 xuong va player 2 len
    playerPaddle.position += paddleSpeedPlayer;
    computerPaddle.position -= paddleSpeedPlayer;
  } else if (keys.w) {
    // player 1 di len
    playerPaddle.position -= paddleSpeedPlayer;
  } else if (keys.s) {
    //player 1 di xuong
    playerPaddle.position += paddleSpeedPlayer;
  } else if (keys.i) {
    //player 2 di len
    computerPaddle.position -= paddleSpeedPlayer;
  } else if (keys.k) {
    //play 2 di xuong
    computerPaddle.position += paddleSpeedPlayer;
  }
}

function handleEventKeyUp(event) {
  if (event.key === "w") {
    keys.w = false;
  }
  if (event.key === "s") {
    keys.s = false;
  }
  if (event.key === "i") {
    keys.i = false;
  }
  if (event.key === "k") {
    keys.k = false;
  }
}

function addEventPvP() {
  addEventListener("keydown", handleEventKeyDown);
  addEventListener("keyup", handleEventKeyUp);
}

function removeEventPvP() {
  removeEventListener("keydown", handleEventKeyDown);
  removeEventListener("keyup", handleEventKeyUp);
}

// ---------Game mode------------

// play with computer
playerVComputerButton.addEventListener("click", () => {
  isPlayComputer = true;
  gameMenuStart.classList.add("disabled");
  addEventMoveMouse();
  window.requestAnimationFrame(gameLoop);
});

// play with player
playerVPlayerButton.addEventListener("click", () => {
  isPlayComputer = false;
  gameMenuStart.classList.add("disabled");
  addEventPvP();
  window.requestAnimationFrame(gameLoop);
});
// ---------How to play------------

// close button
howToPlayButton.addEventListener("click", () => {
  button.forEach((e) => {
    e.classList.add("disabled");
  });
  howToPlayTitle.classList.remove("disabled");
  closeButton.classList.remove("disabled");
});

closeButton.addEventListener("click", () => {
  closeButton.classList.add("disabled");
  howToPlayTitle.classList.add("disabled");
  button.forEach((e) => {
    e.classList.remove("disabled");
  });
});

//Play Again

btnPlayAgain.addEventListener("click", () => {
  showEndGameForm();
  window.requestAnimationFrame(gameLoop);
  isPlayAgain = true;
  ball.reset();
  if (isPlayComputer) {
    addEventMoveMouse();
  } else {
    addEventPvP();
  }
});

btnBackToMenu.addEventListener("click", () => {
  showEndGameForm();
  isPlayComputer = false;
  gameMenuStart.classList.remove("disabled");
  isBackToMenu = true;
});
