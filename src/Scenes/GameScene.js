import 'phaser';
import Button from '../Objects/Button';

var moth;
var walls;


export default class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    }


    create ()
    {
        // Add background - add .setPipeline('Light2D') for Light Manager
        this.add.image(400, 300, 'houseBG');
        
        // Create physics group for walls
        walls = this.physics.add.staticGroup();

        //  Create members of walls group
        // walls.create(0, 0, 'wall');
        // walls.create(0, 100, 'wall');
        walls.createMultiple({ key: 'wall', repeat: 20})
        Phaser.Actions.SetXY(walls.getChildren(), 100, 200, 32);

        // Set origin of all members of walls 
        // Should happen after they have been added to group
        walls.setOrigin(0,0);

        // Add moth
        this.add.image(100, 100, 'moth');

        //  Set a collider between moth and walls
        this.physics.add.collider(moth, walls);

        // Checks to see moth overlaps with walls
        // Call mothCollision() if it does
        this.physics.add.overlap(moth, walls, mothCollision, null, this);

        // Add rectangle
        // var rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
        // var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

        // graphics.fillRectShape(rect);


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

        //Lights done with Light Manager (no mask?)
        //this.lights.enable().setAmbientColor(0x555555);
        // this.lights.enable();
        // var light = this.lights.addLight(400, 300, radius, 0xffffff, intensity);
    
    }

    update ()
    {
        // Add update
    }
};

function mothCollision (moth, walls)
{

}
