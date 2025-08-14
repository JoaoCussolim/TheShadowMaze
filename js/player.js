class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.color = 'black';
        this.speed = 3;
        this.keys = {};

        this.lightCone = {
            angle: 0,
            spread: Math.PI / 4,
            distance: 300
        };
    }

    handleKeyDown(key) { this.keys[key.toLowerCase()] = true; }
    handleKeyUp(key) { this.keys[key.toLowerCase()] = false; }

    update(canvasWidth, canvasHeight) {
        if (this.keys['w']) this.y -= this.speed;
        if (this.keys['s']) this.y += this.speed;
        if (this.keys['a']) this.x -= this.speed;
        if (this.keys['d']) this.x += this.speed;

        // Colisão com a borda esquerda
        if (this.x - this.radius < 0) {
            this.x = this.radius;
        }

        // Colisão com a borda direita
        if (this.x + this.radius > canvasWidth) {
            this.x = canvasWidth - this.radius;
        }

        // Colisão com a borda superior
        if (this.y - this.radius < 0) {
            this.y = this.radius;
        }

        // Colisão com a borda inferior
        if (this.y + this.radius > canvasHeight) {
            this.y = canvasHeight - this.radius;
        }
    }

    updateLightDirection(mouse) {
        this.lightCone.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}