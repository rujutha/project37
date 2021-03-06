var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;
var PLAY=1;
var END=0;
var gameState=PLAY;
var gameOver,gameOverImg, restart,restartImg;

var jumpSound;
var dieSound;
var scoreSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOverImg=loadImage("gameOver.png");
  restartImg=loadImage("restart.png");
  
  dieSound=loadSound('die.mp3');
  jumpSound=loadSound('jump.mp3');
  scoreSound=loadSound('checkPoint.mp3');
}

function setup() {
  canvas=createCanvas(displayWidth-20,displayHeight-30);
  
  trex = createSprite(100,displayHeight/2-50,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth-20,displayHeight/2-5,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6+3* score/100);
  
  invisibleGround = createSprite(displayWidth/2+30,displayHeight/2,displayWidth,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  gameOver=createSprite(trex.x,displayHeight/2-200);
  gameOver.addImage(gameOverImg);
  restart=createSprite(trex.x,displayHeight/2-150);
  restart.addImage(restartImg);
  gameOver.scale=0.5;
  restart.scale=0.5;
  gameOver.visible=false;
  restart.visible=false;
  
  
  
  
}

function draw() {
  background(180);
  
  if(gameState===PLAY){
    score = score + Math.round(getFrameRate()/30);
    
     if (score>0 && score%100 === 0){
     scoreSound.play();
    }
    
    ground.velocityX = -(6+3* score/100);
    
    if(keyDown("space") && trex.y>=displayHeight/2-50) {
    trex.velocityY = -15;
      jumpSound.play();
  }
    
  trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
    ground.x = ground.width/2;
  }
    
    
   trex.collide(invisibleGround);
  spawnClouds();
  spawnObstacles(); 
    
    
    if(obstaclesGroup.isTouching(trex)){
      gameState=END;
      dieSound.play();
    }
    
    
    
    
  }
  else if(gameState===END){
    
  restart.visible=true;
    gameOver.visible=true;
    
    ground.velocityX=0;
    trex.velocityY=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
    if(mousePressedOver(restart)){
      reset();
    }
   
  }
  
  text("Score: "+ score, trex.x,100);
  
  drawSprites();

  camera .position.x=trex.x;
    camera. position.y=trex.y;
}

function reset(){
  gameState=PLAY;
  restart.visible=false;
  gameOver.visible=false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;

 trex.changeAnimation("running" ,trex_running);



}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth/2+30,displayHeight/2,40,10);
    cloud.y = Math.round(random(displayHeight/2-100,displayHeight/2-120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(displayWidth/2+30,displayHeight/2-25,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}