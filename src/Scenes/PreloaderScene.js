import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor () {
        super('Preloader');
    }

    preload () {
        // add logo image
        var logo = this.add.image(400, 120, 'Logo');
        logo.setScale(0.45);

        // display progress bar
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);

        // update progress bar
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        // update file progress text
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });

        // load assets needed in our game

        this.load.audio('bgMusic', ['assets/audio/devonshire-waltz-allegretto-by-kevin-macleod-from-filmmusic-io.mp3']);
        this.load.audio('pah1', ['assets/audio/sfx/pah1.mp3']);
        this.load.audio('pah2', ['assets/audio/sfx/pah2.mp3']);
        this.load.audio('pah3', ['assets/audio/sfx/pah3.mp3']);
        this.load.audio('death1', ['assets/audio/sfx/death1.mp3']);
        this.load.audio('death2', ['assets/audio/sfx/death2.mp3']);
        this.load.audio('death3', ['assets/audio/sfx/death3.mp3']);

        this.load.image('moth', 'assets/img/moth.png');
        this.load.spritesheet('mothSprite', 'assets/img/mothspritesheet.png', { frameWidth: 32, frameHeight: 20 });
        this.load.image('dust', 'assets/img/dustParticle.png')

        this.load.image('menuBG', 'assets/img/TitlePageMattersSide.png');
        this.load.image('aboutBG', 'assets/img/AboutBG.png');
        this.load.image('optionsBG', 'assets/img/OptionsBG.png');

        this.load.image('Button', 'assets/img/button1.png');
        this.load.image('ButtonPressed', 'assets/img/button1selected.png');
        this.load.image('box', 'assets/img/lamp.png');
        this.load.image('checkedBox', 'assets/img/lampChecked.png');
        this.load.image('lampIcon', 'assets/img/lampBig.png');

        this.load.image('houseBG', 'assets/img/house.png');

        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            this.sys.game.globals.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
            this.game.registry.set('pah1', this.sound.add('pah1', { volume: 0.5 }));
            this.game.registry.set('pah2', this.sound.add('pah2', { volume: 0.5 }));
            this.game.registry.set('pah3', this.sound.add('pah3', { volume: 0.5 }));
            this.game.registry.set('death1', this.sound.add('death1', { volume: 0.5 }));
            this.game.registry.set('death2', this.sound.add('death2', { volume: 0.5 }));
            this.game.registry.set('death3', this.sound.add('death3', { volume: 0.5 }));
            this.ready();
        }.bind(this));

        this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);
    }

    create () {
    }

    init () {
        this.readyCount = 0;
    }

    ready () {
        this.scene.start('Title');
        // this.readyCount++;
        // if (this.readyCount === 20) {
        //     this.scene.start('Credits');
        // }
    }
};
