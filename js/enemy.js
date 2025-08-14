class Enemy {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.color = color;

        this.pulseTimer = Math.random() * 5000; // Começa em tempo aleatório
        this.pulseDuration = 3000; // Tempo para pulsar e desaparecer
        this.visibleDuration = 1000; // Tempo que fica visível
        this.alpha = 0;
        this.isParalyzed = false;
    }

    update(deltaTime, lightCone, player) {
        if (this.isParalyzed) return;

        this.pulseTimer += deltaTime;

        // Ciclo de pulsação
        const cycleTime = this.pulseDuration + this.visibleDuration;
        if (this.pulseTimer > cycleTime) {
            this.pulseTimer = 0;
            this.alpha = 0;
        } else if (this.pulseTimer > this.pulseDuration) {
            // Fase visível
            this.alpha = 1;
            // AQUI: Adicionar lógica de colisão com o jogador
        } else {
            // Fase de pulsação (aparecendo)
            this.alpha = this.pulseTimer / this.pulseDuration;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = 'red' //this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}