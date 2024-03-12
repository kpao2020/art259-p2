// Team : Ken Pao, Yuying Huang
// Class: ART 259
// Project 2
// Title: <tbd>
// Game link: <tbd>
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

let cards = []; // Array to store card objects
let flipCards = []; // Array to track flipped cards (2 max)
let cardImages = []; // Array of card images
let levelImages = []; // Array of images for each level
let backImage; // Back of card image
let cardSize; // Card size based on device screen
let space; // Spacer between cards
let level; // level grid
let gameTime, startTime, levelTime; // Timing variables
let startBtn, levelBtn; // Start Button
let gameStart; // Game Start state = true or false
let score; // Keep track of score
let cardRemain; // Keep track of remaining cards
let balls, ballImages=[]; // End Game animation
let endMessage; // Display end game message
let allowFlip; // Flip control state
let carrots, carrotImages=[]; // Start page animation
let bunny, bunnyImage; // Win page image


function preload() {
  for (let i = 1; i < 21; i++) {
    // Load all card images
    cardImages.push(loadImage('image/bunny'+i+'.png')); 
  }

  for (let j = 1; j < 3; j++) {
    // load carrot animation images
    carrotImages.push(loadImage('image/carrotmove'+j+'.png')); 
  }

  for (let k = 1; k < 6; k++){
  ballImages.push(loadImage('image/ball'+k+'.png'));
  }

  backImage = loadImage('image/bunnyBack.png');
  bunnyImage = loadImage('image/win.png');
}

function setup() {
  createCanvas(windowWidth*0.9, windowHeight*0.9);

  // initialize level 1 parameters
  level = {
    l: 1,
    row: 4,
    col: 5
  };
  space = 20;

  // no Stroke for cards
  noStroke();

  balls = new Group();
  balls.x = width*0.58; // animation test: ball.x = () => random(width*0.2, width*0.8);
  balls.y = height*0.7; // animation test: ball.y = () => random(height*0.5, height*0.8);
  balls.d = 5;
  balls.collider = 'none';
	balls.direction = () => random(0, 360);
	balls.speed = 2;
  balls.visible = false;
  balls.life = 100;

  carrots = new Group();
  carrots.addAnimation('wiggle', carrotImages[0], carrotImages[1]);
  carrots.scale = 0.1;
  carrots.x = () => random(width*0.1, width*0.9);
  carrots.y = () => random(height*0.2, height*0.9);
  carrots.rotation = 0;
  carrots.rotationlock = true;
  carrots.visible = true;
  carrots.collider = 'n';
  carrots.life = 120;

  bunny = new Sprite(width*0.5, height*0.85, 1, 'n');
  bunny.img = bunnyImage;
  bunny.visible = false;

  startBtn = new Sprite(width*0.5, height*0.5, 150, 's');
  startBtn.textSize = 28;
  startBtn.text = 'START';

  levelBtn = new Sprite(width*0.85, height*0.85, 200, 100, 'n');
  levelBtn.textSize = 28;
  
  levelBtn.color = 'lime';
  levelBtn.visible = false;

  gameStart = false;
  allowFlip = false;
  
  endMessage = new Sprite(width*0.5, height*0.3, 1, 'n');
  endMessage.color = 'lightyellow';
  endMessage.textSize = 50;
  endMessage.textColor = 'red';
  endMessage.visible = false;
}

function draw() {
  clear();
  background('lightyellow');

  if (keyIsDown(76)){
    levelBtn.visible = true;
    levelBtn.collider = 's';
    levelBtn.text = 'Secret Skip'
  } 

  // Start page animation
  if (carrots.visible){
    if (carrots.length < 3){
      new carrots.Sprite();
    }
  } else {
    carrots.removeAll();
  }

  topBar(); // display header info

  ///// start the game and timer /////
  if (startBtn.mouse.hovering()){
    startBtn.color = 'yellow';
    cursor(HAND);
  } else {
    startBtn.color = 'lime';
    cursor(ARROW);
  }
  
  if (startBtn.mouse.presses()) {
    gameStart = true;
    allowFlip = true;
    endMessage.visible = false;
    carrots.visible = false;
    startBtn.visible = false;
    startBtn.collider = 'n';
    createLevel(level);
    startTime = millis();
  }

  ///// Next Level /////
  if (levelBtn.mouse.hovering()){
    levelBtn.color = 'yellow';
    cursor(HAND);
  } else {
    levelBtn.color = 'lime';
    cursor(ARROW);
  }

  if (levelBtn.mouse.presses()){
    gameStart = true;
    allowFlip = true;
    bunny.visible = false; // this only applies to winning 
    balls.visible = false; // this only applies to winning
    endMessage.visible = false;
    carrots.visible = false;
    levelBtn.visible = false;
    levelBtn.collider = 'n';
    if (level.l < 3){
      level.l++;
    }
    createLevel(level);
    startTime = millis();
  }

  // Winning animation
  if (balls.visible){
    if (balls.length < 20){
      let ball = new balls.Sprite();
      ball.color = color(random(255),random(255),random(255));
      // animation test: ball.img = ballImages[round(random(4))];
    }
  } else {
    balls.removeAll();
  }

  // Game Start section
  if (gameStart){
    // Winning condition => no more cards left
    // if (cardRemain == 0){
    //   winGame();
    // } else {
      fill('black'); // set background color of card to black
      for (let card of cards) {
        card.display();
      }
    // }
  } else {
    resetGame();
  }
}

