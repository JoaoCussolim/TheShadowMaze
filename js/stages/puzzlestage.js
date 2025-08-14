class PuzzleStage extends Stage {
    constructor(player) {
        super(player, '#222'); // Fundo escuro padrão

        this.exit = new Exit(750, 550);

        const wallsDefinition = [
            // Paredes Roxas
            new Wall(100, 100, 150, 20, 'purple'), new Wall(100, 120, 20, 100, 'purple'),
            new Wall(230, 120, 20, 100, 'purple'), new Wall(100, 220, 150, 20, 'purple'),
            new Wall(300, 100, 20, 140, 'purple'), new Wall(320, 100, 100, 20, 'purple'),
            new Wall(420, 100, 20, 80, 'purple'), new Wall(320, 160, 100, 20, 'purple'),
            new Wall(420, 180, 20, 60, 'purple'), new Wall(320, 220, 100, 20, 'purple'),

            // Paredes Amarelas
            new Wall(500, 150, 150, 20, 'yellow'), new Wall(650, 150, 20, 100, 'yellow'),
            new Wall(500, 250, 150, 20, 'yellow'), new Wall(500, 150, 20, 100, 'yellow'),
            new Wall(700, 300, 20, 150, 'yellow'), new Wall(550, 430, 170, 20, 'yellow'),

            // Paredes Verdes
            new Wall(150, 350, 20, 150, 'green'), new Wall(170, 350, 100, 20, 'green'),
            new Wall(270, 350, 20, 100, 'green'), new Wall(170, 470, 100, 20, 'green'),
            new Wall(350, 350, 150, 20, 'green'), new Wall(500, 350, 20, 100, 'green'),
            new Wall(350, 450, 150, 20, 'green'),
        ];

        this.wallGroups = {};
        wallsDefinition.forEach(wall => {
            if (!this.wallGroups[wall.visibleColor]) {
                this.wallGroups[wall.visibleColor] = {
                    color: wall.visibleColor,
                    walls: [],
                    boundingBox: null
                };
            }
            this.wallGroups[wall.visibleColor].walls.push(wall);
        });

        for (const color in this.wallGroups) {
            const group = this.wallGroups[color];
            const minX = Math.min(...group.walls.map(w => w.x));
            const minY = Math.min(...group.walls.map(w => w.y));
            const maxX = Math.max(...group.walls.map(w => w.x + w.width));
            const maxY = Math.max(...group.walls.map(w => w.y + w.height));
            group.boundingBox = {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY
            };
        }

        this.currentLightColor = 'purple';
    }

    handleCollision(player, wall) {
        if (wall.collidesWith(player)) {
            const overlapX = Math.min(player.x + player.radius - wall.x, wall.x + wall.width - (player.x - player.radius));
            const overlapY = Math.min(player.y + player.radius - wall.y, wall.y + wall.height - (player.y - player.radius));

            if (overlapX < overlapY) {
                if (player.x < wall.x + wall.width / 2) player.x -= overlapX;
                else player.x += overlapX;
            } else {
                if (player.y < wall.y + wall.height / 2) player.y -= overlapY;
                else player.y += overlapY;
            }
        }
    }

    update(deltaTime, lightCone) {
        this.enemies.forEach(enemy => {
            enemy.isParalyzed = this.isPointInLightCone(enemy, this.player);
            enemy.update(deltaTime);
        });

        for (const color in this.wallGroups) {
            const group = this.wallGroups[color];

            if (this.currentLightColor === group.color) {
                // VISÍVEL: Colide com cada parede individualmente
                group.walls.forEach(wall => {
                    this.handleCollision(this.player, wall);
                });
            } else {
                // INVISÍVEL: Colide com a bounding box do grupo
                const bboxAsWall = new Wall(group.boundingBox.x, group.boundingBox.y, group.boundingBox.width, group.boundingBox.height);
                this.handleCollision(this.player, bboxAsWall);
            }
        }

        // Checar colisão com a saída
        if (this.exit.collidesWith(this.player)) {
            console.log('Você encontrou a saída!');
        }
    }

    draw(ctx, player) {
        ctx.save();
        const light = player.lightCone;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.arc(player.x, player.y, light.distance, light.angle - light.spread / 2, light.angle + light.spread / 2);
        ctx.closePath();
        ctx.clip();

        let lightBackgroundColor;
        switch (this.currentLightColor) {
            case 'purple': lightBackgroundColor = '#481380'; break;
            case 'yellow': lightBackgroundColor = '#807513'; break;
            case 'green': lightBackgroundColor = '#138045'; break;
            default: lightBackgroundColor = '#222'; break;
        }

        ctx.fillStyle = lightBackgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Desenha apenas as paredes do grupo de cor correspondente
        if (this.wallGroups[this.currentLightColor]) {
            this.wallGroups[this.currentLightColor].walls.forEach(wall => wall.draw(ctx, this.currentLightColor));
        }

        this.exit.draw(ctx);
        ctx.restore();
    }

    setLightColor(color) {
        this.currentLightColor = color;
        console.log(`Cor da lanterna alterada para: ${this.currentLightColor}`);
    }
}