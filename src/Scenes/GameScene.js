import 'phaser';
import { Game, Scene } from 'phaser';
import Button from '../Objects/Button';
import Light from '../Objects/Light';
import Moth from '../Objects/Moth';
import Window from '../Objects/Window';

var moth;

export default class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    }

    preload () {
        //Move to PreloaderScene before release?
        this.load.image("house1", "assets/tiles/house1.png");
        this.load.tilemapTiledJSON('map1', "assets/tiles/house1.json");
    }

    create () {


         // Add background - add .setPipeline('Light2D') for Light Manager
        this.add.image(400, 300, 'houseBG');

        // Use JSON from preload() to make tilemap
        // Use image from reload() to setup tileset
        // Change to this.map
        const tileWidth = 32;
        const tileHeight = 32;
        this.map = this.make.tilemap({key: "map1", tileWidth: tileWidth, tileHeight: tileHeight});
        const tileset = this.map.addTilesetImage("tiles1", "house1");

        // Create variables for each entity layer in JSON tileset
        const wallLayer = this.map.createLayer("walls", tileset, 0, 0);
        const windowsLayer = this.map.createLayer("windows", tileset, 0, 0);
        const hazardsLayer = this.map.createLayer("hazards", tileset, 0, 0);
        const lightsLayer = this.map.createLayer("lights", tileset, 0, 0);

        // Create window control objects
        this.windows = this.add.group();
        windowsLayer.getTilesWithin(0, 0, tileWidth, tileHeight, {isNotEmpty: true}).forEach(t => {
            console.log(t);
            this.windows.add(new Window(this, t));
        });

        // Create pointlights from lights layer
        this.lights = this.add.group();
        lightsLayer.getTilesWithin(0, 0, tileWidth, tileHeight, {isNotEmpty: true}).forEach(t => {
            console.log(t);
            this.lights.add(new Light(this, t.getCenterX(), t.getCenterY()));
        });

        // Specify which tiles on each layer the player can collide with
        // Parameters refer to tile IDs found via Tiled editor
        wallLayer.setCollisionBetween(0, 1);
        windowsLayer.setCollisionBetween(1, 2);
        hazardsLayer.setCollisionBetween(2, 3);
        lightsLayer.setCollisionBetween(3, 4);

        // Moth sprite group (controls physics for all moths)
        this.moths = this.physics.add.group({
            allowGravity: false,
            dragX: 80,
            dragY: 80,
            bounceX: 0.75,
            bounceY: 0.75
        });

        // Randomly add moths for now
        for (var i = 0; i < 1; i++) {
            this.moths.add(
                new Moth(
                    this,
                    Phaser.Math.Between(20, 780),
                    Phaser.Math.Between(50, 500),
                    // 100,
                    // 200
                )
            );
        }

        // Add colliders between moths and hazards layer
        this.physics.add.collider(this.moths, wallLayer);
        this.physics.add.collider(this.moths, windowsLayer, function(moth, windowsLayer) {

        });
        this.physics.add.collider(this.moths, hazardsLayer, function(moth, hazardsLayer) {
            moth.destroy();
            console.log("Moth dies...");
        });
        this.physics.add.collider(this.moths, lightsLayer);


        // var radius = 200;
        // var intensity = 0.06;
        // var attenuation = 0.1;
        var roomx = 190;
        var roomy = 370;

        // var light = this.add.pointlight(roomx, roomy, 0, radius, intensity);
        // light.color.setTo(255, 255, 255);
        // light.attenuation = attenuation;

        var light = new Light(this, roomx, roomy);

        // Add rectangle mask

        var graphics = this.make.graphics();
        var room = graphics.fillRect(roomx-100, roomy-30, 200, 150);
        var rect = new Phaser.Geom.Rectangle(roomx-100, roomy-30, 200, 150);
        var mask = room.createGeometryMask();

        room.setInteractive(rect, Phaser.Geom.Rectangle.Contains);

        light.setMask(mask);

        room.on('pointerdown', function () {
            light.setVisible(!light.visible);
            console.log("click");
        });



    }

    update ()
    {

    }
};
