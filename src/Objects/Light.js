import 'phaser'

export default class Light extends Phaser.GameObjects.PointLight {

    constructor (scene, roomX, roomY) {
        super (scene, roomX, roomY);
        this.scene = scene;
        this.x = roomX;
        this.y = roomY;
        this.radius = 200;
        this.intensity = 0.06;
        this.attenuation = 0.1;
        this.color.setTo(255, 255, 255);

        scene.add.existing(this);
    };  
}