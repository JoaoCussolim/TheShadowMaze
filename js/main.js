window.addEventListener('load', function () {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    game.start();
});