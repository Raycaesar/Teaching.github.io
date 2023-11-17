// setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(ctx);
//const gradient = ctx.createLinearGradient(0,0,0,canvas.height);
const gradient = ctx.createRadialGradient(canvas.width*0.5, canvas.height*0.5, 100, canvas.width*0.5, canvas.height*0.5, 600)
gradient.addColorStop(0, "white");
gradient.addColorStop(0.05, "#bbcabb");
gradient.addColorStop(0.25, 'cyan');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(0.75, 'aqua');
gradient.addColorStop(0.85, 'lime');
gradient.addColorStop(1, 'gold');


ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'white';




class BulletController {
    bullets = [];
    timerTillNextBullet = 0;
  
    constructor(canvas) {
      this.canvas = canvas;
    }
  
    shoot(x, y, speed, damage, delay) {
      if (this.timerTillNextBullet <= 0) {
        this.bullets.push(new Bullet(x, y, speed, damage));
  
        this.timerTillNextBullet = delay;
      }
  
      this.timerTillNextBullet--;
    }
  
    draw(ctx) {
      this.bullets.forEach((bullet) => {
        if (this.isBulletOffScreen(bullet)) {
          const index = this.bullets.indexOf(bullet);
          this.bullets.splice(index, 1);
        }
        bullet.draw(ctx);
      });
    }

  
    isBulletOffScreen(bullet) {
      return bullet.y <= -bullet.height;
    }
    checkCollisionsWithParticles(particles) {
        this.bullets.forEach((bullet, bulletIndex) => {
            particles.forEach((particle, particleIndex) => {
                if (Math.hypot(bullet.x - particle.x, bullet.y - particle.y) < particle.radius) {
                    // Collision detected, grow the particle and remove the bullet
                    particle.grow();
                    particle.vy += 1;
                    this.bullets.splice(bulletIndex, 1);
    
                    // Check if the particle should explode
                    if (particle.radius > particle.maxRadius) {
                    }
                }
            });
        });
    }
  }  



class Player {
    constructor(x, y, bulletController) {
      this.x = x;
      this.y = y;
      this.bulletController = bulletController;
      this.width = 50;
      this.height = 50;
      this.speed = 4;
      this.image = new Image();
    this.image.src = "fighter.png";
    this.image1 = new Image();
    this.image1.src = "fighter1.png";
    this.canvas = canvas;
  
  
      document.addEventListener("keydown", this.keydown);
      document.addEventListener("keyup", this.keyup);
    }
    draw(ctx) {
        this.move();
        let currentImage = this.isMoving() ? this.image1:this.image ;
        ctx.drawImage(currentImage, this.x, this.y, this.width * 2, this.height * 1.5);
        ctx.strokeStyle = "yellow";
      //ctx.strokeRect(this.x+20, this.y, this.width*1.2, this.height*1.5);
        this.shoot();
    }
    isMoving() {
        return this.downPressed || this.upPressed || this.leftPressed || this.rightPressed;
    }
   
  
    shoot() {
      if (this.shootPressed) {
        const speed = 5;
        const delay = 7;
        const damage= 1;
        const bulletX = this.x + this.width / 2;
        const bulletY = this.y;
        this.bulletController.shoot(bulletX, bulletY, speed, damage, delay);
      }
    }
  
    move() {
      if (this.downPressed) {
          // Check if moving down would go past the bottom boundary
          if (this.y + this.height * 1.5 + this.speed <= this.canvas.height) {
              this.y += this.speed;
          }
      }
      if (this.upPressed) {
          // Check if moving up would go past the top boundary
          if (this.y - this.speed >= 0) {
              this.y -= this.speed;
          }
      }
      if (this.leftPressed) {
          // Check if moving left would go past the left boundary
          if (this.x - this.speed >= 0) {
              this.x -= this.speed;
          }
      }
      if (this.rightPressed) {
          // Check if moving right would go past the right boundary
          if (this.x + this.width * 2 + this.speed <= this.canvas.width) {
              this.x += this.speed;
          }
      }
  }
  
    collideWith(particle) {
        // Adjusted dimensions to better match the visual representation
        const adjustedWidth = this.width * 1.2;
        const adjustedHeight = this.height * 1.5;
        const offsetX = 20; // Offset to align with the visual representation
    
        // Find the closest point to the circle within the adjusted rectangle
        const closestX = Math.max(this.x + offsetX, Math.min(particle.x, this.x + offsetX + adjustedWidth));
        const closestY = Math.max(this.y, Math.min(particle.y, this.y + adjustedHeight));
    
        // Calculate the distance between the circle's center and this closest point
        const distanceX = particle.x - closestX;
        const distanceY = particle.y - closestY;
    
        // Calculate the squared distance
        const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    
        // Adjust the player's effective radius
        const playerEffectiveRadius = Math.min(adjustedWidth, adjustedHeight) / 7; // Reduced the effective radius
    
        // Consider using a smaller fraction of the particle's radius
        const collisionRadius = particle.radius * 0.35; // Using 75% of the particle's radius
    
        // Check if the distance is less than the sum of the radii
        const totalRadius = playerEffectiveRadius + collisionRadius;
        return distanceSquared < (totalRadius * totalRadius);
    }
    
    
    
    
    
