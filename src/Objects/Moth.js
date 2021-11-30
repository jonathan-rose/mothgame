import 'phaser';

export default class Moth extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'mothSprite');
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.speed = 80;
        this.attractionRadius = 200;
        this.rand = new Phaser.Math.RandomDataGenerator();
        this.targetLayer = "lights";
        this.health = 150;
        this.isEscaping = false;
        this.setInteractive();

        this.moveTimer = scene.time.addEvent({
            delay: 330,
            startAt: Phaser.Math.Between(0, 330),
            callback: this.move,
            callbackScope: this,
            loop: true
        });

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.rand = new Phaser.Math.RandomDataGenerator();

        this.scene.anims.create({
            key: 'flap',
            frames: this.anims.generateFrameNumbers('mothSprite'),
            frameRate: 12
        });

        this.play({ key: 'flap', repeat: -1 });

        var particles = scene.add.particles('dust');
        particles.createEmitter({
            angle: { min: 240, max: 300 },
            speed: { min: 100, max: 250 },
            quantity: { min: 20, max: 40 },
            lifespan: 500,
            alpha: { start: 1, end: 0 },
            rotate: { start: 0, end: 360, ease: 'Back.easeOut' },
            gravityY: 800,
            on: false
        });

        this.on('pointerdown', function (pointer) {
            if (scene.sys.game.globals.model.soundOn === true) {
                let sounds = ['pah1', 'pah2', 'pah3'];
                let randSound = sounds[Math.floor(Math.random()*sounds.length)]
                scene.game.registry.get(randSound).play();
            }
            particles.emitParticleAt(pointer.x, pointer.y);            
        });

        var currentRoom = this.getCurrentRoom();
        if (currentRoom === undefined) {
            return;
        } else {
            this.currentRoomRadius = currentRoom.properties.find(el => el.name === "radius").value;
            this.currentRoomIntensity = currentRoom.properties.find(el => el.name === "intensity").value;
        }
    }

    move() {
       
        // Update tint based on damage
        if (this.health <= 90 && this.health > 70) {
            this.setTint(0xFFBABA);
        } else if (this.health <= 70 && this.health > 50) {
            this.setTint(0xFF6666);
        } else if (this.health <= 50 && this.health > 30) {
            this.setTint(0xFF4A4A);
        } else if (this.health <= 30) {
            this.setTint(0xFF0000);
        }
      
        // Maintain some random movement for personality and unpredictability
        let r = this.rand.angle();
        // console.log(r);
        this.body.setVelocityX(this.body.velocity.x + (Math.cos(r) * this.speed));
        this.body.setVelocityY(this.body.velocity.y + (Math.sin(r) * this.speed));

        // Create a circule around the moth of predefined radius
        // Look for tiles in tilemap that belong to targeted layer
        // Possible variable for state of light?
        // Moth only selects from list those that are set to on / true / active or whatever
        var mothCircle = new Phaser.Geom.Circle(this.x, this.y, this.attractionRadius);
        var lightsInMothRadius = this.scene.map.getTilesWithinShape(
            mothCircle,
            {isNotEmpty: true,
             isColliding: false,
             hasInterestingFace: false},
            this.scene.cameras.main,
            this.targetLayer);

        // Declare these variables at this point
        // They are used in multiple functions below
        var nearbyLightsData = [];
        var attractionFactor = 1;

        lightsInMothRadius.forEach(element => {
            // Ignore lights that are off or obstructed by walls
            if (
                element.inactive == true
                || !this.canSee(element)
            ) {
                return;
            } else {
                //.pixelX and .pixelY are the top left of the tile
                // They are used because .x and .y return the values of the tile on the tile grid, not the world
                var elementCenterX = (element.pixelX + (element.width / 2));
                var elementCenterY = (element.pixelY + (element.height / 2));
                var distanceToElement = Phaser.Math.Distance.Between(this.x, this.y, elementCenterX, elementCenterY);
                var angleToElementRad = Phaser.Math.Angle.Between(this.x, this.y, elementCenterX, elementCenterY);

                // As distance to light decreases, so does attractionFactor
                // This is then later used to set the sprites bounce
                // Result is less bounce when moth is closer to light
                attractionFactor = ((1 - (10 / distanceToElement)) * 0.75);
                // console.log(distanceToElement, attractionFactor);

                // Add position and angle of current light to nearbyLightsData array
                // (Result is an array of arrays)
                var elementValues = [distanceToElement, angleToElementRad];
                nearbyLightsData.push(elementValues);
            }
        });

        // Sort array by lowest (nearest) to highest (furthest)
        nearbyLightsData.sort((e1, e2) => {
            return e1[0] - e2[0];
        });

        // Only run rotation and move if there is at least 1 element in array
        if (nearbyLightsData.length > 0) {
            // Make the moth point at the nearest light
            this.setRotation(nearbyLightsData[0][1] + ((Phaser.Math.PI2)/4));

            // Make moth move in direction of nearest light
            this.body.setVelocityX(this.body.velocity.x + (Math.cos(nearbyLightsData[0][1]) * (this.speed * (1 + (this.currentRoomIntensity * 2 )))));
            this.body.setVelocityY(this.body.velocity.y + (Math.sin(nearbyLightsData[0][1]) * (this.speed * (1 + (this.currentRoomIntensity * 2 )))));
            // console.log(attractionFactor);
            this.body.setBounce(attractionFactor);
        } else {
            var newAngle = Phaser.Math.Angle.RotateTo(this.rotation, this.rand.rotation(), this.rand.realInRange(0, 0.5));
            this.setRotation(newAngle);
        }

        if (this.health <= 0) {
            if (this.scene.sys.game.globals.model.soundOn === true) {
                let sounds = ['death1', 'death2', 'death3'];
                let randSound = sounds[Math.floor(Math.random()*sounds.length)]
                this.scene.game.registry.get(randSound).play();
            }
            this.destroy();
        }
    }

    /**
    * Does the moth have line of sight to a light?
    *
    * We can check this by essentially doing ray-casting. We construct
    * a line from our moth to the light and collide it with the
    * tilemap walls layer. If we get a hit then we know our sight is
    * obstructed.
    */
    canSee(light) {
        let sightLine = new Phaser.Geom.Line(this.x, this.y, light.pixelX, light.pixelY);
        let obstructingWalls = this.scene.map.getTilesWithinShape(
            sightLine,
            {isNotEmpty: true,
             isColliding: true,
             hasInterestingFace: false},
            this.scene.cameras.main,
            "walls"
        );
        return (obstructingWalls.length == 0);
    }

    simpleMove() {
        // Maintain some random movement for personality and unpredictability
        let r = this.rand.angle();
        // console.log(r);
        this.body.setVelocityX(this.body.velocity.x + (Math.cos(r) * this.speed));
        this.body.setVelocityY(this.body.velocity.y + (Math.sin(r) * this.speed));
        this.setRotation(r + ((Phaser.Math.PI2)/4));
    }

    escape() {
        let targetY = this.y + Phaser.Math.Between(-90, 90);
        let targetX = -100;
        if (this.x > this.scene.sys.game.canvas.width / 2) {
            targetX = this.scene.sys.game.canvas.width + 100;
        }
        this.scene.tweens.add({
            targets: this,
            duration: 800,
            x: targetX,
            y: targetY,
            ease: 'linear',
            onComplete: this.destroy,
            onCompleteScope: this
        });
        // Don't want to add more of these tweens next frame.
        this.isEscaping = false;
    }

    destroy() {
        // Make sure we remove all timers first before calling the
        // parent `destroy` method to remove the sprite.
        this.moveTimer.remove();
        super.destroy();
    }

    gainHealth(value) {
        this.health = this.health + value;
    }

    loseHealth(value) {
        this.health = this.health - (value + (this.currentRoomIntensity * 10));
        console.log(this.health);
    }

    getCurrentRoom() {
        if (this.scene.scene.key != "Game") {
            return;
        } else {
            var map = this.scene.map;
            var mothX = this.x;
            var mothY = this.y;
            var currentRoom = map.findObject("RoomObjects", function(object) {
                var room = new Phaser.Geom.Rectangle(object.x, object.y, object.width, object.height);
                var mothRoom = Phaser.Geom.Rectangle.Contains(room, mothX, mothY);
                if (mothRoom == true) {
                    return object;
                }
            });
            return currentRoom;
        }
    }
}
