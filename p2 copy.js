// Team : Ken Pao, Yuying Huang
// Class: ART 259
// Title: <tbd>
// P5JS link: <tbd>
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

// Global Variables
let p1;
let floor;
let topSide, leftSide, rightSide;
let gameTime, startTime, levelTime;
let score;
let startBtn;
let gameStart;
let bunnyBall, bbStart, sBalls;
let isBall;
let ballColor;

// Preload media
function preload(){

}

// Initialize setup
function setup(){
    new Canvas(windowWidth*0.9, windowHeight*0.9);
    
    floor = new Sprite(width/2, height*0.95, width, 10, 's');
    floor.visible = false;
    topSide = new Sprite(width/2, height*0.1, width, 10, 's');
    leftSide = new Sprite(5, height*0.5, 10, height, 's');
    rightSide = new Sprite(width-5, height*0.5, 10, height, 's');

    startBtn = new Sprite(width/2, height*0.45, 100, 's');
    startBtn.color = 'aqua';
    startBtn.textSize = 26;
    startBtn.text = 'START';

    p1 = new Sprite(width/2, height*0.9, 50, 'd');

    bbStart = {
        x : width/2,
        y : height*0.8,
    };
    ballColor =['red','blue','green'];
    sBalls = new Group();
    bunnyBall = new Sprite(bbStart.x, bbStart.y, 50, 'd');
    bunnyBall.visible = false;
    bunnyBall.color = random(ballColor);
    isBall = true;
    p1.overlaps(bunnyBall);
    gameStart = false;
    levelTime = 10;
}

// Draw 
function draw(){
    clear();

    topBar();

    ///// start the game and timer /////
    if (startBtn.mouse.hovering()){
        startBtn.color = 'yellow';
    } else {
        startBtn.color = 'aqua';
    }
    
    if (startBtn.mouse.presses()) {
        gameStart = true;
        floor.visible = true;
        bunnyBall.visible = true;
        startTime = millis();
        startBtn.visible = false;
        startBtn.collider = 'n';
        score = 0;
    }

    if (gameStart){
        // if ((contro.pressing('left')) || (kb.pressing('arrowLeft'))) {  
        if (kb.pressing('arrowLeft')){
            p1.vel.x = -5;
            
            // if (bunnyBall.y == bbStart.y){
            //     bunnyBall.vel.x = -5;
            // }
            // p1.mirror.x = false;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        // else if ((contro.pressing('right')) || (kb.pressing('arrowRight'))){
        else if (kb.pressing('arrowRight')){
            p1.vel.x = 5;
            // if (bunnyBall.y == bbStart.y){
            //     bunnyBall.vel.x = 5;
            // }
            // p1.mirror.x = true;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        // else if ((contro.pressing('up')) || (kb.pressing('arrowUp'))){
        // else if (kb.pressing('arrowUp')){    
        //     p1.vel.y = -5;
        //     // p1.ani.play();
        //     // p1.rotation = 0;
        //     // p1.rotationlock = true;
        // }
        // else if ((contro.pressing('down')) || (kb.pressing('arrowDown'))){
        // else if (kb.pressing('arrowDown')){
        //     p1.vel.y = 5;
        //     // p1.ani.play();
        //     // p1.rotation = 0;
        //     // p1.rotationlock = true;
        // }
        else {
            p1.vel.x = 0;
            p1.vel.y = 0;
            bunnyBall.vel.x = 0;
            // p1.rotation = 0;
            // p1.rotationlock = true;
            // p1.ani.stop();
        }
        if ((leftSide.collided(bunnyBall)) || (rightSide.collided(bunnyBall))){
            bunnyBall.vel.x = 0;
        }else if (bunnyBall.y == bbStart.y){
            bunnyBall.vel.x = p1.vel.x;
        }
        
        if (topSide.collides(bunnyBall)){
            bunnyBall.remove();
            isBall = false;
            getNewBall();
        }else{
        if (kb.pressed('space')){
            bunnyBall.vel.y = -5;
            bunnyBall.vel.x = 0;
        } }
    } else {
        resetGame();
    }
}

function topBar(){

    
    textSize(28);
    fill('lightyellow');
  
    ///// timer function /////
    gameTime = levelTime - round((millis()-startTime)/1000);
  
    ///// Start game time when click Start /////
    if (gameStart){

    //   text(score.toString(),width*0.62,height*0.07);
  
      ///// prevent time to run over 0 /////
      if (gameTime > 0) {
        text('Time : '+gameTime.toString(), width*0.1, height*0.07);
      }
      ///// stop game when time reaches 0 /////
      else {
        text('Time : 0',width*0.1,height*0.07);
        gameStart = false;
      }
    }
  }

function resetGame(){
    p1.x = width/2;
    p1.y = height*0.9;
    bunnyBall.x = bbStart.x;
    bunnyBall.y = bbStart.y;
    bunnyBall.vel.y = 0;
    startBtn.visible = true;
    startBtn.collider = 's';
    floor.visible = false;
    bunnyBall.visible = false;
    
}

function getNewBall(){
    if (!isBall){
        bunnyBall = new Sprite(p1.x, bbStart.y, 50, 'd');
        bunnyBall.color = random(ballColor);
        isBall = !isBall;
    }
}