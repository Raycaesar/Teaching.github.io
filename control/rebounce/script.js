// Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height = 700;

// Styling
ctx.lineWidth = 15; // Corrected the case of 'W' in lineWidth
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.25, 'Indigo');
gradient.addColorStop(0.5, 'cyan');
gradient.addColorStop(0.75, 'magenta');
gradient.addColorStop(1, 'navy');

ctx.fillStyle = gradient;
// ctx.strokeStyle = 'cyan'; // Only include if you plan to use stroke()

class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 20 + 15;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = 10;
        this.gravity = 0.1; // Adjust for animation, 9.8 is too high for typical canvas animation
        this.vx = Math.random() * 2 - 1; // Give some initial horizontal velocity
        this.vy = 0; // Vertical velocity starts at 0
        this.bounceFactor = -0.9; // Typically less than 1 but greater than 0
        //this.time = 0; // Initialize time
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    update() {
        //this.time += 0.1; // Increment time by a small amount for each frame
        this.vy += this.gravity //* this.time + (this.vx/4); // Gravity increases vertical velocity over time
        this.x += this.vx;
        this.y += this.vy;

        // If the particle hits the bottom of the canvas
        if (this.y > this.effect.height - this.radius) {
            this.y = this.effect.height - this.radius; // Reset position to the bottom
            this.vy *= this.bounceFactor; // Apply friction to the vertical velocity
            this.vx *= this.bounceFactor; // Apply friction to the horizontal velocity
        }

        // If the particle hits the sides of the canvas
        if (this.x > this.effect.width - this.radius || this.x < this.radius) {
            this.vx *= -1; // Invert the horizontal velocity to simulate bounce
        }
    }
}

class Effect {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 50;
        this.createParticles();
    }
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    handleParticles() {
        this.particles.forEach(particle => {
            particle.draw(this.context); // Pass context to draw method
            particle.update();
        });
    }
}

const effect = new Effect(canvas, ctx);



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles();
    requestAnimationFrame(animate);
}

animate();
