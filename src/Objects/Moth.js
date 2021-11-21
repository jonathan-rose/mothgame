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

        let r = this.rand.angle();
        this.body.setVelocityX(this.body.velocity.x + (Math.cos(r) * this.speed));
        this.body.setVelocityY(this.body.velocity.y + (Math.sin(r) * this.speed));

        var mothCircle = new Phaser.Geom.Circle(this.x, this.y, this.attractionRadius);
        var lightsInMothRadius = this.map.getTilesWithinShape(mothCircle, 
            {
            isNotEmpty: true, 
            isColliding: false, 
            hasInterestingFace: false
            },
            this.scene.cameras.main,
            "lights");

        // console.log(lightsInMothRadius);

        var nearbyLightsData = [];

        lightsInMothRadius.forEach(element => {

            // For testing only
            element.setSize(40, 40);

            //.pixelX and .pixelY are the top left of the tile
            // They are used because .x and .y return the values of the tile on the tile grid, not the world
            var elementCenterX = (element.pixelX + (element.width / 2));
            var elementCenterY = (element.pixelY + (element.height / 2));
            var distanceToElement = Phaser.Math.Distance.Between(this.x, this.y, elementCenterX, elementCenterY);
            var angleToElement = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, element.x, element.y));

            // Create array of distance and angle of current element
            var elementValues = [distanceToElement, angleToElement];

            // Add position and angle of current light to array
            // (Result is an array of arrays)
            // Then sort by lowest (nearest) to highest (furthest)
            nearbyLightsData.push(elementValues);
            nearbyLightsData.sort();

            // Show distance and angle of nearest light
            console.log(nearbyLightsData[0]);

            // Must create some way of using these values to pull the moth in

            var attractionFactor = 1; // Define attractionFactor here


        });  
    }
}