    keydown = (e) => {
      if (e.code === "ArrowUp") {
        this.upPressed = true;
      }
      if (e.code === "ArrowDown") {
        this.downPressed = true;
      }
      if (e.code === "ArrowLeft") {
        this.leftPressed = true;
      }
      if (e.code === "ArrowRight") {
        this.rightPressed = true;
      }
      if (e.code === "Space") {
        this.shootPressed = true;
      }
    };
  
    keyup = (e) => {
      if (e.code === "ArrowUp") {
        this.upPressed = false;
      }
      if (e.code === "ArrowDown") {
        this.downPressed = false;
      }
      if (e.code === "ArrowLeft") {
        this.leftPressed = false;
      }
      if (e.code === "ArrowRight") {
        this.rightPressed = false;
      }
      if (e.code === "Space") {
        this.shootPressed = false;
      }
    };
  }

class Particle {
    constructor(effect, index){
        this.effect = effect;
        this.index = index;
        this.radius = Math.floor(Math.random() * 10 + 5);
        this.minRadius = this.radius;
        this.maxRadius = this.radius*10;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height * 0.5 - this.radius * 2);
        this.vx = Math.random() * 1 - 0.5;
        this.vy = 0;//Math.random() * 1 - 0.5;
       
        this.friction = -1;
        this.isExploding = false;
        this.toBeRemoved = false;
        
    
    }
   

    draw(context){
        if (!this.isExploding) {
    
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        //context.strokeRect(this.x, this.y,2*this.radius,2*this.radius);
        //context.strokeStyle = "yellow";


        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x - this.radius*0.2, this.y-this.radius*0.3, this.radius*0.6, 0, Math.PI * 2);
        context.fill();
        
        //context.stroke();
    }  else {
      
            
        }
    }
    
    
    update(){
    
        if(this.radius > this.minRadius) this.radius -= 0.01;
        this.x += this.vx;
        this.y += this.vy;

        if (this.radius > this.maxRadius) {
            this.toBeRemoved = true; // Mark for removal
        }
        
       if (this.x < this.radius){
            this.x = this.radius;
            this.vx *= -1;
        } else if (this.x > this.effect.width - this.radius){
            this.x = this.effect.width - this.radius;
            this.vx *= -1;
        }
        if (this.y < this.radius){
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y > this.effect.height - this.radius){
            this.y = this.effect.height - this.radius;
            this.vy *= this.friction;
        }
        
    }
    grow() {
        this.radius += 5; // Adjust growth rate as needed
    }

}



class Effect {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 300;
        this.createParticles();
        this.score = 0;
    

    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this, i));
        }
    }
    handleParticles(context) {
        this.connectParticles(context);
        this.particles = this.particles.filter(particle => {
            if (particle.toBeRemoved) {
                this.score++; // Increase score for each removed particle
                return false;
            }
            return true;
        });

        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectParticles(context){
        const maxDistance = 80;
        for (let a = 0; a < this.particles.length; a++){
            for (let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
}

class Bullet {
    colors = [
        "#32CD32", // Lime Green
        "#FFFF00", // Yellow
        "#00FFFF", // Cyan
        "#FF00FF", // Magenta
        "#FFA500", // Orange
        "#FF0000", // Red
        "#FFFFFF", // White
        "#ADD8E6", // Light Blue
        "#FFFACD",
        "#40E0D0",
        "#90EE90",
        "#FFD700",
        "#FF7F50",
        "#FFC0CB",
    ];

    constructor(x, y, speed) {
        this.x = x+23;
        this.y = y;
        this.speed = speed;

        this.width = 5;
        this.height = 15;
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.y -= this.speed;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

 
const bulletController = new BulletController(canvas);
const player = new Player(
  canvas.width / 2.2,
  canvas.height / 1.3,
  bulletController
);


const effect = new Effect(canvas, ctx);

const jsConfetti = new JSConfetti();


function triggerVictory() {
    console.log(jsConfetti); // Check if jsConfetti is correctly initialized
    jsConfetti.addConfetti({
        confettiRadius: 6,
        confettiNumber: 500,
    });
    displayVictoryMessage(ctx);
}


function displayVictoryMessage(ctx) {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'gold';
    ctx.textAlign = 'center';
    ctx.fillText('Victory!', canvas.width / 2, canvas.height / 2);
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    player.draw(ctx);
    bulletController.draw(ctx);
    bulletController.checkCollisionsWithParticles(effect.particles);

    let gameOver = false;
    effect.particles.forEach(particle => {
        if (player.collideWith(particle)) {
            console.log("Game Over");
            gameOver = true;
        }
    });

    // Display the score
    displayScore(ctx, effect.score);

    if (!gameOver && effect.particles.length > 0) {
        requestAnimationFrame(animate);
    } else if (effect.particles.length === 0) {
        triggerVictory();
    }
}




function displayScore(ctx, score) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 10, 30); // Adjust position as needed
}

function displayGameOver(ctx) {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2); // Center game over message
}

animate();
