const SPEED = 0.02;

class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }

  set position(value) {
    if (value < 100 && value > 0) {
      this.paddleElem.style.setProperty("--position", value);
    }
  }

  reset() {
    this.position = 50;
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  update(delta, yBall) {
    this.position += SPEED * delta * (yBall - this.position);
  }
}
