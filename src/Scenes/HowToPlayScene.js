import 'phaser';
import Button from '../Objects/Button';
import Moth from '../Objects/Moth';

export default class HowToPlayScene extends Phaser.Scene {
    constructor () {
        super('HowToPlay');
    }


    create () {
        var config = this.game.config;
        this.model = this.sys.game.globals.model;
        this.add.image(config.width/2, config.height/2, 'HowToPlayBG');

        this.menuButton = new Button(this, config.width/4, 520, 'Button', 'ButtonPressed', 'Menu', 'Title');
        this.gameButton = new Button(this, config.width - config.width/4, 525, 'Button', 'ButtonPressed', 'Play', 'Game');

          // Moth sprite group (controls physics for all moths)
        this.moths = this.physics.add.group({
            allowGravity: false,
            collideWorldBounds: true,
            dragX: 80,
            dragY: 80,
            bounceX: 0.75,
            bounceY: 0.75
        });

        // Randomly add moths for now
        for (var i = 0; i < 2; i++) {
            let m = new Moth(this, Phaser.Math.Between(20, 780), Phaser.Math.Between(50, 500));
            m.moveTimer.remove();
            m.moveTimer = this.time.addEvent({
                delay: 330,
                startAt: Phaser.Math.Between(0, 330),
                callback: m.simpleMove,
                callbackScope: m,
                loop: true
            });
            this.moths.add(m);
        }

    }

};
