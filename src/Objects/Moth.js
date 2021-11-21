import 'phaser';

export default class Moth extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'moth');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = 80;
        this.attractionRadius = 200;
        this.rand = new Phaser.Math.RandomDataGenerator();

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
        var lightsInMothRadius = this.scene.map.getTilesWithinShape(mothCircle,
            {
            isNotEmpty: true,
            isColliding: false,
            hasInterestingFace: false
            },
            this.scene.cameras.main,
            "lights");

        var nearbyLightsData = [];

        lightsInMothRadius.forEach(element => {
            //.pixelX and .pixelY are the top left of the tile
            // They are used because .x and .y return the values of the tile on the tile grid, not the world
            var elementCenterX = (element.pixelX + (element.width / 2));
            var elementCenterY = (element.pixelY + (element.height / 2));
            var distanceToElement = Phaser.Math.Distance.Between(this.x, this.y, elementCenterX, elementCenterY);
            var angleToElementRad = Phaser.Math.Angle.Between(this.x, this.y, elementCenterX, elementCenterY);
            var angleToElementDeg = Phaser.Math.RadToDeg(angleToElementRad);

            // Create array of distance and angle of current element
            var elementValues = [distanceToElement, angleToElementRad];

            // Add position and angle of current light to array
            // (Result is an array of arrays)
            // Then sort by lowest (nearest) to highest (furthest)
            nearbyLightsData.push(elementValues);
        });

        nearbyLightsData.sort((e1, e2) => {
            return e1[0] - e2[0];
        });

        if (nearbyLightsData.length > 0) {
            // Make the moth point at the nearest light
            this.setRotation(nearbyLightsData[0][1] + ((Phaser.Math.PI2)/4));

            var attractionFactor = 1; // Define attractionFactor here
        }
    }

    destroy() {
        // Make sure we remove all timers first before calling the
        // parent `destroy` method to remove the sprite.
        this.moveTimer.remove();
        super.destroy();
    }
}
