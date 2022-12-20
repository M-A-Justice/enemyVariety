window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 800;

  class Game {
    constructor(ctx, width, height) {
      this.ctx = ctx;
      this.width = width;
      this.height = height;
      this.enemies = [];
      this.enemyInterval = 1000;
      this.enemyTimer = 0;
    }

    update(deltaTime) {
      this.enemies.filter((enemy) => !enemy.markedForDeletion);

      if (this.enemyTimer > this.enemyInterval) {
        this.#addNewEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });
    }

    draw () {
      this.enemies.forEach((enemy) => {
        enemy.draw(this.ctx);
      })
    }

    #addNewEnemy() {
      this.enemies.push(new Worm(this));
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForDeletion = false;
    }

    update(deltaTime) {
      this.x -= this.vx * deltaTime;

      if (this.x < 0 - this.width) {
        this.markedForDeletion = true;
      }
    }

    draw(ctx) {
      ctx.drawImage(this.img, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.img = worm;
      this.spriteWidth = 229;
      this.spriteHeight = 171;
      this.width = this.spriteWidth / 2;
      this.height = this.spriteHeight / 2;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height;
      this.vx = Math.random() * 0.1 + 0.1;
    }
  }

  const game = new Game(ctx, canvas.width, canvas.height);
  let lastTime = 1;

  const animate = (timestamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    game.update(deltaTime);
    game.draw();

    requestAnimationFrame(animate);
  };

  animate(0);
});