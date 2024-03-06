// Team : Ken Pao, Yuying Huang
// Class: ART 259
// Title: <tbd>
// P5JS link: <tbd>
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let cards = []; // Array to store card objects
let flippedCards = []; // Array to track flipped cards
let cardImages = []; // Array of card images (you can replace these with your own images)
let gridSize = 4; // Grid size (4x4 in this example)
let cardSize = 200; // Card size (adjust as needed)

function preload() {
  for (let i = 0; i < gridSize * gridSize / 2; i++) {
    cardImages.push(loadImage('image/card'+i+'.png')); // Load your card images (e.g., card0.png, card1.png, etc.)
  }
}

function setup() {
  createCanvas(1000, 1000);
  shuffle(cardImages, true); // Shuffle the card images
  console.log(cardImages);

  // Create card objects
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = j * cardSize;
      let y = i * cardSize;
      let imgIndex = i * gridSize + j;
      console.log('imgIndex',imgIndex);
      cards.push(new Card(x, y, cardSize, cardImages[imgIndex]));
    }
  }
  console.log(cards);
}

function draw() {
  background(220);
  for (let card of cards) {
    card.display();
    console.log(card);
  }
}

function mousePressed() {
  for (let card of cards) {
    if (card.contains(mouseX, mouseY) && !card.flipped) {
      card.flip();
      flippedCards.push(card);
      if (flippedCards.length === 2) {
        if (flippedCards[0].img === flippedCards[1].img) {
          // Matched!
          flippedCards = [];
        } else {
          // Not a match, flip back after a delay
          setTimeout(() => {
            flippedCards[0].flip();
            flippedCards[1].flip();
            flippedCards = [];
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