function mousePressed() {
  // if (gameStart){ // only allow flip when game starts
    if (allowFlip){
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
              // Not a match, flip back after a delay of 0.5 second
              // console.log('not match');
              allowFlip = false;
              setTimeout(() => {
                flipCards[0].flip();
                flipCards[1].flip();
                cardRemain += 2;
                flipCards = [];
                if (score > 0){
                  score -= 50;
                }
                allowFlip = true;
              }, 500);
            }
          }
        }
      }
    }
  // }
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
    return (px > this.x && px < this.x + this.w && py > this.y && py < this.y + this.h);
  }

  // flip state
  flip() {
    this.flipped = !this.flipped;
  }
}

function topBar(){
  textSize(25);
  fill('blue'); // set text color to blue
  textAlign(CENTER);

  ///// timer function /////
  gameTime = levelTime - round((millis()-startTime)/1000);

  ///// Start game time when click Start /////
  // console.log('timer GS ',gameStart);
  if (gameStart){
    text('Score: '+score.toString(),width*0.5,height*0.07);

    ///// prevent time to run over 0 /////
    if (gameTime > 0) {
      text('Cards: '+cardRemain.toString(), width*0.15, height*0.07);
      text('Time : '+gameTime.toString(), width*0.85, height*0.07);

      // check winning condition
      if (cardRemain == 0){
        winGame();
        gameStart = false;
      }
    }
    ///// stop game when time reaches 0 /////
    else {
      text('Time : 0', width*0.85, height*0.07);
      gameStart = false;
      if ((cardRemain > 0)&&(!levelBtn.visible)){
        loseGame();
      }
    }
  } else {
    text('Level '+level.l, width*0.15, height*0.85);
  }
}

function createLevel(level){
  cards = [];
  levelImages = [];

  // each level contains row and column size
  // which adjust how many card images involved per level
  if (level.l == 1){
    level.row = 4;
    level.col = 5;
    levelTime = 6;
    // for (let x = 0; x < 20; x++){
    //   levelImages.push(cardImages[x % 10]);
    // }
  } else if (level.l == 2){
    level.row = 5;
    level.col = 6;
    levelTime = 12;
    // for (let x = 0; x < 30; x++){
    //   levelImages.push(cardImages[x % 15]);
    // } 
  } else if (level.l == 3){
    level.row = 5;
    level.col = 8;
    levelTime = 30;
    // for (let x = 0; x < 40; x++){
    //   levelImages.push(cardImages[x % 20]);
    // }
  }

  // Adjust card size for each level
  let tempW = (width-((level.col+1)*space))/level.col;
  let tempH = (height-((level.row+1)*space))/(level.row+0.5);

  cardSize = {
    w: tempW,
    h: tempH
  };
  
  // Note: number of card images has to be 2x to 
  //       fit full level images array
  //       Example:
  //          # of card images = 1 to 10
  //          max card images = 10
  //
  //          # of level images = 2,4,6,8,10,12,14,16,18,20
  //          max level images = 20
  //
  //       Easy Level
  //          level.row = 2;
  //          level.col = 2;
  //          for (let x = 0; x < cardRemain; x++){
  //            levelImages.push(cardImages[x % (cardRemain/2)]);
  //          }
  //
  //  *** cardRemain/2 <= cardImages.length ***
  cardRemain = level.row * level.col;
  for (let x = 0; x < cardRemain; x++){
    levelImages.push(cardImages[x % (cardRemain/2)]);
  }

  shuffle(levelImages, true);
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

function winGame(){
  bunny.visible = true;
  balls.visible = true;
  if (level.l < 3){
    levelBtn.text = 'Next\nLevel '+(level.l+1);
  } else {
    levelBtn.text = 'Replay\nLevel '+(level.l);
  }
  levelBtn.visible = true;
  levelBtn.collider = 's';
  endMessage.visible = true;
  endMessage.text = 'You Win!\n\nYour Score : '+score;

  // setTimeout(() => {
  //   bunny.visible = false;
  //   balls.visible = false;
  //   endMessage.visible = false;
  //   cardRemain = level.row * level.col;
  //   console.log('after win game 5 sec GS ',gameStart,cardRemain);
  // }, 5000);
}

function loseGame(){
  endMessage.visible = true;
  endMessage.text = 'Replay?';
  startBtn.text = 'Restart';
  // setTimeout(() => {
  //   // gameStart = false; // already set from topBar function
  //   endMessage.visible = false;
  // }, 5000);
}

function resetGame(){
  if (levelBtn.visible){
    startBtn.visible = false;
    startBtn.collider = 'n';
  } else {
    // shuffle(levelImages, true);
    // console.log('resetGame shuffle');
    // cardRemain = level.row * level.col;
    carrots.visible = true;
    startBtn.visible = true;
    startBtn.collider = 's';
  }
  score = 0;
  allowFlip = false;
  flipCards = [];
}

// Window resized function will run when "reload" after a browser window resize
function windowResized(){
  // Canvas is set to 80% width and height - match setup scale
  resizeCanvas(windowWidth*0.9, windowHeight*0.9);
}