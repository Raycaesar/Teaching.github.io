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

class Particle {
    constructor(effect, index){
        this.effect = effect;
        this.index = index;
        this.radius = Math.floor(Math.random() * 10 + 1);
        this.minRadius = this.radius;
        this.maxRadius = this.radius*10;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - 0.5;
        this.vy = Math.random() * 1 - 0.5;
        this.pushX = 0;
        this.pushY = 0;
        this.friction = 0.95;
        this.isExploding = false;
        this.explosionParticles = [];//
        this.explosionSize = 2; // Number of particles in the explosion
        this.explosionLife = 30; // Life span of each particle in frames
    }
    draw(context){
        if (!this.isExploding) {
    
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();



        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x - this.radius*0.2, this.y-this.radius*0.3, this.radius*0.6, 0, Math.PI * 2);
        context.fill();
        
        //context.stroke();
    }else {
        // Draw explosion particles
        this.explosionParticles.forEach(particle => {
            context.fillStyle = gradient + (particle.life / this.explosionLife); // Example color
            context.beginPath();
            context.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            context.fill();
        });
    }
}
    
    update(){
        if (this.effect.mouse.pressed){
            const dx = this.x - this.effect.mouse.x;
            const dy = this.y - this.effect.mouse.y;
            const distance = Math.hypot(dx, dy);
            //const force = (this.effect.mouse.radius / distance);
            if (distance < this.effect.mouse.radius && this.radius < this.maxRadius){
                this.radius +=2;
            }
        }
        if(this.radius > this.minRadius) this.radius -= 0.1;
        this.x += this.vx;
        this.y += this.vy;

        if(this.radius > this.maxRadius){ 
        this.explode();
        }
        if (this.isExploding) {
            this.explosionParticles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life--;
                // Remove particle if life is over
                if (particle.life <= 0) {
                    const index = this.explosionParticles.indexOf(particle);
                    this.explosionParticles.splice(index, 1);
                }
            });

            // Reset particle after explosion is done
            if (this.explosionParticles.length === 0) {
                this.radius = this.minRadius;
                this.reset();
                this.isExploding = false;
            }
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
            this.vy *= -1;
        }
    }
    explode(){
        this.isExploding = true;

        for (let i = 0; i < this.explosionSize; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1;
            this.explosionParticles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: this.explosionLife
            });
        }
    }
    reset(){
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}


class Effect {
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 200;
        this.createParticles();

        this.mouse = {
            x: this.width *0.5,
            y: this.height *0.5,
            pressed: false,
            radius: 60
        }

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight);
        });
        window.addEventListener('mousemove', e => {
            if (this.mouse.pressed){
                this.mouse.x = e.x;
                this.mouse.y = e.y;
            }
        });
        window.addEventListener('mousedown', e => {
            this.mouse.pressed = true;
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseup', e => {
            this.mouse.pressed = false;
        });
    }
    createParticles(){
        for (let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this, i));
        }
    }
    handleParticles(context){
        this.connectParticles(context);
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
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        const gradient = this.context.createLinearGradient(0,0, width, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'gold');
        gradient.addColorStop(1, 'orangered');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'white';
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}
const effect = new Effect(canvas, ctx);

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();