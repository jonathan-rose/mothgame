import 'phaser';
import Button from '../Objects/Button';
import Moth from '../Objects/Moth';

export default class TitleScene extends Phaser.Scene {
    constructor () {
	super('Title');
    }

    preload () {
        this.load.image("lighttile", "assets/tiles/10x10tiles.png");
        this.load.tilemapTiledJSON('menumap', "assets/tiles/Menu.json");
    }

    create () {
	    var config = this.game.config;

        this.add.image(config.width/2, config.height/2, 'menuBG');

        // Game - Head to Rocket Select page
        this.gameButton = new Button(this, config.width*0.75, config.height/2 - 100, 'Button', 'ButtonPressed', 'Play', 'Game');

        // Options
        this.optionsButton = new Button(this, config.width*0.75, config.height/2, 'Button', 'ButtonPressed', 'Options', 'Options');

        // About
        this.aboutButton = new Button(this, config.width*0.75, config.height/2 + 100, 'Button', 'ButtonPressed', 'About', 'About');

        this.model = this.sys.game.globals.model;
        this.sys.game.globals.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
        if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
            this.sys.game.globals.bgMusic.play();
            this.model.bgMusicPlaying = true;
        }


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
        for (var i = 0; i < 10; i++) {
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
