let bubbles = []; // Array to store bubbles
let shooterX; // X-coordinate of the shooter
let shooterY; // Y-coordinate of the shooter

function setup() {
  createCanvas(800, 600);
  shooterX = width / 2;
  shooterY = height - 20;
}

function draw() {
  background(220);

  // Display shooter
  fill(255);
  ellipse(shooterX, shooterY, 40);

  // Display bubbles
  for (let bubble of bubbles) {
    bubble.display();
    bubble.update();
  }
}

function mousePressed() {
  // Create a new bubble at the shooter position
  let bubble = new Bubble(shooterX, shooterY);
  bubbles.push(bubble);
}

class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.color = color(random(255), random(255), random(255));
    this.speed = 2;
  }

  display() {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  }

  update() {
    // Move the bubble upward
    this.y -= this.speed;
  }
}
