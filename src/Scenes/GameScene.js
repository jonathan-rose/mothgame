import 'phaser';
import Moth from '../Objects/Moth';

var moth;
var walls;


export default class GameScene extends Phaser.Scene {
    constructor () {
        super('Game');
    }


    create ()
    {
        // Add background
        this.add.image(400, 300, 'sky');

        // Create physics group for walls
        walls = this.physics.add.staticGroup();

        //  Create members of walls group
        // walls.create(0, 0, 'wall');
        // walls.create(0, 100, 'wall');
        walls.createMultiple({ key: 'wall', repeat: 20});
        Phaser.Actions.SetXY(walls.getChildren(), 100, 200, 32);

        // Set origin of all members of walls
        // Should happen after they have been added to group
        walls.setOrigin(0,0);

        // Add moth
        moth = new Moth(this, 400, 100);

        // just spam a bunch of moths for now
        for (var i = 0; i < 30; i++) {
            var m = new Moth(this, Phaser.Math.Between(20, 780), Phaser.Math.Between(50, 500));
        }


        //  Set a collider between moth and walls
        this.physics.add.collider(moth, walls);

        // Checks to see moth overlaps with walls
        // Call mothCollision() if it does
        this.physics.add.overlap(moth, walls, mothCollision, null, this);

        // Add rectangle
        // var rect = new Phaser.Geom.Rectangle(250, 200, 300, 200);
        // var graphics = this.add.graphics({ fillStyle: { color: 0x0000ff } });

        // graphics.fillRectShape(rect);
    }

    update ()
    {
        // Add update
    }
};

function mothCollision (moth, walls)
{

}
