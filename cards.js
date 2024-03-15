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
let bonusImages = []; // Array of bonus images
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
let bunny, winImage, loseImage; // Win/Lose page image
let sounds, soundBtn, isMute, soundOnImg, soundOffImg;

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

function preload() {
  for (let i = 0; i < 26; i++) {
    // Load all card images - total 26
    cardImages.push(loadImage('image/bunny'+i+'.png')); 
  }

  for (let b = 0; b < 4; b++) {
    // Load all bonus images - total 4
    bonusImages.push(loadImage('image/bonus'+b+'.png')); 
  }

  for (let j = 0; j < 2; j++) {
    // load carrot animation images
    carrotImages.push(loadImage('image/carrotmove'+j+'.png')); 
  }

  backImage = loadImage('image/bunnyBack.png');
  winImage = loadImage('image/win.png');
  loseImage = loadImage('image/lose.png');

  soundOnImg = loadImage('image/soundOn.png');
  soundOffImg = loadImage('image/soundOff.png');

  sounds = [
    loadSound('sound/achieve.wav'),
    loadSound('sound/bonus.wav'),
    loadSound('sound/bonus2.wav'),
    loadSound('sound/exp-inc.wav'),
    loadSound('sound/hp-recharge.wav'),
    loadSound('sound/level-complete.wav'),
    loadSound('sound/level-complete2.wav'),
    loadSound('sound/lose.wav'),
    loadSound('sound/p-boost.wav'),
    loadSound('sound/treasure.wav'),
    loadSound('sound/unlock.wav'),
    loadSound('sound/win.wav'),
    loadSound('sound/win2.wav')
  ];
}

function setup() {
  let cnv = createCanvas(windowWidth*0.95, windowHeight*0.95);

  cnv.doubleClicked(showLevel);

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
  balls.x = width*0.54; // animation test: ball.x = () => random(width*0.2, width*0.8);
  balls.y = height*0.72; // animation test: ball.y = () => random(height*0.5, height*0.8);
  balls.d = 5;
  balls.collider = 'none';
	balls.direction = () => random(0, 360);
	balls.speed = 2;
  balls.visible = false;
  balls.life = 120; // 2 seconds

  carrots = new Group();
  carrots.addAnimation('wiggle', carrotImages[0], carrotImages[1]);
  carrots.scale = 0.1;
  carrots.x = () => random(width*0.1, width*0.9);
  carrots.y = () => random(height*0.2, height*0.9);
  carrots.rotation = 0;
  carrots.rotationlock = true;
  carrots.visible = true;
  carrots.collider = 'n';
  carrots.life = 120; // 2 seconds

  bunny = new Sprite(width*0.5, height*0.85, 1, 'n');
  
  bunny.visible = false;

  startBtn = new Sprite(width*0.5, height*0.5, 150, 's');
  startBtn.textSize = 28;
  startBtn.text = 'START';

  levelBtn = new Sprite(width*0.85, height*0.85, 200, 100, 'n');
  levelBtn.textSize = 28;
  
  levelBtn.color = 'lime';
  levelBtn.visible = false;

  // Sound button will be positioned below Start button initially
  // but will move to top bar section once game starts
  soundBtn = new Sprite(width*0.5, height*0.65, 100, 100, 's');
  isMute = false;

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
    playSound(8);
    console.log('startBtn sound 8');
    gameStart = true;
    allowFlip = true;
    bunny.visible = false;
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
    playSound(1);
    console.log('lBtn sound 1');
    gameStart = true;
    allowFlip = true;
    bunny.visible = false; 
    balls.visible = false; 
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
    fill('black'); // set background color of card to black
    for (let card of cards) {
      card.display();
    }
  } else {
    resetGame();
  }
}

