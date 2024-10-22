class startGame {
  constructor() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.car = null;
    this.obstacles = [];
    this.score = 0;
    this.animationId = null;
    this.frames = 0;
    this.gameOver = false; 
    this.scoreInterval = null;
  }

  start() {
    this.car = {
      x: this.canvas.width / 2 - 25, 
      y: this.canvas.height - 100,
      width: 50,
      height: 80,
      speed: 5
    };

    this.roadImage = new Image();
    this.roadImage.src = './images/road.png';
    
    this.carImage = new Image();
    this.carImage.src = './images/car.png';

    this.addControls();

    this.startScoreIncrement();

    this.updateGame();
  }

  addControls() {
    document.addEventListener('keydown', (e) => {
      if (!this.gameOver) { 
        switch (e.key) {
          case 'ArrowLeft':
            if (this.car.x > 0) {
              this.car.x -= this.car.speed;
            }
            break;
          case 'ArrowRight':
            if (this.car.x < this.canvas.width - this.car.width) {
              this.car.x += this.car.speed;
            }
            break;
        }
      }
    });
  }

  createObstacle() {
    const obstacleWidth = Math.random() * (240 - 30) + 60; 
    const obstacle = {
      x: Math.random() * (this.canvas.width - obstacleWidth), 
      y: 0,
      width: obstacleWidth, 
      height: 20, 
      speed: 3
    };
    this.obstacles.push(obstacle);
  }

  drawRoad() {
    this.ctx.drawImage(this.roadImage, 0, 0, this.canvas.width, this.canvas.height);
  }

  drawCar() {
    this.ctx.drawImage(this.carImage, this.car.x, this.car.y, this.car.width, this.car.height);
  }

  drawObstacles() {
    this.ctx.fillStyle = 'red'; 
    this.obstacles.forEach(obstacle => {
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); 
    });
  }

  drawScore() {
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30); 
  }

  drawGameOver() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(this.canvas.width / 2 - 150, this.canvas.height / 2 - 100, 300, 150); 

    this.ctx.fillStyle = 'red';
    this.ctx.font = '36px Arial';
    const gameOverText = 'GAME OVER!';
    const centerX = this.canvas.width / 2;
    const gameOverWidth = this.ctx.measureText(gameOverText).width;

    this.ctx.fillText(gameOverText, centerX - gameOverWidth / 2, this.canvas.height / 2 - 40);

    this.ctx.fillStyle = 'white';
    const scoreText = `Your Final Score is ${this.score}`;
    this.ctx.font = '24px Arial';
    const scoreWidth = this.ctx.measureText(scoreText).width;

    this.ctx.fillText(scoreText, centerX - scoreWidth / 2, this.canvas.height / 2 + 10);
  }

  checkCollision(obstacle) {
    return !(this.car.x > obstacle.x + obstacle.width ||
             this.car.x + this.car.width < obstacle.x ||
             this.car.y > obstacle.y + obstacle.height ||
             this.car.y + this.car.height < obstacle.y);
  }

  updateGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.drawRoad();
    
    if (this.frames % 120 === 0) { 
      this.createObstacle();
    }

    this.obstacles.forEach((obstacle, index) => {
      obstacle.y += obstacle.speed;

      if (obstacle.y > this.canvas.height) {
        this.obstacles.splice(index, 1);
      }

      if (this.checkCollision(obstacle)) {
        this.gameOver = true;
        cancelAnimationFrame(this.animationId);
      }
    });

    this.drawCar();

    this.drawObstacles();

    this.drawScore();

    if (this.gameOver) {
      this.drawGameOver(); 
      clearInterval(this.scoreInterval); 
    } else {
      this.frames++;
      this.animationId = requestAnimationFrame(() => {
        this.updateGame();
      });
    }
  }

  startScoreIncrement() {
    this.scoreInterval = setInterval(() => {
      if (!this.gameOver) {
        this.score += 1; 
      }
    }, 333);
  }
}

window.addEventListener('load', () => {
  const startBtn = document.getElementById('start-button');

  startBtn.addEventListener('click', () => {
    const game = new startGame();
    game.start();
  });
});
