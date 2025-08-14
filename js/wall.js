class Wall {
    constructor(x, y, width, height, visibleColor) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visibleColor = visibleColor; // Cor da lanterna que revela esta parede
        this.color = 'gray'; // Cor da parede quando visível
    }

    draw(ctx, currentLightColor) {
        if (currentLightColor === this.visibleColor) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        // Se a cor da lanterna não for a correta, não desenhamos nada.
    }

    collidesWith(player) {
        // A colisão SEMPRE ocorre, independente da visibilidade
        return (
            player.x + player.radius > this.x &&
            player.x - player.radius < this.x + this.width &&
            player.y + player.radius > this.y &&
            player.y - player.radius < this.y + this.height
        );
    }
}