class Stage {
    constructor(player, backgroundColor) {
        this.player = player;
        this.backgroundColor = backgroundColor;
        this.enemies = [];
    }

    isPointInLightCone(point, player) {
        const dx = point.x - player.x;
        const dy = point.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > player.lightCone.distance) {
            return false; // Fora do alcance
        }

        const angleToPoint = Math.atan2(dy, dx);
        let angleDifference = Math.abs(player.lightCone.angle - angleToPoint);

        // Normaliza a diferença de ângulo
        if (angleDifference > Math.PI) {
            angleDifference = 2 * Math.PI - angleDifference;
        }

        return angleDifference <= player.lightCone.spread / 2;
    }

    update(deltaTime) {
        this.enemies.forEach(enemy => {
            // Paralisa o inimigo se ele estiver dentro do cone de luz
            enemy.isParalyzed = this.isPointInLightCone(enemy, this.player);
            enemy.update(deltaTime);
        });
    }

    draw(ctx, player) {
        ctx.save();

        const light = player.lightCone;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.arc(
            player.x, player.y,
            light.distance,
            light.angle - light.spread / 2,
            light.angle + light.spread / 2
        );
        ctx.closePath();

        // Tudo desenhado a partir de agora só aparecerá dentro do caminho acima.
        ctx.clip();

        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.enemies.forEach(enemy => enemy.draw(ctx));

        ctx.restore();
    }
}