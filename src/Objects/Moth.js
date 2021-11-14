import 'phaser';

export default class Moth extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'moth');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = 80;

        this.moveTimer = scene.time.addEvent({
            delay: 660,
            startAt: Phaser.Math.Between(0, 330),
            callback: this.move,
            callbackScope: this,
            loop: true
        });

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.rand = new Phaser.Math.RandomDataGenerator();
    }

    move() {
        let r = this.rand.angle();
        this.body.setVelocityX(this.body.velocity.x + (Math.cos(r) * this.speed));
        this.body.setVelocityY(this.body.velocity.y + (Math.sin(r) * this.speed));
    }
}
