import 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor () {
        super('Boot');
    }

    preload () {
        this.load.image('Logo', 'assets/img/lampBig.png');
    }

    create () {
        this.scene.start('Preloader');
    }
};
