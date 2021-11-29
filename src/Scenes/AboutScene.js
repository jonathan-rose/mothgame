import 'phaser';
import Button from '../Objects/Button';
import Moth from '../Objects/Moth';

export default class AboutScene extends Phaser.Scene {
    constructor () {
        super('About');
    }


    create () {
        var config = this.game.config;
        this.model = this.sys.game.globals.model;
        this.add.image(config.width/2, config.height/2, 'aboutBG');

        //this.add.text(config.width*0.1, config.height*0.11, 'About Page \n\nSpace to write about your game \nor a how to play. \n', { align: 'center', fontSize: '25px', fill: '#000' });
        this.menuButton = new Button(this, 400, 485, 'Button', 'ButtonPressed', 'Menu', 'Title');

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
        for (var i = 0; i < 4; i++) {
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
