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
        this.load.image("house1", "assets/tiles/10x10tiles.png");
        this.load.tilemapTiledJSON('map1', "assets/tiles/10x10tiles.json");
    }

    create () {


         // Add background - add .setPipeline('Light2D') for Light Manager
        this.add.image(400, 300, 'houseBG');

        // Use JSON from preload() to make tilemap
        // Use image from reload() to setup tileset
        // Change to this.map
        const tileWidth = 10;
        const tileHeight = 10;
        this.map = this.make.tilemap({key: "map1", tileWidth: tileWidth, tileHeight: tileHeight});
        // First parameter should be name of tileset as seen in Tiled tilesets list
        const tileset = this.map.addTilesetImage("10x10tileset", "house1");

        console.log(this.map.tilesets);

        // Create variables for each entity layer in JSON tileset
        const wallLayer = this.map.createLayer("walls", tileset, 0, 0);
        const windowsLayer = this.map.createLayer("windows", tileset, 0, 0);
        const hazardsLayer = this.map.createLayer("hazards", tileset, 0, 0);
        const lightsLayer = this.map.createLayer("lights", tileset, 0, 0);
        const roomsLayer = this.map.getObjectLayer("RoomObjects");

        this.rooms = this.add.group();
        roomsLayer.objects.forEach(o => {
            // this.add.rectangle(t.x, t.y, t.width, t.height, 0xff0000);
            // Custom properties such as radius are found using an array search
            // These are set as property in Tiled custom properties
            // When new custom properties are added to a Tiled object, the order of properties in array can change
            // By searching for the property by name, we avoid problems if more custom properties are added in future
            var radius = o.properties.find(el => el.name === "radius").value;
            var intensity = o.properties.find(el => el.name === "intensity").value;
            this.rooms.add(new Light(this, o.x, o.y, o.width, o.height, radius, intensity));
        })

        // Create window control objects
        this.windows = this.add.group();
        windowsLayer.getTilesWithin(0, 0, tileWidth, tileHeight, {isNotEmpty: true}).forEach(t => {
            // console.log(t);
            this.windows.add(new Window(this, t));
        });
        
        // Create pointlights from lights layer
        // this.lights = this.add.group();
        // lightsLayer.getTilesWithin(0, 0, tileWidth, tileHeight, {isNotEmpty: true}).forEach(t => {
        //     // console.log(t);
        //     this.lights.add(new Light(this, t.getCenterX(), t.getCenterY(), 200, 150, 200));
        // });

        // Specify which tiles on each layer the player can collide with
        // Parameters refer to tile IDs found via Tiled editor
        wallLayer.setCollision(2);
        windowsLayer.setCollision(5);
        hazardsLayer.setCollision(4);
        lightsLayer.setCollision(3);

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
        this.physics.add.collider(this.moths, lightsLayer, function(moth, lightsLayer) {
            console.log("Ow...");
        });
    
    }
    update ()
    {

    }
};
