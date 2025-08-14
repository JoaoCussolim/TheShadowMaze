class PuzzleStage extends Stage {
    constructor(player) {
        super(player, '#222'); // Fundo escuro padrão

        this.exit = new Exit(750, 550);
        this.walls = [
            new Wall(100, 100, 150, 20, 'purple'),
            new Wall(100, 120, 20, 100, 'purple'),
            new Wall(230, 120, 20, 100, 'purple'),
            new Wall(100, 220, 150, 20, 'purple'),
            new Wall(300, 100, 20, 140, 'purple'),
            new Wall(320, 100, 100, 20, 'purple'),
            new Wall(420, 100, 20, 80, 'purple'),
            new Wall(320, 160, 100, 20, 'purple'),
            new Wall(420, 180, 20, 60, 'purple'),
            new Wall(320, 220, 100, 20, 'purple'),

            new Wall(500, 150, 150, 20, 'yellow'),
            new Wall(650, 150, 20, 100, 'yellow'),
            new Wall(500, 250, 150, 20, 'yellow'),
            new Wall(500, 150, 20, 100, 'yellow'),
            new Wall(700, 300, 20, 150, 'yellow'),
            new Wall(550, 430, 170, 20, 'yellow'),

            new Wall(150, 350, 20, 150, 'green'),
            new Wall(170, 350, 100, 20, 'green'),
            new Wall(270, 350, 20, 100, 'green'),
            new Wall(170, 470, 100, 20, 'green'),
            new Wall(350, 350, 150, 20, 'green'),
            new Wall(500, 350, 20, 100, 'green'),
            new Wall(350, 450, 150, 20, 'green'),
        ];

        this.currentLightColor = 'purple'; // Cor inicial da lanterna
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
        ctx.clip(); // <-- A partir daqui, tudo só é desenhado dentro do cone

        let lightBackgroundColor;
        switch (this.currentLightColor) {
            case 'purple':
                lightBackgroundColor = '#481380'; // Roxo
                break;
            case 'yellow':
                lightBackgroundColor = '#807513'; // Amarelo
                break;
            case 'green':
                lightBackgroundColor = '#138045'; // Verde
                break;
            default:
                lightBackgroundColor = '#222'; // Cor padrão
        }
        
        ctx.fillStyle = lightBackgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        this.walls.forEach(wall => wall.draw(ctx, this.currentLightColor));

        this.exit.draw(ctx);

        ctx.restore();
    }

    update(deltaTime, lightCone) {
        // Atualiza a lógica dos inimigos (se houver)
        this.enemies.forEach(enemy => {
            enemy.isParalyzed = this.isPointInLightCone(enemy, this.player);
            enemy.update(deltaTime);
        });

        // Verifica colisões com as paredes (SEMPRE ativo)
        this.walls.forEach(wall => {
            if (wall.collidesWith(this.player)) {
                // Lógica de reação à colisão (ex: impedir o movimento)
                // Para simplificar, vamos apenas ajustar a posição do jogador
                const overlapX = Math.min(
                    this.player.x + this.player.radius - wall.x,
                    wall.x + wall.width - (this.player.x - this.player.radius)
                );
                const overlapY = Math.min(
                    this.player.y + this.player.radius - wall.y,
                    wall.y + wall.height - (this.player.y - this.player.radius)
                );

                if (overlapX < overlapY) {
                    // Colisão horizontal
                    if (this.player.x < wall.x) {
                        this.player.x -= overlapX;
                    } else {
                        this.player.x += overlapX;
                    }
                } else {
                    // Colisão vertical
                    if (this.player.y < wall.y) {
                        this.player.y -= overlapY;
                    } else {
                        this.player.y += overlapY;
                    }
                }
            }
        });

        if (this.exit.collidesWith(this.player)) {
            console.log('Você encontrou a saída!');
        }
    }

    setLightColor(color) {
        this.currentLightColor = color;

        console.log(`Cor da lanterna alterada para: ${this.currentLightColor}`);
    }
}