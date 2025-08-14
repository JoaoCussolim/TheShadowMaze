class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        this.player = new Player(this.width / 2, this.height / 2);
        this.mouse = { x: this.width, y: this.height / 2 };

        // Agora temos apenas um stage
        this.currentStage = new PuzzleStage(this.player);

        this.lastTime = 0;
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => this.player.handleKeyDown(e.key));
        window.addEventListener('keyup', (e) => this.player.handleKeyUp(e.key));

        window.addEventListener('keydown', (e) => {
            let newColor;
            if (e.key === '1') newColor = 'purple';
            else if (e.key === '2') newColor = 'yellow';
            else if (e.key === '3') newColor = 'green';

            if (newColor) {
                this.currentStage.setLightColor(newColor);
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(deltaTime) {
        this.player.update();
        this.player.updateLightDirection(this.mouse);
        this.currentStage.update(deltaTime, this.player.lightCone);
    }

    draw() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.currentStage.draw(this.ctx, this.player);
    }

    start() {
        this.setupInputHandlers();
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}