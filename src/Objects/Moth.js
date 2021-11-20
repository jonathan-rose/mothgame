import 'phaser';
import { Game } from 'phaser';
import GameScene from '../Scenes/GameScene';

export default class Moth extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, map) {
        super(scene, x, y, 'moth');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = 80;
        this.map = map;
        this.attractionRadius = 100;
        
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

        // Moth will stop dead if not lights are found within attractionRadius
        // Must be fixed

        var mothCircle = new Phaser.Geom.Circle(this.x, this.y, this.attractionRadius);
        var nearestLight = this.map.getTilesWithinShape(mothCircle, 
            {
            isNotEmpty: true, 
            isColliding: false, 
            hasInterestingFace: false
            },
            this.scene.cameras.main,
            "lights");

        console.log(nearestLight);

        nearestLight.forEach(element => {

            var distanceToElement = Phaser.Math.Distance.Between(this.x, this.y, element.pixelX, element.pixelY);
            var angleToElement = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, element.pixelX, element.pixelY));

            // Must create someway of using these values to pull the moth in

            var attractionFactor = 1; // Define attractionFactor here

            let r = this.rand.angle();
            this.body.setVelocityX(this.body.velocity.x + (Math.cos(angleToElement) * this.speed * attractionFactor));
            this.body.setVelocityY(this.body.velocity.y + (Math.sin(angleToElement) * this.speed * attractionFactor));
        });  
    }
}
