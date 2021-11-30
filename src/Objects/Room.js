import 'phaser'
import { Game } from 'phaser';
import GameScene from '../Scenes/GameScene';

export default class Room extends Phaser.GameObjects.Rectangle {
    constructor (scene, roomX, roomY, roomWidth, roomHeight, radius, intensity, name) {
        super (scene);
        this.scene = scene;
        this.x = roomX;
        this.y = roomY;
        this.width = roomWidth;
        this.height = roomHeight;
        this.radius = radius;
        this.intensity = intensity;
        this.name = name;
        this.attenuation = 0.06;

        var map = this.scene.map;
        map.putTileAtWorldXY(6, this.x + (roomWidth / 2), this.y, true, this.scene.cameras.main, "lights");

        var light = new Phaser.GameObjects.PointLight(
            this.scene, 
            this.x + (roomWidth / 2), 
            this.y,
            0xffffff,
            this.radius,
            this.intensity,
            this.attenuation,
            );

        light.name = name;
        
        this.scene.add.existing(light);
        // Can't work out how to add this to the scene while also getting mask to work
        
        // Add rectangle mask
        var graphics = new Phaser.GameObjects.Graphics(this.scene);
        var room = graphics.fillRect(this.x, this.y, this.width, this.height);
        var mask = room.createGeometryMask();
        this.setMask(mask);

        // For some bizarre reason this only works if the X and Y of the rectangle are
        // set to 0, 0 and then offset by +65 pixels. I have NO idea why.
        var clickRegion = new Phaser.Geom.Rectangle(0 + 65, 0 + 65, this.width, this.height);

        this.setInteractive(clickRegion, Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', function () {
            console.log("Click " + this.name);
            var targetLight = this.scene.children.list.find(el => el.name === this.name);
            targetLight.visible = !targetLight.visible;
        });

        this.scene.add.existing(this);
    }
}
