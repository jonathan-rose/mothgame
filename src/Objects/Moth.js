import 'phaser';
import { Game } from 'phaser';

export default class Moth extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, map) {
        super(scene, x, y, 'moth');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = 80;
        this.map = map;
        this.attractionRadius = 20;
        
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
        const attractionFactor = 1;

        this.map.setLayer("lights");
        var mothCircle = new Phaser.Geom.Circle(this.x, this.y, this.attractionRadius);
        var nearestLight = this.map.getTilesWithinShape(mothCircle);

        nearestLight.forEach(element => {
            // console.log(element.x, element.y);
            var distanceToElement = Phaser.Math.Distance.Between(this.x, this.y, element.x, element.y);
            var angleToElement = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(this.x, this.y, element.x, element.y));
            var attractionFactor = distanceToElement * 0.01;
            console.log(distanceToElement);
            console.log(attractionFactor);

            // let r = this.rand.angle();
            this.body.setVelocityX(this.body.velocity.x + (Math.cos(angleToElement) * this.speed * attractionFactor));
            this.body.setVelocityY(this.body.velocity.y + (Math.sin(angleToElement) * this.speed * attractionFactor));
        });

        // console.log(this.map.currentLayerIndex);
        // console.log(this.map.layers);
        // console.log(nearestLight);
        

        // I cannot seem to find any reference to the tilemap data from this.scene
        // Seems completely impossible

        // var lightsLayerIndex = this.map.getLayerIndexByName("lights");
        // console.log(this.map.width);

        // var layerData = this.map.getLayer(hazardsLayerIndex);
        // console.log(layerData.data);
        // this.map.getLayer(hazardsLayerIndex).visible = false;
        // console.log(this.map.getLayer(hazardsLayerIndex).visible);

        // var nearbyLights = this.map.getTilesWithinShape(Phaser.Geom.Circle(this.x, this.y, 100), hazardsLayerIndex)

        // var distance = Phaser.Math.Distance.Between(this.x, this.y, 100, 100);

  
    }
}
