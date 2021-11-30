import 'phaser';

export default class CreditsScene extends Phaser.Scene {
    constructor () {
        super('Credits');
    }

    create () {
        var config = this.game.config;
        this.add.image(config.width/2, config.height/2, 'creditsBG');

        this.creditsText = this.add.text(0, 0, 'Lament for the Moths – Tennessee Williams', { fontSize: '26px', fill: '#fff' });
        this.lamentStanzas = [
            this.add.text(100, config.height, 'A plague has stricken the moths, the moths are dying,\n\
their bodies are flakes of bronze on the carpet lying.\n\
Enemies of the delicate everywhere\n\
have breathed a pestilent mist into the air.', { fontSize: '18px', fill: '#fff' }),
            this.add.text(100, config.height + 200, 'Lament for the velvety moths, for the moths were lovely.\n\
Often their tender thoughts, for they thought of me,\n\
eased the neurotic ills that haunt the day.\n\
Now an invisible evil takes them away.', { fontSize: '18px', fill: '#fff' }),
            this.add.text(100, config.height + 400, 'I move through the shadowy rooms, I cannot be still,\n\
I must find where the treacherous killer is concealed.\n\
Feverishly I search and still they fall\n\
as fragile as ashes broken against a wall.', { fontSize: '18px', fill: '#fff' }),
            this.add.text(100, config.height + 600, 'Now that the plague has taken the moths away,\n\
who will be cooler than curtains against the day,\n\
who will come early and softly to ease my lot\n\
as I move through the shadowy rooms with a troubled heart?', { fontSize: '18px', fill: '#fff' }),
            this.add.text(100, config.height + 800, 'Give them, O mother of moths and mother of men,\n\
strength to enter the heavy world again,\n\
for delicate were the moths and badly wanted\n\
here in a world by mammoth figures haunted!', { fontSize: '18px', fill: '#fff' })
        ];

        this.zone = this.add.zone(config.width/2, config.height/2, config.width, config.height);

        Phaser.Display.Align.In.Center(
            this.creditsText,
            this.zone
        );

        this.creditsTween = this.tweens.add({
            targets: this.creditsText,
            y: -100,
            ease: 'linear',
            duration: 3000,
            delay: 1000,
            onComplete: this.destroy
        });

        this.madeByTween = this.tweens.add({
            targets: this.lamentStanzas,
            y: "-=" + (config.height + 600),
            ease: 'linear',
            duration: 48000,
            onComplete: function () {
                this.scene.start('Title');
            }.bind(this)
        });
    }
};
