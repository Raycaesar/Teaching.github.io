export class Explosion{
    constructor(game){
        this.game =game;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.image = document.getElementById("explosion")
        this.spriteWidth = 300;
        this.spriteHeight = 300;
        this.free =true;
        this.frameX = 0;
        this.frameY = Math.floor(Math.random()* 3);
        this.maxFrame = 22;
        this.animationTimer = 0;
        this.animationInterval = 1000/10;
    }
    draw(context){
        if(!this.free){
            context.drawImage(this.image, this.spriteHeight*this.frameX, this.spriteHeight*this.frameY,this.spriteWidth, this.spriteHeight, this.x - this.spriteWidth*0.5, this.y - this.spriteHeight*0.5, this.spriteWidth, this.spriteHeight);
        }

    }
    update(deltaTime){
        if(!this.free){
            if(this.animationTimer > this.animationInterval){
                this.frameX ++;
                if(this.frameX> this.maxFrame) this.reset();
                this.animationTimer = 0;
            }else{
                this.animationTimer += deltaTime;
            }
        }

    }
    reset() {
        this.free = true;
        this.frameX = 0;
        // Reset other necessary properties
    }
   
    start(x, y) {
        this.free = false;
        this.x = x;
        this.y = y;
        // Initialize other necessary properties
    }
    
}