import 'phaser';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import AboutScene from './Scenes/AboutScene';
import HowToPlayScene from './Scenes/HowToPlayScene';
import CreditsScene from './Scenes/CreditsScene';

import Model from './Model';

class Game extends Phaser.Game {
    constructor () {
        super(config);
        const model = new Model();
        this.globals = { model, bgMusic: null };
        this.scene.add('Boot', BootScene);
        this.scene.add('Preloader', PreloaderScene);
        this.scene.add('Title', TitleScene);
        this.scene.add('Options', OptionsScene);
        this.scene.add('About', AboutScene);
        this.scene.add('HowToPlay', HowToPlayScene);
        this.scene.add('Game', GameScene);
        this.scene.add('Credits', CreditsScene);

        this.scene.start('Boot');
    }
}

window.game = new Game();
