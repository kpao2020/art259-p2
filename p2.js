// Team : Ken Pao, Yuying Huang
// Class: ART 259
// Title: <tbd>
// P5JS link: <tbd>
// Reference: listed at the end of this file
///////////////////////////////////////////////////////////////////////////////

// Global Variables
let p1;
let floor;
let gameTime, startTime, levelTime;
let startBtn;
let gameStart;

// Preload media
function preload(){

}

// Initialize setup
function setup(){
    new Canvas(windowWidth*0.8, windowHeight*0.8);
    world.gravity.y = 5;
    floor = new Sprite(width/2, height*0.8, width, 10, 's');
    floor.visible = false;
    p1 = new Sprite(width/2, height*0.7, 50);
    p1.visible = false;
    startBtn = new Sprite(width/2,height*0.45,100,'s');
    startBtn.color = 'aqua';
    startBtn.textSize = 26;
    startBtn.text = 'START';
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
        p1.visible = true;
        startTime = millis();
        startBtn.visible = false;
        startBtn.collider = 'n';
    }

    if (gameStart){
        // if ((contro.pressing('left')) || (kb.pressing('arrowLeft'))) {  
        if (kb.pressing('arrowLeft')){
            p1.vel.x = -5;
            // p1.mirror.x = false;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        // else if ((contro.pressing('right')) || (kb.pressing('arrowRight'))){
        else if (kb.pressing('arrowRight')){
            p1.vel.x = 5;
            // p1.mirror.x = true;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        // else if ((contro.pressing('up')) || (kb.pressing('arrowUp'))){
        else if (kb.pressing('arrowUp')){    
            p1.vel.y = -5;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        // else if ((contro.pressing('down')) || (kb.pressing('arrowDown'))){
        else if (kb.pressing('arrowDown')){
            p1.vel.y = 5;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        else {
            p1.vel.x = 0;
            p1.vel.y = 0;
            // p1.rotation = 0;
            // p1.rotationlock = true;
            // p1.ani.stop();
        }
    } else {
        resetGame();
    }
}

function topBar(){

    
    textSize(28);
    fill('white');
  
    ///// timer function /////
    gameTime = levelTime - round((millis()-startTime)/1000);
  
    ///// Start game time when click Start /////
    if (gameStart){

    //   text(score.toString(),width*0.62,height*0.07);
  
      ///// prevent time to run over 0 /////
      if (gameTime > 0) {
        text('Time : '+gameTime.toString(), width*0.8, height*0.07);
      }
      ///// stop game when time reaches 0 /////
      else {
        text('Time : 0',width*0.8,height*0.07);
        gameStart = false;
      }
    }
  }

function resetGame(){
    p1.x = width/2;
    p1.y = height*0.7;
    startBtn.visible = true;
    startBtn.collider = 's';
    p1.visible = false;
    floor.visible = false;
}