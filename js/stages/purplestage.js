// PurpleStage.js
class PurpleStage extends Stage {
    constructor(player) {
        super(player, '#481380'); 
        
        this.enemies.push(new Enemy(100, 100, '#c493ff'));
        this.enemies.push(new Enemy(700, 500, '#c493ff'));
    }
}
