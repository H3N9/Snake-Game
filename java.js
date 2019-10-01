// main canvas 
var ground = document.querySelector(".snake").getContext("2d");
var sign = document.querySelector(".information");
var lom = document.querySelector("#lop");

// all button
var startBut = document.querySelector("#start");
var backBut = document.querySelector("#back");
var okayBut = document.querySelector("#okay");

//background canvas
var offon = document.querySelector(".snake");

// load all image
var groundImg = new Image();
groundImg.src = "img/ground.png";
var food = new Image();
food.src = "img/apple.png";
var head = new Image();
head.src = "img/head.png";
var bodyS = new Image();
bodyS.src = "img/body.png";
var perF = new Image();
perF.src = "img/perfect.png";
var dimondImg = new Image();
dimondImg.src = "img/items.png";

// load all audio
var move = new Audio();
move.src = "audio/move.mp3";
var dead = new Audio();
dead.src = "audio/dead.wav";
var eat = new Audio();
eat.src = "audio/eat.mp3";
var press = new Audio();
press.src = "audio/press.mp3";
var music = new Audio();
music.src = "audio/music.mp3";
var perfs = new Audio();
perfs.src = "audio/per.wav";

//set volume
eat.volume = 0.1;
music.volume = 0.1;
move.volume = 0.1;
perfs.volume = 0.1;

//check items
var keepD = 0;
var second = 0;

//score
var score = 0;

// run interval
var run;

// create box
var box = 25; // x = 32 y = 24

// position items
var positionF = {x:Math.floor(Math.random()*30+1)*box,y:Math.floor(Math.random()*21+1)*box};
var perfectF; // random perfect food 10 point
var dimond;  //item dimond
var positionI = {x:Math.floor(Math.random()*30+1)*box,y:Math.floor(Math.random()*21+1)*box};


// position snake
var positionS = [];
var oldHead= [];
var snakeX;
var snakeY;
positionS[0] = {x:16*box,y:12*box};

//add button for control

var plum = "key";

// Function movement key
function key(e){
    var k = e.keyCode;
    if(k==37&&plum!="Right"){
        plum = "Left";
        move.play();
    }
    else if(k==38&&plum!="Down"){
        plum = "Up";
        move.play();
    }
    else if(k==39&&plum!="Left"){
        plum = "Right";
        move.play();
    }
    else if(k==40&&plum!="Up"){
        plum = "Down";
        move.play();
    }
}

// game
function game(){


    music.play();
    document.addEventListener("keydown", key);

    // position x y of snake
    snakeX = positionS[0].x;
    snakeY = positionS[0].y;

    //call map per 100ms
    ground.drawImage(groundImg, 0, 0);

    //call items
    if(dimond==2){
        ground.drawImage(dimondImg, positionI.x, positionI.y, box, box);
    }
    if(perfectF==5){
        ground.drawImage(perF, positionF.x, positionF.y, box, box);
    }
    else{
        ground.drawImage(food, positionF.x, positionF.y, box, box);
    }

    //print Score
    ground.fillStyle = "limegreen";
    ground.font = "40px calibri";
    ground.fillText("Score: ", 20*box, 23.5*box);
    ground.strokeText("Score: ", 20*box, 23.5*box);

    //print point of score
    ground.fillStyle = "white";
    ground.font = "40px calibri";
    ground.fillText(score, 25*box, 23.5*box);
    ground.strokeText(score, 25*box, 23.5*box);

    // change position of snake
    if(plum=="Left") snakeX -= box;
    if(plum=="Up") snakeY -= box;
    if(plum=="Down") snakeY += box;
    if(plum=="Right") snakeX += box;

    //print snake 
    for(var i=0;i<positionS.length;i++){
        ground.drawImage(i==0? head:bodyS, positionS[i].x, positionS[i].y, box, box);
    }

    oldHead = {x:snakeX, y:snakeY};

    // check did snake have to kept dimond yet?
    if(snakeX==positionI.x&&snakeY==positionI.y&&dimond==2){
        positionI = {x:Math.floor(Math.random()*30+1)*box,y:Math.floor(Math.random()*21+1)*box};
        keepD = 1;
        second = 0;
        dimond = 0;
        perfs.play();
    }

    // check did snake have to ate yet?
    if(snakeX==positionF.x&&snakeY==positionF.y){
        score += perfectF==5? 10:1;
        perfectF==5? perfs.play():eat.play();
        positionF = {x:Math.floor(Math.random()*30+1)*box,y:Math.floor(Math.random()*21+1)*box};
        perfectF = Math.floor(Math.random()*10);
        dimond = dimond!=2? Math.floor(Math.random()*30):dimond;
        
    }
    // delete tail of snake
    else{
        positionS.pop();
    }

    // check snake if head = size of canvas or snake = body
    if((body(oldHead, positionS) || snakeX==31*box || snakeY==22*box || snakeX<box || snakeY<box)&&keepD==0){
        clearInterval(run);
        dead.play();
    }
    // if snake can keep dimond snake will can pass wall
    else if (keepD==1){
        oldHead.x = oldHead.x<box? oldHead.x+box*30:oldHead.x>=31*box? box:oldHead.x;
        oldHead.y = oldHead.y<box? oldHead.y+box*21:oldHead.y>=22*box? box:oldHead.y;
    }

    //draw time remind
    if(keepD==1){
        second++;
        ground.drawImage(dimondImg, box*8, box*22.3, box+10, box+10);
        ground.fillStyle = "tomato";
        ground.fillRect(box*10, box*22.6, (box+95)-second/5, box-10);
        ground.strokeRect(box*10, box*22.6, (box+95)-second/5, box-10);
    }
    // stop dimond item if 1 min
    if(second==600){
        keepD = 0;
    }

    // add tail to head
    positionS.unshift(oldHead);


}

// check head = body
function body(head, body){
    for(var i=1;i<body.length;i++){
        if(head.x == body[i].x && head.y == body[i].y){
            return true;
        }
    }
    return false;
}
// restart game press Enter
document.addEventListener("keydown", restart);

function restart(e){
    if(e.keyCode==13){
        positionS = [];
        plum = "keydown";
        score = 0;
        keepD = 0;
        dimond = 0;
        positionS[0] = {x:16*box,y:12*box};
        positionF = {x:Math.floor(Math.random()*30+1)*box,y:Math.floor(Math.random()*21+1)*box};
        clearInterval(run);
        run = setInterval(game, 75);
    }
}
//press play
function start(){
    startBut.style.display = "none";
    sign.style.display = "inline-block";
    lop.style.display = "none";
    okayBut.style.display = "inline-block";
    press.play();
}
//press back
function back(){
    backBut.style.display = "none";
    sign.style.display = "none";
    clearInterval(run);
    offon.style.display = "none";
    startBut.style.display = "inline-block";
    lop.style.display = "inline-block";
    press.play();
    music.pause();
}

function okay(){
    offon.style.display = "block";
    backBut.style.display = "inline-block";
    sign.style.display = "block";
    okayBut.style.display = "none";
    sign.style.display = "none";
    score = 0;
    keepD = 0;
    dimond = 0;
    press.play();
    positionS = [];
    plum = "keydown";
    positionS[0] = {x:16*box,y:12*box};
    positionF = {x:Math.floor(Math.random()*30+1)*box,y:Math.floor(Math.random()*21+1)*box};
    clearInterval(run);
    run = setInterval(game, 75);
}
