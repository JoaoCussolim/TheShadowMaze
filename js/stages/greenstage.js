
class GreenStage extends Stage {
    constructor(player) {
        super(player, '#138045'); // Fundo verde escuro
        this.enemies.push(new Enemy(150, 450, '#8affc1'));
        this.enemies.push(new Enemy(600, 200, '#8affc1'));
    }
}