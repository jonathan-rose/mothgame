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
        console.log(this);

        // Add background
        this.add.image(400, 300, 'sky');

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
        this.player = this.physics.add.sprite(50, 50, "moth");
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add colliders between player and each tile layer
        this.physics.add.collider(this.player, wallLayer);
        this.physics.add.collider(this.player, windowsLayer);
        this.physics.add.collider(this.player, hazardsLayer);

        // Specify which tiles on each layer the player can collide with
        // Parameters refer to tile IDs found via Tiled editor
        wallLayer.setCollisionBetween(0, 1);
        windowsLayer.setCollisionBetween(1, 2);
        hazardsLayer.setCollisionBetween(2, 3);

        // Add moth
        moth = new Moth(this, 400, 100);

        // just spam a bunch of moths for now
        for (var i = 0; i < 30; i++) {
            var m = new Moth(this, Phaser.Math.Between(20, 780), Phaser.Math.Between(50, 500));
        }
    }

    update () 
    {
        // Temporary player control
        // if (this.cursors.up.isDown == true) {
        //     this.player.setVelocityY(-100);
        // }
    }
};
