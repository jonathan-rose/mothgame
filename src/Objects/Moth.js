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
        this.health = 100;
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
            scene.model = scene.sys.game.globals.model;
            if (scene.model.soundOn === true) {
                let sounds = ['pah1', 'pah2', 'pah3'];
                let randSound = sounds[Math.floor(Math.random()*sounds.length)]
                scene.game.registry.get(randSound).play();
            }
            particles.emitParticleAt(pointer.x, pointer.y);            
        });
    }

    move() {
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
        var lightsInMothRadius = this.scene.map.getTilesWithinShape(mothCircle,
            {
            isNotEmpty: true,
            isColliding: false,
            hasInterestingFace: false
            },
            this.scene.cameras.main,
            this.targetLayer);

        // lightsInMothRadius.forEach(el => {
        //     console.log(el);
        // });

        // Declare these variables at this point
        // They are used in multiple functions below
        var nearbyLightsData = [];
        var attractionFactor = 1;

        lightsInMothRadius.forEach(element => {
            if (element.inactive == true) {
                return;
            } else {
                //.pixelX and .pixelY are the top left of the tile
                // They are used because .x and .y return the values of the tile on the tile grid, not the world
                var elementCenterX = (element.pixelX + (element.width / 2));
                var elementCenterY = (element.pixelY + (element.height / 2));
                var distanceToElement = Phaser.Math.Distance.Between(this.x, this.y, elementCenterX, elementCenterY);
                var angleToElementRad = Phaser.Math.Angle.Between(this.x, this.y, elementCenterX, elementCenterY);
                // var angleToElementDeg = Phaser.Math.RadToDeg(angleToElementRad);

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
            this.body.setVelocityX(this.body.velocity.x + (Math.cos(nearbyLightsData[0][1]) * this.speed));
            this.body.setVelocityY(this.body.velocity.y + (Math.sin(nearbyLightsData[0][1]) * this.speed));
            // console.log(attractionFactor);
            this.body.setBounce(attractionFactor);
        } else {
            var newAngle = Phaser.Math.Angle.RotateTo(this.rotation, this.rand.rotation(), this.rand.realInRange(0, 0.5));
            this.setRotation(newAngle);
        }

        if (this.health <= 0) {
            this.destroy();
        }
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
        this.health = this.health - value;        
    }
}
