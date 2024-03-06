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
let cardSize; // Card size
let level;
let gameTime, startTime, levelTime;
let startBtn;
let gameStart;
let score;
let cardRemain;

function preload() {
  for (let i = 0; i < 10; i++) {
    cardImages.push(loadImage('image/card'+i+'.png')); // Load all card images
  }
  backImage = loadImage('image/bunny100.png');
}

function setup() {
  
  level = {
    row: 4,
    col: 5
  };
  cardRemain = level.row * level.col;
  for (let x = 0; x < cardRemain; x++){
    levelImages.push(cardImages[x % cardImages.length]);
  }
  shuffle(levelImages, true);
  cardSize = {
    w:100,
    h:150
  }

  space = 20;
  // no Stroke for cards
  noStroke();
  // 0.5 row space for header
  createCanvas(space + level.col*(cardSize.w + space), (level.row + 0.5)*(cardSize.h + space));
  // level depends on row and column size
  // adjust how many card images involved per level

  startBtn = new Sprite(width*0.5, height*0.5, 100, 's');
  // startBtn.color = 'lime';
  startBtn.textSize = 26;
  startBtn.text = 'START';
  gameStart = false;
  levelTime = 60;
  score = 0;

  // Create new card objects
  for (let i = 0; i < level.col; i++) {
    for (let j = 0; j < level.row; j++) {
      let x = i * (cardSize.w + space) + space;
      let y = (j + 0.5) * (cardSize.h + space);
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
      startBtn.color = 'lime';
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
        cardRemain--;
        flipCards.push(card);
        if (flipCards.length === 2) {
          if (flipCards[0].img === flipCards[1].img) {
            // Match section
            // console.log('match');
            score += 100;
            flipCards = [];
          } else {
            // Not a match, flip back after a delay of 0.2 second
            // console.log('not match');
            setTimeout(() => {
              flipCards[0].flip();
              flipCards[1].flip();
              cardRemain += 2;
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
    this.w = size.w;
    this.h = size.h;
    this.img = img;
    this.flipped = false; // false = face down
  }

  // show card image
  display() {
    rect(this.x, this.y, this.w, this.h);
    if (this.flipped) {
      image(this.img, this.x, this.y, this.w, this.h);
    } else {
      image(backImage, this.x, this.y, this.w, this.h);
    }
  }

  // check if mouse is 'hover' within each card area
  hovers(px, py) {
    return px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h;
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