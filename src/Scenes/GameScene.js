import 'phaser';
import { Game, Scene } from 'phaser';
import Button from '../Objects/Button';
import Moth from '../Objects/Moth';

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
        const map = this.make.tilemap({key: "map1", tileWidth: 32, tileHeight: 32});
        const tileset = map.addTilesetImage("tiles1", "house1");

        // Create variables for each entity layer in JSON tileset
        const wallLayer = map.createLayer("walls", tileset, 0, 0);
        const windowsLayer = map.createLayer("windows", tileset, 0, 0);
        const hazardsLayer = map.createLayer("hazards", tileset, 0, 0);

        // Add temporary player
        // For testing only
        this.player = this.physics.add.sprite(100, 100, "moth");
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add colliders between temporary player and each tile layer
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, windowsLayer);
        this.physics.add.collider(this.player, hazardsLayer);

        // Specify which tiles on each layer the player can collide with
        // Parameters refer to tile IDs found via Tiled editor
        wallLayer.setCollisionBetween(0, 1);
        windowsLayer.setCollisionBetween(1, 2);
        hazardsLayer.setCollisionBetween(2, 3);

        // Moth sprite group (controls physics for all moths)
        this.moths = this.physics.add.group({
            allowGravity: false,
            dragX: 80,
            dragY: 80,
            bounceX: 0.75,
            bounceY: 0.75
        });

        // Randomly add moths for now
        for (var i = 0; i < 30; i++) {
            this.moths.add(
                new Moth(
                    this,
                    Phaser.Math.Between(20, 780),
                    Phaser.Math.Between(50, 500)
                )
            );
        }

        // Add colliders between moths and hazards layer
        this.physics.add.collider(this.moths, wallLayer);
        this.physics.add.collider(this.moths, windowsLayer, function(moth, windowsLayer) {

        });
        this.physics.add.collider(this.moths, hazardsLayer, function(moth, hazardsLayer) {
            moth.moveTimer.remove();
            moth.destroy();
            console.log("Moth dies...");
        });

        // Add rectangle


        var radius = 200;
        var intensity = 0.06;
        var attenuation = 0.1;
        var roomx = 190;
        var roomy = 370;

        var light = this.add.pointlight(roomx, roomy, 0, radius, intensity);
        light.color.setTo(255, 255, 255);
        light.attenuation = attenuation;

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
        // Temporary player control
        // if (this.cursors.up.isDown == true) {
        //     this.player.setVelocityY(-100);
        // }
    }
};
