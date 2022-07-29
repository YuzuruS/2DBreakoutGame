var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// ボール半径
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

// バーの高さ
var paddleHeight = 10;
// バーの幅
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
// 右ボタンがおされたか
var rightPressed = false;
// 左ボタンがおされたか
var leftPressed = false;

// ブロックの列数
var brickRowCount = 5;
// ブロックの行数
var brickColumnCount = 3;
// ブロックの幅
var brickWidth = 75;
// ブロックの高さ
var brickHeight = 20;
// ブロックの同士の隙間
var brickPadding = 10;
// ブロックの上端からの位置
var brickOffsetTop = 30;
// ブロックの左端からの位置
var brickOffsetLeft = 30;

// スコアのデフォルト値
var score = 0;

// ライフ
var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// ボールの表示
function drawBall() {
  ctx.beginPath();
  // 円の中心のx、y座標
  // 円の半径
  // 開始角度と終了角度 (円を描く始める時点の角度と描き終えたあとの角度をラジアンで)
  //描く方向 (時計回りはfalseで、デフォルト。半時計回りはtrue。) この最後のパラメーターは省略可能です。
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// バーの表示
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// レンガの表示
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// scoreの表示
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// 残りライフの表示
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // 左右の壁でボールを弾ませる
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  // 上の壁でボールを弾ませる
  if (y + dy < ballRadius) {
    dy = -dy;
  }
  // 下の壁に到達
  else if (y + dy > canvas.height - ballRadius) {
    // バーにボールが当たったら
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    // 下の壁にボールがあたったら
    else {
      // ライフを1減らす
      lives--;
      // ライフが0になったら
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      }
      // スタート位置に戻す
      else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // 右ボタンが押されたらバーを動かす
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  // 左ボタンが押されたらバーを動かす
  else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
