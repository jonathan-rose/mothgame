import 'phaser';
import { Game, Scene } from 'phaser';
import Button from '../Objects/Button';
import Moth from '../Objects/Moth';
import Room from '../Objects/Room';
import Window from '../Objects/Window';

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
        this.playing = true;
        this.escapeCount = 0;
        this.deadCount = 0;

        var config = this.game.config;
        this.model = this.sys.game.globals.model;

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

        // Create variables for each entity layer in JSON tileset
        let wallLayer = this.map.createLayer("walls", tileset, 0, 0);
        let windowsLayer = this.map.createLayer("windows", tileset, 0, 0);
        let hazardsLayer = this.map.createLayer("hazards", tileset, 0, 0);
        let lightsLayer = this.map.createLayer("lights", tileset, 0, 0);
        let roomsLayer = this.map.getObjectLayer("RoomObjects");

        this.rooms = this.add.group();
        roomsLayer.objects.forEach(o => {
            // this.add.rectangle(t.x, t.y, t.width, t.height, 0xff0000);
            // Custom properties such as radius are found using an array search
            // These are set as property in Tiled custom properties
            // When new custom properties are added to a Tiled object, the order of properties in array can change
            // By searching for the property by name, we avoid problems if more custom properties are added in future
            var radius = o.properties.find(el => el.name === "radius").value;
            var intensity = o.properties.find(el => el.name === "intensity").value;
            this.rooms.add(new Room(this, o.x, o.y, o.width, o.height, radius, intensity, o.name));
        });

        // Create window control objects
        this.windows = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        windowsLayer.getTilesWithin(0, 0, this.map.width, this.map.height, {isNotEmpty: true}).forEach(t => {
            this.windows.add(new Window(this, t));
        });

        // Specify which tiles on each layer the player can collide with
        // Parameters refer to tile GIDs
        // Use console.log(this.map.tilesets) to see tilesets and GIDs
        wallLayer.setCollision(2);
        hazardsLayer.setCollision(4);
        lightsLayer.setCollision(6);

        // Moth sprite group (controls physics for all moths)
        this.moths = this.physics.add.group({
            allowGravity: false,
            dragX: 80,
            dragY: 80,
            bounceX: 0.75,
            bounceY: 0.75
        });

        // Randomly add moths for now
        for (var i = 0; i < 4; i++) {
            let m = new Moth(this, Phaser.Math.Between(140, 640), Phaser.Math.Between(220, 520));
            m.isEscaping = true;
            this.moths.add(m);
        }

        // Add colliders between moths and hazards layer
        this.physics.add.collider(this.moths, wallLayer);
        let context = this;
        this.physics.add.collider(this.moths, this.windows, function(m, w) {
            if (m.isEscaping && w.isOpen) {
                context.escapeCount++;
                m.escape();
            }
        });

        this.physics.add.collider(this.moths, hazardsLayer, function(moth, hazardsLayer) {

        });

        this.physics.add.collider(this.moths, lightsLayer, function(moth, lightsLayer) {
            moth.loseHealth(5);
        });

        this.mothEscapedText = this.add.text(
            config.width * 0.02,
            config.height * 0.04,
            "Moths escaped: 0",
            {align: 'center',
             fontSize: '24px',
             fill: '#49D49D'}
        );

        this.mothDeadText = this.add.text(
            config.width * 0.02,
            config.height * 0.09,
            "Moths killed: 0",
            {align: 'center',
             fontSize: '24px',
             fill: '#EF233C'}
        );

        this.mothRemainingText = this.add.text(
            config.width * 0.6,
            config.height * 0.04,
            "Moths remaining: 0",
            {align: 'center',
             fontSize: '24px',
             fill: '#FFF'}
        );
    }

    update() {
        this.mothEscapedText.setText("Moths escaped: " + this.escapeCount);
        this.mothDeadText.setText("Moths killed: " + this.deadCount);
        this.mothRemainingText.setText("Moths remaining: " + this.moths.children.entries.length);
        if (this.playing && this.noMothsRemaining()) {
            this.playing = false;
            this.time.addEvent({
                delay: 1000,
                callback: this.endGame,
                callbackScope: this
            });
        }
    }

    noMothsRemaining() {
        return this.moths.children.entries.length == 0;
    }

    endGame() {
        this.model.highscore = this.escapeCount - this.deadCount;
        this.scene.start('Credits');
    }
};
