// Team : Ken Pao, Yuying Huang
// Class: ART 259
// Title: <tbd>
// P5JS link: <tbd>
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let cards = []; // Array to store card objects
let flipCds = []; // Array to track flipped cards (2 max)
let cardImages = []; // Array of card images
let rowSize = 4; // Row size
let colSize = 4; // Column size
let cardSize = 100; // Card size: 100px

function preload() {
  for (let i = 1; i < 9; i++) {
    cardImages.push(loadImage('image/card'+i+'.png')); // Load your card images
  }
}

function setup() {
  createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  shuffle(cardImages, true); // Shuffle the card images

  // Create card objects
  for (let i = 0; i < colSize; i++) {
    for (let j = 0; j < rowSize; j++) {
      let x = j * cardSize;
      let y = i * cardSize;
      let imgIndex = (i * rowSize + j) % cardImages.length;
      console.log('imgIndex',imgIndex);
      cards.push(new Card(x, y, cardSize, cardImages[imgIndex]));
    }
  }
  console.log(cards.length);
}

function draw() {
  background(220);
  for (let card of cards) {
    card.display();
    // console.log(card);
  }
}

function mousePressed() {
  for (let card of cards) {
    if (card.contains(mouseX, mouseY) && !card.flipped) {
      card.flip();
      flipCds.push(card);
      if (flipCds.length === 2) {
        if (flipCds[0].img === flipCds[1].img) {
          // Matched!
          console.log('match');
          flipCds = [];
        } else {
          // Not a match, flip back after a delay
          console.log('not match');
          setTimeout(() => {
            flipCds[0].flip();
            flipCds[1].flip();
            flipCds = [];
          }, 1000);
        }
      }
    }
  }
}

class Card {
  constructor(x, y, size, img) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.img = img;
    this.flipped = false;
  }

  display() {
    fill(255);
    rect(this.x, this.y, this.size, this.size);
    if (this.flipped) {
      image(this.img, this.x, this.y, this.size, this.size);
    }
  }

  contains(px, py) {
    return px > this.x && px < this.x + this.size && py > this.y && py < this.y + this.size;
  }

  flip() {
    this.flipped = !this.flipped;
  }
}
