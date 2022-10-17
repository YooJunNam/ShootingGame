// 캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage, spaceShipImage, bulletImage, enemyImage, gameOVerImage;
let gameOver = false; // true 이면 게임 끝
let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width / 2 - 30;
let spaceshipY = canvas.height - 60;

let bulletList = []; //총알들 저장하는 리스트

function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 15;
    this.y = spaceshipY;
    this.alive = true; // true면 살아있음, false면 적군과 닿은 총알
    bulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };

  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
      ) {
        score++;
        this.alive = false; //적군과 닿은 총알
        enemyList.splice(i, 1);
      }
    }
  };
}
function generateRandomValue(min, max) {
  let randomNumber = Math.floor(Math.random() * (max - min + 1));
  return randomNumber;
}

let enemyList = [];

function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 48);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 3;

    if (this.y >= canvas.height - 48) {
      gameOver = true;
    }
  };
}

// 이미지 불러오기
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = "images/background.gif";

  spaceShipImage = new Image();
  spaceShipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOVerImage = new Image();
  gameOVerImage.src = "images/gameover.png";
}

let keysdown = {};
function setupKeyboardListener() {
  document.addEventListener("keydown", function (event) {
    keysdown[event.keyCode] = true;
  });
  document.addEventListener("keyup", function (event) {
    delete keysdown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet(); // 총알 생성되는 함수.
    }
  });
}

function createBullet() {
  console.log("총알 생성");
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysdown) {
    spaceshipX += 3; // right
  }
  if (37 in keysdown) {
    spaceshipX -= 3; //left
  }

  // 밖으로 안나가게 하기 위한 코드

  if (spaceshipX <= 0) {
    spaceshipX = 0;
  } else if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }

  // 총알의 y좌표 없데이트 하는 함수 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceShipImage, spaceshipX, spaceshipY);
  ctx.fillText(`Score:${score}`, 20, 20);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOVerImage, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 총알 만들기
// 1. spacebar 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y 좌표 값이 - , 총알의 x값은 스페이스를 누른 순간의 우주선의 x좌표와 동일하다.
// 3. 발사된 총알들은 배열에 저장한다.
// 4. 모든 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 배열을 가지고 render 진행.
