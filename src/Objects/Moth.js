import 'phaser';

export default class Moth extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'moth');
        this.scene = scene;
        this.x = x;
        this.y = y;

        this.moveTimer = scene.time.addEvent({
            delay: 660,
            startAt: Phaser.Math.Between(0, 330),
            callback: this.move,
            callbackScope: this,
            loop: true
        });

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setMass(0.1);
    }

    move()
    {
        this.body.setVelocityY(-100);
        this.body.setVelocityX(Phaser.Math.Between(-40, 40));
    }
}
