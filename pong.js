var ball,p1,p2;
var p2AI, p1AI;

function Ball() {
  this.r = 10;
  this.pos = createVector(width / 2, height / 2);
  var angle = random() < 0.5 ? random(PI-PI/4,PI+PI/4) : random(-PI/4, PI/4); 
  this.vel = p5.Vector.fromAngle(angle);
  this.speed = 5;
  this.vel.setMag(this.speed);
  this.dead = false;
  this.bounce = function(angle) {
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.setMag(this.speed);
  };
  this.edges = function() {
    if (this.pos.x < 15 + this.r){

      p1.score++;
      this.dead = true;
    }else if(this.pos.x > width - 15 - this.r){

      p2.score++;
      this.dead = true;
    }
    if (this.pos.y < 15 + this.r || this.pos.y > height - 15 - this.r) {
      this.vel.y *= -1;
    }
  };
  this.update = function() {
    this.pos.add(this.vel);
    this.edges();
  };
  this.draw = function() {
    noStroke();
    fill(255);
    ellipse(this.pos.x,this.pos.y,2 * this.r);
  };
}

function Pad(x) {
  this.pos = createVector(x,height/2);
  this.vel = createVector(0,0);
  this.acc = createVector(0,0); 
  this.w = 20;
  this.h = 140;
  this.score = 0;
  this.touches = function(ball) {
    return ball.pos.y + ball.r > this.pos.y - this.h/2 &&
      ball.pos.y - ball.r < this.pos.y + this.h/2 &&
      ((ball.pos.x - ball.r < this.pos.x + this.w/2 && ball.pos.x <= width/2 && this.pos.x <= width/2) ||
       (ball.pos.x + ball.r > this.pos.x - this.w/2 && ball.pos.x > width/2 && this.pos.x > width/2));
  };
  this.update = function() {
    this.vel.add(this.acc);
    this.acc.mult(0);
    this.vel.mult(0.98);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.pos.y = constrain(this.pos.y,this.h/2+15,height - this.h/2 - 15);
  };
  this.draw = function() {
    rectMode(CENTER);
    fill("White");
    rect(this.pos.x,this.pos.y,this.w,this.h);
  };
}

function drawField() {
  fill(255);
  noStroke();
  textSize(50);
  text(p2.score, width/4, height/7);
  textSize(50);
  text(p1.score, 3*width/4, height/7);

  rectMode(CENTER);
  noFill();
  stroke(255);
  strokeWeight(10);
  rect(width/2,height/2,width-20,height-20);
  ellipse(width/2,height/2,20);
  var x = width / 2;
  var steps = 15;
  for (var i = 0; i < steps; i++) {
    var y = 15 + i * height/steps;
    fill(255);
    noStroke();
    rect(x,y,10,20);
  }
}

function setup () {
  createCanvas(640,480);
  ball = new Ball();
  p1 = new Pad(30);
  p2 = new Pad(width - 30);
  p1AI = createCheckbox('P1 AI',false);
  p2AI = createCheckbox('P2 AI',false);
}

//  function keyPressed(event) {
//    console.log(event.key);
//   console.log(event.keyCode);
//  }

function draw() {
  background(51);
  drawField();
  if(!p1AI.checked()){
    if (keyIsDown(83)) {
      p1.acc.y = 0.3;
    } else if (keyIsDown(87)) {
      p1.acc.y = -0.3;
    }else if (keyIsDown(16)) { //klawisz "Shift"
      p1.acc.y = 10;
    }else if (keyIsDown(81)) { //klawisz "q"
      p1.acc.y = -10;
    }
    else {
      p1.acc.y = 0;
    }
  }else{
    if(ball.pos.y < p1.pos.y){
      p1.acc.y = random(-0.1,-0.2);
    }else{
      p1.acc.y = random(0.1,0.2);
    }

  }
  if(!p2AI.checked()){
    if (keyIsDown(40)) {
      p2.acc.y = 0.3;
    } else if (keyIsDown(38)) {
      p2.acc.y = -0.3;
    }  else if (keyIsDown(17)) { //klawisz "Ctrl"
      p2.acc.y = 10;
    }else if (keyIsDown(191)) { //klawisz "/"
      p2.acc.y = -10;
    }
    else {
      p2.acc.y = 0;
    }
  }else{
    if(ball.pos.y < p2.pos.y){
      p2.acc.y = random(-0.1,-0.2);
    }else{
      p2.acc.y = random(0.1,0.2);
    }
  }

  if (p1.touches(ball)) {
    var angle = map(ball.pos.y, p1.pos.y - p1.h/2 - ball.r, p1.pos.y + p1.h/2 + ball.r, -PI/4, PI/4);
    ball.pos.x = p1.pos.x + p1.w/2 + ball.r;
    ball.bounce(angle);
  }

  if (p2.touches(ball)) {
    if(ball.pos.y < p2.pos.y){
      var angle = map(ball.pos.y, p2.pos.y - p2.h/2, p2.pos.y, -3*PI/4, -PI);
    }else{
      var angle = map(ball.pos.y, p2.pos.y, p2.pos.y + p2.h/2, PI, 3*PI/4);                
    }
    ball.pos.x = p2.pos.x - p2.w/2 - ball.r;
    ball.bounce(angle);
  }

  p1.update();
  p2.update();
  p1.draw();
  p2.draw();

  ball.update();
  ball.draw();
  if(ball.dead){
    if(p1.score > 10 || p2.score > 10){
      drawField();
      noloop();
    }
    ball = new Ball();
  }
}
