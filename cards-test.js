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
let startBtn; // Start Button
let gameStart; // Game Start state = true or false
let score; // Keep track of score
let cardRemain; // Keep track of remaining cards
let balls, ballImages; // End Game animation
let endMessage; // Display end game message
let allowFlip = false; // Flip control state
let carrots, carrotImages=[]; // Start page animation
let bunny, bunnyImage; // Win page image


function preload() {
  for (let i = 1; i < 11; i++) {
    // Load all card images
    cardImages.push(loadImage('image/bunny'+i+'.png')); 
  }

  for (let j = 1; j < 3; j++) {
    // load carrot animation images
    carrotImages.push(loadImage('image/carrotmove'+j+'.png')); 
  }

  ballImages = [
    loadImage('image/red50.png'),
    loadImage('image/green50.png'),
    loadImage('image/blue50.png'),
    loadImage('image/orange50.png'),
    loadImage('image/yellow50.png')];

  backImage = loadImage('image/bunnyBack.png');
  bunnyImage = loadImage('image/bunny300.png');
}

function setup() {
  createCanvas(windowWidth*0.9, windowHeight*0.9);
  // level contains row and column size
  // which adjust how many card images involved per level
  level = {
    row: 4,
    col: 5
  };
  space = 20;

  cardSize = {
    w: (width-((level.col+1)*space))/level.col,
    h: (height-((level.row+1)*space))/(level.row+0.5)
  };
  cardRemain = level.row * level.col;
  
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

  for (let x = 0; x < cardRemain; x++){
    levelImages.push(cardImages[x % cardImages.length]);
  }
  shuffle(levelImages, true);

  // no Stroke for cards
  noStroke();

  // 0.5 row space for header
  // createCanvas(space + level.col*(cardSize.w + space), (level.row + 0.5)*(cardSize.h + space));

  startBtn = new Sprite(width*0.5, height*0.5, 150, 's');
  startBtn.textSize = 28;
  startBtn.text = 'START';
  
  carrots = new Group();
  carrots.addAnimation('wiggle', carrotImages[0], carrotImages[1]);
  carrots.scale = 0.1;
  carrots.x = () => random(width*0.2, width*0.8);
  carrots.y = () => random(height*0.2, height*0.8);
  carrots.rotation = 0;
  carrots.rotationlock = true;
  carrots.visible = true;
  carrots.collider = 'n';
  carrots.amount = 3;

  bunny = new Sprite(width*0.5, height*0.8, 1, 'n');
  bunny.img = bunnyImage;
  bunny.visible = false;

  gameStart = false;
  levelTime = 60;
  
  balls = new Group();
  balls.x = () => random(width*0.2, width*0.8);
  balls.y = () => random(height*0.5, height*0.8);
  balls.d = 50;
  balls.collider = 'none';
	balls.direction = () => random(0, 360);
	balls.speed = () => random(1, 5);
  balls.life = 30; // life is 30 frames = 0.5 sec
  
  endMessage = new Sprite(width*0.5, height*0.3, 1, 'n');
  endMessage.color = 'lightyellow';
  endMessage.textSize = 50;
  endMessage.textColor = 'red';
  endMessage.visible = false;
}

function draw() {
  clear();
  background('lightyellow');
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
      carrots.ani.stop();
      carrots.visible = false;
      startTime = millis();
      startBtn.visible = false;
      startBtn.collider = 'n';
      createLevel(level);
  }

  // Game Start section
  if (gameStart){
    // Winning condition => no more cards left
    if (cardRemain == 0){
      winGame();
    } else {
      fill('black'); // set background color of card to black
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
      if (cardRemain > 0){
        loseGame();
      }
    }
  }
}

function createLevel(level){
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
  
  balls.amount = 20;
  for (let i = 0; i < balls.amount; i++){
    balls[i].img = ballImages[i % ballImages.length];
  }
  
  if (balls.cull(-20)){
    new balls.Sprite();
  } 
  endMessage.visible = true;
  endMessage.text = 'You Win!\n\nYour Score : '+score;
  bunny.visible = true;

  setTimeout(() => {
    bunny.visible = false;
    gameStart = false;
    endMessage.visible = false;
  }, 5000);
}

function loseGame(){
  endMessage.visible = true;
  endMessage.text = 'Try Again ?';
  startBtn.text = 'REPLAY';
  setTimeout(() => {
    endMessage.visible = false;
  }, 5000);
}

function resetGame(){
  startBtn.visible = true;
  startBtn.collider = 's';
  shuffle(levelImages, true);
  cards=[];
  cardRemain = level.row * level.col;
  score = 0;
  allowFlip = false;
}

// Window resized function will run when "reload" after a browser window resize
function windowResized(){
  // Canvas is set to 80% width and height - match setup scale
  resizeCanvas(windowWidth*0.9, windowHeight*0.9);
}