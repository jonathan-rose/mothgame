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

        // Add light image in location of lights as defined on tilemap
        // putTileAtWorldXY used GIDs instead of tile IDs
        // Use console.log(this.map.tilesets) to see tilesets and GIDs
        var map = this.scene.map;
        map.putTileAtWorldXY(6, this.x + (roomWidth / 2), this.y, true, this.scene.cameras.main, "lights");
        var newLightTile = map.getTileAtWorldXY(this.x + (roomWidth / 2), this.y, true, this.scene.cameras.main, "lights");
        newLightTile.inactive = false;
        
        // Create point light at midpoint of room ceiling
        var light = new Phaser.GameObjects.PointLight(
            this.scene, 
            this.x + (roomWidth / 2), 
            this.y,
            0xffffff,
            this.radius,
            this.intensity,
            this.attenuation,
            );

        // Give pointlight unique name based on the room name
        light.name = name;
        
        // Add rectangle mask to hide light outside of room
        var graphics = new Phaser.GameObjects.Graphics(this.scene);
        var room = graphics.fillRect(this.x, this.y, this.width, this.height);
        var mask = room.createGeometryMask();
        light.setMask(mask);

        // Add masked light to scene
        this.scene.add.existing(light);

        // Set clickable region that matches the dimensions of the room
        // For some bizarre reason this only works if the X and Y of the rectangle are
        // set to 0, 0 and then offset by +65 pixels. I have NO idea why.
        var clickRegion = new Phaser.Geom.Rectangle(0 + 65, 0 + 65, this.width, this.height);

        // Set the clickRegion to interactive
        // Then find the pointlight in the scene that shares the room name
        this.setInteractive(clickRegion, Phaser.Geom.Rectangle.Contains);
        this.on('pointerdown', function () {
            var targetLight = this.scene.children.list.find(el => el.name === this.name);
            if (this.scene.sys.game.globals.model.soundOn === true) {
                if (targetLight.visible) {
                    this.scene.game.registry.get('lightOff').play();
                } else {
                    this.scene.game.registry.get('lightOn').play();
                }
            }
            targetLight.visible = !targetLight.visible;
            var map = this.scene.map;
            var targetTile = map.getTileAtWorldXY(this.x + (roomWidth / 2), this.y, true, this.scene.cameras.main, "lights");
            targetTile.inactive = !targetTile.inactive;
        });

        this.scene.add.existing(this);
    }
}
