//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 30;

let player = {
    x : boardWidth / 2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width : playerWidth,
    height : playerHeight,
    veolicityX : playerVelocityX
}
//ball
let ballWidth = 10;
let ballHight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x : boardWidth/2 - ballWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHight,
    veolicityX : ballVelocityX,
    veolicityY : ballVelocityY
}
//Blocks
let blockArray =[];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3; //add more as game goes on
let blockMaxRows = 10; //limit of rows

let blockCount = 0;
//Starting top left corner 
let blockX = 15
let blockY = 45;

let score = 0;
let gameOver = false;


window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the 
    
    //Draw the player
    context.fillStyle = "lightgreen";
    context.fillRect(player.x,player.y,player.width,player.height);

    /*Draw the ball  
    //context.fillStyle = "white";
    //context.fillRect(ball.x,ball.y,ball.width,ball.height);*/

    //Update the pedal
    requestAnimationFrame(update);
    //Listener to move the pedal
    document.addEventListener("keydown", movePlayer);

    //createBlocks();
    createBlocks();
}

//Updating the pedal
function update(){
    if(gameOver){
        return;
    }
    requestAnimationFrame(update);
    //Draw the pedal
    context.clearRect(0,0,board.width,board.height);
    context.fillStyle = "lightgreen";
    context.fillRect(player.x,player.y,player.width,player.height);
    //Draw the ball
    context.fillStyle = "white";
    ball.x += ball.veolicityX;
    ball.y += ball.veolicityY;
    context.fillRect(ball.x,ball.y,ball.width,ball.height);
    
    ballOutOfWalls()
    ballHitPedal()
    

    context.fillStyle  = "skyblue";
    for(let i = 0; i < blockArray.length; i++){
        let block = blockArray[i];
        if(!block.break){
            if(topCollision(ball, block) || bottomCollision(ball, block)){
                block.break = true;
                ball.veolicityY *= -1;
                ball.veolicityX *= -1;
                blockCount -= 1;
                score += 1;
            }
            if(rightCollision(ball, block) || leftCollision(ball, block)){
                block.break = true;
                ball.veolicityX *= -1;
                blockCount -= 1;
                score += 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }
    //next level
    if (blockCount == 5){
        player.veolicityX += 110;
        
    }
    //score
    context.font = "20px sans-serif";
    context.fillText(score, 10, 25);
    context.fillText(blockCount,15, 30);
    
}

function createBlocks(){
    blockArray = []; //clear blockArray
    for(let c = 0; c < blockColumns; c++){
        for(let r = 0; r < blockRows; r++){
            let block = {
                x : blockX + c*blockWidth + c*10, //c*10 space 10 pixels apart columns
                y : blockY + r*blockHeight + r*10, //c*10 space 10 pixels apart rows
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = 1;
}

function ballHitPedal(){
    if(topCollision(ball,player) || bottomCollision(ball,player)){
        ball.veolicityY *= -1;
    }
    else if(rightCollision(ball,player) || leftCollision(ball,player)){
        ball.veolicityX *= -1;
    }
}
//We would call detect collision to return true     
function topCollision(ball, pedal){//a is above b
    return detectCollision(ball, pedal) && (ball.y + ball.height) >= pedal.y; 
}
function bottomCollision(ball, pedal){//a is below b
    return detectCollision(ball, pedal) && ball.y >= (pedal.y + pedal.height); 
}
function leftCollision(ball, pedal){//a exceeds b
    return detectCollision(ball, pedal) && (ball.x + ball.width) >= pedal.x; 
}
function rightCollision(ball, pedal){//a exceeds b
    return detectCollision(ball, pedal) && ball.x <= (pedal.x + pedal.width); 
}

function detectCollision(a,b){
    return  a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
            a.x + a.width > b.x && //a's top right corner passes b's left corner
            a.y < b.y + b.height &&//a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y; //a's bottom left corner passes b's left corner
}


function ballOutOfWalls(){
    //if the ball hit wether the right or left wall, change the direciton
    if(ball.x + ball.width >= board.width || ball.x <= 0){
        ball.veolicityX *= -1;
    }
    //if the ball touch the top wall change the direction to the botton
    else if(ball.y <= 0){
        ball.veolicityY *= -1;
    }
    else if(ball.y + ball.height >= boardHeight){
        //GameOver
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to restart", 80, 400);
        gameOver = true;
    }
}
//function to move the pedal, right or left
function movePlayer(e){
    if (e.code == "Space") {
        resetGame();
       
    }
    if(e.code == "ArrowLeft"){
        //player.x -= player.veolicityX;
        let nextPlayerX = player.x - player.veolicityX;
        //Check for outbounds
        if(nextPlayerX >= 0){
            player.x = nextPlayerX;
        }
    }
    if(e.code == "ArrowRight"){
        //player.x += player.veolicityX;
        let nextPlayerX = player.x + player.veolicityX;
        //Check for outbounds
        if(nextPlayerX + player.width <= board.width){
            player.x = nextPlayerX;
        }
    }
}
function resetGame(){
    gameOver = false;
    player = {
        x : boardWidth / 2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width : playerWidth,
        height : playerHeight,
        veolicityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2 - ballWidth/2,
        y : boardHeight/2,
        width : ballWidth,
        height : ballHight,
        veolicityX : ballVelocityX,
        veolicityY : ballVelocityY
    }
    blockArray = [];
    score = 0;
    createBlocks();

}




