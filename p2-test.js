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
let isShooter;
let ballColor;
let redBall,greenBall,blueBall,orangeBall,yellowBall;
let ballImage;

// Preload media
function preload(){
    redBall = loadImage('image/red50.png');
    greenBall = loadImage('image/green50.png');
    blueBall = loadImage('image/blue50.png');
    orangeBall = loadImage('image/orange50.png');
    yellowBall = loadImage('image/yellow50.png');
}

// Initialize setup
function setup(){
    new Canvas(windowWidth*0.9, windowHeight*0.9);
    
    floor = new Sprite(width/2, height*0.95, width, 10, 's');
    floor.visible = false;
    topSide = new Sprite(width/2, height*0.1, width, 10, 's');
    leftSide = new Sprite(5, height*0.5, 10, height, 's');
    rightSide = new Sprite(width-5, height*0.5, 10, height, 's');

    startBtn = new Sprite(width*0.5, height*0.5, 100, 's');
    startBtn.color = 'aqua';
    startBtn.textSize = 26;
    startBtn.text = 'START';

    p1 = new Sprite(width/2, height*0.9, 50, 80, 'd');

    bbStart = {
        x : p1.x,
        y : height*0.8,
    };
    ballColor =['red','green','blue','orange','yellow'];
    ballImage ={
        red:redBall,
        green:greenBall,
        blue:blueBall,
        orange:orangeBall,
        yellow:yellowBall,
    };
    let i = round(random(4));
    
    bunnyBall = new Sprite(bbStart.x, bbStart.y, 50, 'd');
    bunnyBall.visible = false;
    bunnyBall.bounciness = 0;
    bunnyBall.color = ballColor[i];
         if (i == 0){bunnyBall.img = ballImage.red;}
    else if (i == 1){bunnyBall.img = ballImage.green;} 
    else if (i == 2){bunnyBall.img = ballImage.blue;} 
    else if (i == 3){bunnyBall.img = ballImage.orange;} 
    else if (i == 4){bunnyBall.img = ballImage.yellow;}
    isShooter = true;
    p1.overlaps(bunnyBall);

    sBalls = new Group();
   
    gameStart = false;
    levelTime = 60;
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
            p1.vel.x = -10;
            
            if (bunnyBall.y == bbStart.y){
                bunnyBall.x = p1.x;
            }
            // p1.mirror.x = false;
            // p1.ani.play();
            // p1.rotation = 0;
            // p1.rotationlock = true;
        }
        // else if ((contro.pressing('right')) || (kb.pressing('arrowRight'))){
        else if (kb.pressing('arrowRight')){
            p1.vel.x = 10;
            if (bunnyBall.y == bbStart.y){
                bunnyBall.x = p1.x;
            }
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
            // bunnyBall.vel.x = 0;
            // p1.rotation = 0;
            // p1.rotationlock = true;
            // p1.ani.stop();
        }
        // if ((leftSide.collided(bunnyBall)) || (rightSide.collided(bunnyBall))){
        //     bunnyBall.vel.x = 0;
        // }else if (bunnyBall.y == bbStart.y){
        //     bunnyBall.vel.x = p1.vel.x;
        // }
    
    bunnyBall.collides(sBalls, checkBall);

        if (bunnyBall.collides(topSide)){
            let sBall = new sBalls.Sprite(bunnyBall.x, bunnyBall.y, bunnyBall.d, 's');
            sBall.color = bunnyBall.color;
            sBall.img = bunnyBall.img;
            bunnyBall.remove();
            isShooter = false;
            getNewBall();
        }
        if (kb.pressed('space')){
            bunnyBall.vel.y = -10;
            // bunnyBall.vel.x = 0;
        } 
    
    // sBalls.colliding()
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

    text('Score: '+score.toString(),width*0.45,height*0.07);
  
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
    sBalls.removeAll();
}

function getNewBall(){
    if (!isShooter){
        let i = round(random(4)); 
        isShooter = !isShooter;
        bunnyBall = new Sprite(p1.x, bbStart.y, 50, 'd');
        bunnyBall.bounciness = 0;
        bunnyBall.color = ballColor[i];
            if (i == 0){bunnyBall.img = ballImage.red;}
        else if (i == 1){bunnyBall.img = ballImage.green;} 
        else if (i == 2){bunnyBall.img = ballImage.blue;} 
        else if (i == 3){bunnyBall.img = ballImage.orange;} 
        else if (i == 4){bunnyBall.img = ballImage.yellow;}
    }
}

function checkBall(bunnyBall, sBall){
    if (red(bunnyBall.color) === red(sBall.color) && 
        green(bunnyBall.color) === green(sBall.color) && 
        blue(bunnyBall.color) === blue(sBall.color)){
        console.log('match',sBall);
        score += 100;
        sBall.remove();
    } else {
        let sBall = new sBalls.Sprite(bunnyBall.x, bunnyBall.y, 50, 's');
        sBall.color = bunnyBall.color;
        sBall.img = bunnyBall.img;
        console.log('not match', sBall);
    }
    console.log(sBalls.length);
    bunnyBall.remove();
    isShooter = false;
    getNewBall();
}