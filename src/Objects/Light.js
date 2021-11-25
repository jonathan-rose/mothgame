import 'phaser'

export default class Light extends Phaser.GameObjects.PointLight {

    constructor (scene, roomX, roomY, roomWidth, roomHeight, radius) {
        super (scene, roomX, roomY);
        this.scene = scene;
        this.x = roomX;
        this.y = roomY;
        this.maskWidth = roomWidth;
        this.maskHeight = roomHeight;
        this.radius = radius;
        this.intensity = 0.06;
        this.attenuation = 0.1;
        this.color.setTo(255, 255, 255);

        console.log(this.type, this.x, this.y);

        // var clickRect = new Phaser.Geom.Rectangle(this.x - (maskWidth / 2), this.y - (maskHeight / 2), maskWidth, maskHeight);
        // var maskRect = new Phaser.Geom.Rectangle(this.x, this.y, 40, 40);

        // var clickRect = new Phaser.GameObjects.Rectangle(this.scene, this.x, this.y, maskWidth, maskHeight, 0xff0000);
        // scene.add.existing(clickRect);

        // Add rectangle mask
        var tileHeight = this.scene.map.tileHeight;
        var graphics = new Phaser.GameObjects.Graphics(this.scene);
        var room = graphics.fillRect(this.x - (this.maskWidth / 2), this.y - (tileHeight / 2), this.maskWidth, this.maskHeight);
        var mask = room.createGeometryMask();
        this.setMask(mask);

        // this.setInteractive(clickRect, Phaser.Geom.Rectangle.Contains);
        // this.on('pointerdown', function () {
        //     // console.log(this);
        //     this.setVisible(!this.setVisible);
        //     console.log("click");
        // });


        // room.setInteractive(rect, Phaser.Geom.Rectangle.Contains);

        // room.on('pointerdown', function () {
        //     this.setVisible(!this.visible);
        //     console.log("click");
        // });

        scene.add.existing(this);
    }
}