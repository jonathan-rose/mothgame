import 'phaser';
import Button from '../Objects/Button';
import Moth from '../Objects/Moth';

export default class OptionsScene extends Phaser.Scene {
    constructor () {
        super('Options');
    }


    create () {
        this.model = this.sys.game.globals.model;
        var config = this.game.config;

        this.add.image(config.width/2, config.height/2, 'optionsBG');

        //this.text = this.add.text(300, 100, 'Options', { fontSize: 40 , fill: '#000'});
        this.musicButton = this.add.image(285, 220, 'checkedBox');
        //this.musicText = this.add.text(250, 190, 'Music Enabled', { fontSize: 24 , fill: '#000'});

        this.soundButton = this.add.image(285, 350, 'checkedBox');
        //this.soundText = this.add.text(250, 290, 'Sound Enabled', { fontSize: 24, fill: '#000' });

        this.musicButton.setInteractive();
        this.soundButton.setInteractive();

        this.musicButton.on('pointerdown', function () {
            this.model.musicOn = !this.model.musicOn;
            this.updateAudio();
        }.bind(this));

        this.soundButton.on('pointerdown', function () {
            this.model.soundOn = !this.model.soundOn;
            this.updateAudio();
        }.bind(this));

        this.updateAudio();

        this.menuButton = new Button(this, 400, 500, 'Button', 'ButtonPressed', 'Menu', 'Title');
        this.updateAudio();

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
        for (var i = 0; i < 3; i++) {
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

    updateAudio() {
        if (this.model.musicOn === false) {
            this.musicButton.setTexture('box');
            this.sys.game.globals.bgMusic.stop();
            this.model.bgMusicPlaying = false;
        } else {
            this.musicButton.setTexture('checkedBox');
            if (this.model.bgMusicPlaying === false) {
                this.sys.game.globals.bgMusic.play();
                this.model.bgMusicPlaying = true;
            }
        }

        if (this.model.soundOn === false) {
            this.soundButton.setTexture('box');
        } else {
            this.soundButton.setTexture('checkedBox');
        }
    }
};
