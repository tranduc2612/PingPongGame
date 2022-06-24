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
const gameMenu = document.querySelector(".game__menu");
let isPlayComputer = false;

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
  window.requestAnimationFrame(gameLoop);
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

// ------------------------ Adding Event Listeners ------------------------
function handleEventComputer() {
  document.addEventListener("mousemove", (e) => {
    playerPaddle.position = (e.y / window.innerHeight) * 100;
  });
}

function handleEventPvP() {
  const paddleSpeedPlayer = 6;

  addEventListener("keydown", (event) => {
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
  });

  addEventListener("keyup", (event) => {
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
  });
}

// ---------Game mode------------

// play with computer
playerVComputerButton.addEventListener("click", () => {
  isPlayComputer = true;
  gameMenu.classList.add("disabled");
  handleEventComputer();
  window.requestAnimationFrame(gameLoop);
});

// play with player
playerVPlayerButton.addEventListener("click", () => {
  isPlayComputer = false;
  gameMenu.classList.add("disabled");
  handleEventPvP();
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
