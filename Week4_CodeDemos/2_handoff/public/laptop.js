let socket;
let input = { dx: 0, dy: 0 };
let player = { x: 50, y: 0, vy: 0, w: 30, h: 30 };
let gravity = 0.5;
let ground = 350;
let speed = 7;
let platform = { x: 300, y: 200, w: 140, h: 16 };
let platform2 = { x: 100, y: 300, w: 140, h: 16 };
let connected = false;

let deepColor = { r: 255, g: 255, b: 255 };
let highColor = { r: 150, g: 220, b: 255 };

function setup() {
  createCanvas(600, 400);
  socket = io();

  socket.on('connect', () => {
    connected = true;
    document.getElementById('status').textContent = 'phone connected — waiting for input';
  });

  socket.on('control', (data) => {
    document.getElementById('status').textContent = 'receiving input from phone';
    if (typeof data.dx === 'number') input.dx = data.dx;
    if (typeof data.dy === 'number') input.dy = data.dy;
    if (data.jump) doJump();
  });
}

function draw() {
  // background changes color based on how high the player is
  let t = constrain(map(player.y, 0, ground, 0, 1), 0, 1);
  let bg = lerpColor(
    color(highColor.r, highColor.g, highColor.b),
    color(deepColor.r, deepColor.g, deepColor.b),
    t
  );
  background(bg);

  player.x += input.dx * speed;
  player.x = constrain(player.x, 0, width - player.w);

  player.vy += gravity;
  player.y += player.vy;

  if (player.y + player.h > ground) {
    player.y = ground - player.h;
    player.vy = 0;
  }

  let landing =
    player.x + player.w > platform.x &&
    player.x < platform.x + platform.w &&
    player.y + player.h > platform.y &&
    player.y + player.h < platform.y + platform.h + 10 &&
    player.vy >= 0;

  if (landing) {
    player.y = platform.y - player.h;
    player.vy = 0;
  }

  let landing2 =
    player.x + player.w > platform2.x &&
    player.x < platform2.x + platform2.w &&
    player.y + player.h > platform2.y &&
    player.y + player.h < platform2.y + platform2.h + 10 &&
    player.vy >= 0;

  if (landing2) {
    player.y = platform2.y - player.h;
    player.vy = 0;
  }

  // ground with a grass-like top edge
  fill(50, 40, 60);
  rect(0, ground, width, height - ground);
  fill(80, 200, 120);
  rect(0, ground, width, 6);

  // platforms with rounded corners
  fill(130, 100, 200);
  rect(platform.x, platform.y, platform.w, platform.h, 6);
  rect(platform2.x, platform2.y, platform2.w, platform2.h, 6);

  // player with rounded corners + simple eye
  fill(255, 140, 60);
  rect(player.x, player.y, player.w, player.h, 8);
  fill(255);
  circle(player.x + player.w * 0.65, player.y + player.h * 0.35, player.w * 0.3);
  fill(20);
  circle(player.x + player.w * 0.7, player.y + player.h * 0.35, player.w * 0.12);

  // also allow keyboard for testing without a phone
  if (keyIsDown(LEFT_ARROW)) player.x -= speed;
  if (keyIsDown(RIGHT_ARROW)) player.x += speed;
}

function keyPressed() {
  if (key === ' ') doJump();
}

function doJump() {
  if (player.y + player.h >= ground || player.vy === 0) {
    player.vy = -12;
  }
}