// YellowStage.js
class YellowStage extends Stage {
    constructor(player) {
        super(player, '#807513'); // Fundo amarelo escuro
        this.enemies.push(new Enemy(400, 150, '#fff38a'));
    }
}