function mousePressed() {
  if (allowFlip){
    for (let card of cards) {
      if (card.hovers(mouseX, mouseY) && !card.flipped) {
        card.flip();
        playSound(0);
        console.log('flip 1st card sound 0');
        cardRemain--;
        flipCards.push(card);
        if (flipCards.length === 2) {
          if (flipCards[0].img === flipCards[1].img) {
            // Match section
            // console.log('match');
            score += 100;
            playSound(9);
            console.log('match sound 9');
            checkBonus(flipCards[1].img);
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
                score -= 10;
              }
              allowFlip = true;
            }, 500);
          }
        }
      }
    }
  }
}

function showLevel(){
  // Skip level: double click on canvas
      playSound(10);
      console.log('l key sound 10');
      endMessage.visible = false;
      allowFlip = false;
      levelBtn.visible = true;
      levelBtn.collider = 's';
      levelBtn.text = 'Secret Skip'
      flipCards = []; // avoid cardRemain error
}

function playSound(i){
  if (!isMute){
    sounds[i].play();
  } else {
    sounds[i].stop();
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
    text('Score: '+score.toString(),width*0.5,height*0.07);

    soundBtn.x = width*0.75;
    soundBtn.y = height*0.062;
    soundBtn.scale = 0.3;
    soundBtn.w = 30;
    soundBtn.h = 30;
    ///// prevent time to run over 0 /////
    if (gameTime > 0) {
      text('Cards: '+cardRemain.toString(), width*0.15, height*0.07);
      text('Time : '+gameTime.toString(), width*0.85, height*0.07);

      // check winning condition
      if (cardRemain == 0){
        winGame();
        playSound(2);
        console.log('win sound 2');
        gameStart = false;
      }
    }
    ///// stop game when time reaches 0 /////
    else {
      text('Time : 0', width*0.85, height*0.07);
      gameStart = false;
      if ((cardRemain > 0)&&(!levelBtn.visible)){
        loseGame();
        playSound(7);
        console.log('lose sound 7');
      }
    }
  } else {
    text('Level '+level.l, width*0.15, height*0.85);
    
    // soundBtn.x = width*0.5;
    // soundBtn.y = height*0.65;
    // soundBtn.scale = 1;
    // soundBtn.w = 100;
    // soundBtn.h = 100;
  }

  if (soundBtn.mouse.presses()) {
    isMute = !isMute;
    console.log('isMute',isMute);
  }
  if (isMute){
    soundBtn.img = soundOffImg;
  } else {
    soundBtn.img = soundOnImg;
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
    levelTime = 60;
    levelImages.push(bonusImages[0]);
    levelImages.push(bonusImages[0]);
  } else if (level.l == 2){
    level.row = 5;
    level.col = 8;
    levelTime = 180;
    levelImages.push(bonusImages[0]);
    levelImages.push(bonusImages[1]);
    levelImages.push(bonusImages[0]);
    levelImages.push(bonusImages[1]);
  } else if (level.l == 3){
    level.row = 6;
    level.col = 10;
    levelTime = 300;
    for (let i = 0; i < bonusImages.length; i++){
      levelImages.push(bonusImages[i]);
    }
    for (let i = 0; i < bonusImages.length; i++){
      levelImages.push(bonusImages[i]);
    }
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
  shuffle(cardImages, true);
  cardRemain = level.row * level.col;
  let k = cardRemain - (2*level.l);
  for (let x = 0; x < k; x++){
    console.log('k',k,'card index',x%(k/2));
    levelImages.push(cardImages[x % (k/2)]);
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

function checkBonus(img){
    if (img === bonusImages[0]){
        levelTime += 10;
    } else if (img === bonusImages[1]){
        score += 100;
    } else if (img === bonusImages[2]){
        levelTime += 30;
    } else if (img === bonusImages[3]){
        score += 500;
    }
}

function winGame(){
  bunny.img = winImage;
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
}

function loseGame(){
  bunny.img = loseImage;
  bunny.visible = true;
  endMessage.visible = true;
  endMessage.text = 'Replay?';
  startBtn.text = 'Restart';
}

function resetGame(){
  if (levelBtn.visible){
    startBtn.visible = false;
    startBtn.collider = 'n';
  } else {
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

///////////////////////////////////////////////////////////////////////////////
// Reference