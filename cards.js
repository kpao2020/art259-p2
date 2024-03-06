// Team : Ken Pao, Yuying Huang
// Class: ART 259
// Title: <tbd>
// P5JS link: <tbd>
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let cards = []; // Array to store card objects
let flipCards = []; // Array to track flipped cards (2 max)
let cardImages = []; // Array of card images
let levelImages = []; // Array of images for each level
let backImage; // Back of card image
let rowSize; // Row size
let colSize; // Column size
let cardSize; // Card size
let gameTime, startTime, levelTime;
let startBtn;
let gameStart;
let score;
let cardRemain;
let level;

function preload() {
  for (let i = 0; i < 10; i++) {
    cardImages.push(loadImage('image/card'+i+'.png')); // Load all card images
  }
  backImage = loadImage('image/bunny100.png');
}

function setup() {
  
  rowSize = 4;
  colSize = 5;
  level = {
    row: rowSize,
    col: colSize
  };
  cardRemain = rowSize * colSize;
  for (let x = 0; x < cardRemain; x++){
    levelImages.push(cardImages[x % cardImages.length]);
  }
  shuffle(levelImages, true);
  cardSize = 100;
  space = 10;
  // no Stroke for cards
  noStroke();
  // 0.5 row space for header
  createCanvas(space + colSize*(cardSize + space), (level.row + 0.5)*(cardSize + space));
  // level depends on row and column size
  // adjust how many card images involved per level

  startBtn = new Sprite(width/2,height*0.45,100,'s');
  startBtn.color = 'aqua';
  startBtn.textSize = 26;
  startBtn.text = 'START';
  gameStart = false;
  levelTime = 20;
  score = 0;

  // Create new card objects
  for (let i = 0; i < level.col; i++) {
    for (let j = 0; j < level.row; j++) {
      let x = i * (cardSize + space) + space;
      let y = (j + 0.5) * (cardSize + space);
      let imgIndex = i * level.row + j;
      cards.push(new Card(x, y, cardSize, levelImages[imgIndex]));
    }
  }
}

function draw() {
  clear();
  background('lightyellow');
  topBar(); // display header info

  ///// start the game and timer /////
  if (startBtn.mouse.hovering()){
      startBtn.color = 'yellow';
  } else {
      startBtn.color = 'aqua';
  }
  
  if (startBtn.mouse.presses()) {
      gameStart = true;
      startTime = millis();
      startBtn.visible = false;
      startBtn.collider = 'n';
  }

  // Game Start section
  if (gameStart){

    // Winning condition => no more cards left
    if (cardRemain == 0){
      cards =[]; // clear card deck
      text('You Win!',width/2, height/2);
    } else {
      for (let card of cards) {
        card.display();
      }
    }
  } else {
    resetGame();
  }
}

function mousePressed() {
  if (gameStart){ // only allow flip when game starts
    for (let card of cards) {
      if (card.hovers(mouseX, mouseY) && !card.flipped) {
        card.flip();
        flipCards.push(card);
        if (flipCards.length === 2) {
          if (flipCards[0].img === flipCards[1].img) {
            // Match section
            // console.log('match');
            cardRemain -= 2;
            score += 100;
            flipCards = [];
          } else {
            // Not a match, flip back after a delay of 0.2 second
            // console.log('not match');
            setTimeout(() => {
              flipCards[0].flip();
              flipCards[1].flip();
              flipCards = [];
              if (score > 0){
                score -= 50;
              }
            }, 200);
          }
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
    this.flipped = false; // false = face down
  }

  // show card image
  display() {
    rect(this.x, this.y, this.size, this.size);
    if (this.flipped) {
      image(this.img, this.x, this.y, this.size, this.size);
    } else {
      image(backImage, this.x, this.y, this.size, this.size);
    }
  }

  // check if mouse is 'hover' within each card area
  hovers(px, py) {
    return px > this.x && px < this.x + this.size && py > this.y && py < this.y + this.size;
  }

  // flip state
  flip() {
    this.flipped = !this.flipped;
  }
}

function topBar(){
  textSize(25);
  fill('blue');
  textAlign(CENTER);

  ///// timer function /////
  gameTime = levelTime - round((millis()-startTime)/1000);

  ///// Start game time when click Start /////
  if (gameStart){

    text('Cards: '+cardRemain.toString(),width*0.15,height*0.07);
    text('Score: '+score.toString(),width*0.5,height*0.07);

    ///// prevent time to run over 0 /////
    if (gameTime > 0) {
      text('Time : '+gameTime.toString(), width*0.85, height*0.07);
    }
    ///// stop game when time reaches 0 /////
    else {
      text('Time : 0',width*0.85,height*0.07);
      gameStart = false;
    }
  }
}

function resetGame(){
  startBtn.visible = true;
  startBtn.collider = 's';
}