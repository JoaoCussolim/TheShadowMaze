// Stage.js
class Stage {
    constructor(player, backgroundColor) {
        this.player = player;
        this.backgroundColor = backgroundColor;
        this.enemies = [];
    }

    // Método para checar se um ponto (ex: inimigo) está no cone de luz
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

        // 1. Criar o caminho do cone de luz (clipping mask)
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

        // 2. Aplicar o "clip"
        // Tudo desenhado a partir de agora só aparecerá dentro do caminho acima.
        ctx.clip();

        // 3. Desenhar o "mundo" deste stage
        // Desenha o fundo da cor específica
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Desenha os inimigos deste stage
        this.enemies.forEach(enemy => enemy.draw(ctx));

        // AQUI: Desenhe os elementos do puzzle (paredes, etc.) para este stage.

        // 4. Restaurar o contexto para remover o clip
        ctx.restore();
    }
}