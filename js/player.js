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

    update() {
        if (this.keys['w']) this.y -= this.speed;
        if (this.keys['s']) this.y += this.speed;
        if (this.keys['a']) this.x -= this.speed;
        if (this.keys['d']) this.x += this.speed;
    }

    updateLightDirection(mouse) {
        // Calcula o ângulo entre o jogador e o mouse
        this.lightCone.angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}