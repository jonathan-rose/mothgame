import 'phaser'
import GameScene from '../Scenes/GameScene';

export default class Light extends Phaser.GameObjects.PointLight {

    constructor (scene, roomX, roomY, roomWidth, roomHeight, radius, intensity) {
        super (scene, roomX, roomY);
        this.scene = scene;
        this.x = roomX + (roomWidth / 2);
        this.y = roomY;
        this.maskWidth = roomWidth;
        this.maskHeight = roomHeight;
        this.radius = radius;
        this.intensity = intensity;
        this.attenuation = 0.1;
        this.color.setTo(255, 255, 255);

        var tileHeight = this.scene.map.tileHeight;

        // The lights will currently disappear when player clicks on any part of light radius
        // Even if it is masked
        // I haven't been able to fix this yet
        // Beth's method of using a Rectangle wouldn't work
        // getbounds function?
        // attach a setbounds method or member to the object? - ie clickRect
        this.setInteractive();
        this.on('pointerdown', function () {
            this.scene.map.setLayer("lights");
            var tileClicked = this.scene.map.getTileAtWorldXY(this.x, this.y);
            // tileClicked.setVisible(!this.visible);
            // this.setVisible(!this.visible); //Toggle doesn't work
        });

        // Add tile to lightsLayer for each room in RoomObjects layer
        var map = this.scene.map;
        // ID of chosen tile is not the same as the index of that tile in the Tileset array
        // This function uses GID for some reason, which is shifted right by 2
        // So tile 4 in the Tileset is GID 6
        // This is because the tileset for the background takes up the first 2 GID
        // this.map.tilesets will list all the GIDs in use
        map.putTileAtWorldXY(6, this.x, this.y, true, this.scene.cameras.main, "lights");

        // Add rectangle mask
        var graphics = new Phaser.GameObjects.Graphics(this.scene);
        // var room = graphics.fillRect(this.x - (this.maskWidth / 2), this.y - (tileHeight / 2), this.maskWidth, this.maskHeight);
        var room = graphics.fillRect(this.x - (this.maskWidth / 2), this.y, this.maskWidth, this.maskHeight);
        var mask = room.createGeometryMask();
        this.setMask(mask);

        scene.add.existing(this);
    }
}