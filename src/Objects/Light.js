import 'phaser'
import GameScene from '../Scenes/GameScene';

export default class Light extends Phaser.GameObjects.PointLight {

    constructor (scene, roomX, roomY, roomWidth, roomHeight, radius) {
        super (scene, roomX, roomY);
        this.scene = scene;
        this.x = roomX + (roomWidth / 2);
        this.y = roomY;
        this.maskWidth = roomWidth;
        this.maskHeight = roomHeight;
        this.radius = radius;
        this.intensity = 0.06;
        this.attenuation = 0.1;
        this.color.setTo(255, 255, 255);

        // The lights will currently disappear when player clicks on any part of light radius
        // Even if it is masked
        // I haven't been able to fix this yet
        // Beth's method of using a Rectangle wouldn't work
        this.setInteractive();
        this.on('pointerdown', function () {
            this.scene.map.setLayer("lights");
            var tileClicked = this.scene.map.getTileAtWorldXY(this.x, this.y);
            tileClicked.setVisible(!this.visible);
            this.setVisible(!this.visible); //Toggle doesn't work
        });

        // Add rectangle mask
        var tileHeight = this.scene.map.tileHeight;
        var graphics = new Phaser.GameObjects.Graphics(this.scene);
        // var room = graphics.fillRect(this.x - (this.maskWidth / 2), this.y - (tileHeight / 2), this.maskWidth, this.maskHeight);
        var room = graphics.fillRect(this.x - (this.maskWidth / 2), this.y, this.maskWidth, this.maskHeight);
        var mask = room.createGeometryMask();
        this.setMask(mask);

        scene.add.existing(this);
    }
}