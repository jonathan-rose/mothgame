import 'phaser';
import Moth from './Moth';

const originalWidth = 15;
const originalHeight = 60;
const originalMothChance = 0;
const mothChanceDelta = 3;
const mothChanceThreshhold = 2;

export default class Window extends Phaser.GameObjects.Rectangle {

    constructor(scene, windowTile) {
        super(scene,
              (windowTile.pixelX + (windowTile.width / 2)),
              (windowTile.pixelY + (windowTile.height / 2)),
              originalWidth,
              originalHeight,
              0xc2f0fb);
        this.scene = scene;
        this.isOpen = false;
        this.mothChance = originalMothChance;
        this.setInteractive();

        // We need to know which side of the house the window is on.
        this.side = 'right';
        if (this.x < this.scene.sys.game.canvas.width / 2) {
            this.side = 'left';
        }

        // Check for moth spawning on a loop
        this.openTimer = scene.time.addEvent({
            delay: 500,
            startAt: Phaser.Math.Between(0, 500),
            callback: this.maybeSpawnMoths,
            callbackScope: this,
            loop:true
        });

        this.on('pointerdown', (pointer => {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }));

        this.scene.add.existing(this);
    }

    getBounds() {
        return Phaser.Geom.Rectangle(this.x, this.y, this.width, 60);
    }

    open() {
        this.isOpen = true;

        // Add a tween to animate opening the window
        this.scene.tweens.add({
            targets: this,
            duration: 300,
            height: 0
        });
    }

    close() {
        this.isOpen = false;
        this.mothChance = originalMothChance;

        // Add a tween to animate closing the window
        this.scene.tweens.add({
            targets: this,
            duration: 300,
            height: originalHeight
        });
    }

    /**
    * While the window is open we want it to be more and more likely
    * that a moth enters the window.
    *
    * We increment `mothChance` and then generate a random number
    * between 0 and `mothChanceDelta` less than `mothChance`. If this value is
    * more than `mothChanceThreshhold` we generate a new moth.
    *
    * NOTE: Don't worry about negatives, Phaser.Math.Between(0, -n) = 0
    *
    * This way there will be a period where no moths spawn, followed
    * by a period where they occasionally spawn, ending with
    * near-constant moth spawning.
    *
    * There may well be a better way of doing this :P
    */
    maybeSpawnMoths() {
        if (this.isOpen) {
            let max = (this.mothChance - mothChanceDelta);
            if (Phaser.Math.Between(0, max) > mothChanceThreshhold) {
                // We want the moths to start off-screen and the fly in through the window.
                var startY = this.y + Phaser.Math.Between(-90, 90);
                var startX = this.scene.sys.game.canvas.width + 100;
                var endX = this.x - 50;
                if (this.side == 'left') {
                    startX = -100;
                    endX = this.x + 50;
                }
                let moth = new Moth(this.scene, startX, startY);
                this.scene.tweens.add({
                    targets: moth,
                    duration: 300,
                    x: endX,
                    y: this.y,
                    ease: 'cubic.out',
                    onComplete: function() {this.isEscaping = true;},
                    onCompleteScope: moth
                });
                this.scene.moths.add(moth);
            }
            this.mothChance++;
        }
    }
}
