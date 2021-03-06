const INITIAL_VELOCITY = 0.05;
const VERTICALITY_INCREMENT = 0.0001;
class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }

  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 || // de ball luon ban ve 2 phia cua nguoi choi
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, paddleRect) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;

    const rect = this.rect();
    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
      this.velocity += VERTICALITY_INCREMENT * delta;
    }
    if (paddleRect.some((e) => isCollision(e, rect))) {
      this.direction.x *= -1;
    }
  }
}

function isCollision(paddleRect, ballRect) {
  return (
    paddleRect.left <= ballRect.right &&
    paddleRect.right >= ballRect.left &&
    paddleRect.top <= ballRect.bottom &&
    paddleRect.bottom >= ballRect.top
  );
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
