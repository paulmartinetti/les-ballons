// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  
*  Depths
*  1. nuage - 100
*  2. ballons attérris / s'élèvent - 52-70
*  3. terre - 51
*  4. ballons s'eloignent 50-0
*
*
*
*/

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    // game / scene stats at the beginning
    this.setup = {
        minSpeed: 0.5,
        maxSpeed: 1.25,
        minDepth: 52,
        maxDepth: 70,
        minScale: 0.6,
        maxScale: 1
    };

    // float state FT -- > TT
    this.float = {
        speed: 0.25,
        minDepth: 0,
        maxDepth: 51
    };

    // balloon colors
    this.colorsA = ['violet', 'rouge', 'vert', 'jaune', 'orange'];
    // store current color
    this.curColorInd = 4;

    // balloons
    this.balloonA = [];

    // sounds
    this.popSound = this.sound.add('pop1');
    this.fff = this.sound.add('fff');
    this.land = this.sound.add('land');

};

// executed once, after assets were loaded
gameScene.create = function () {

    // load clouds - not interactive yet
    let nuage = this.add.sprite(this.gameW / 2, 0, 'nuage').setDepth(100);

    // lightning flash pops neglected balloons
    this.foudre = this.add.sprite(this.gameW / 2, 100, 'foudre').setDepth(99);
    this.foudre.alpha = 0;
    // transparency tween (transitioning alpha)
    this.foudre.alphaTween = this.tweens.add({
        targets: this.foudre,
        alpha: 1,
        duration: 100,
        repeat: 3,
        onComplete: function () {
            this.foudre.alpha = 0;
        },
        onCompleteScope: this,
        paused: true
    });

    // add color selector - 57 px diameter circles w 1 px margin
    let colors = this.add.sprite(29.5, this.gameH - 300, 'colors', 4).setInteractive().setDepth(101);
    //colors.angle = -90;this.gameW / 2this.gameH - 29.5
    colors.on('pointerdown', function (pointer, localX, localY) {
        // including half a margin
        let step = 58;

        for (let i = 0; i < this.colorsA.length; i++) {
            //console.log(Math.round(localY) - step);
            if (localY - step < 0) {
                colors.setFrame(i);
                this.curColorInd = i;
                break;
            } else {
                // next color on selector
                step += 58;
            }

        }
    }, this);

    // set ground and make interactive
    this.terre = this.add.sprite(0, this.gameH - 300, 'terre').setOrigin(0, 0).setDepth(51).setInteractive();
    //terre.depth = 51;
    this.terre.on('pointerdown', function (pointer, localX, localY) {
        let closenessPct = localY / this.terre.displayHeight;
        // user adds balloons one at a time - 283w x 519h
        //let balloon = this.add.sprite(localX, localY, this.colorsA[this.curColorInd]);
        // setOrigin(bottom middle);
        let balloon = this.add.sprite(pointer.downX, pointer.downY, this.colorsA[this.curColorInd], 0).setOrigin(0.5, 0.9);
        //console.log(balloon.y);
        // store original y for after falls
        balloon.oriY = balloon.y;
        // depth is greater closer
        balloon.setDepth(this.setup.minDepth);
        // scale is greater closer
        balloon.setScale(this.setup.minScale + ((closenessPct) * (this.setup.maxScale - this.setup.minScale)));
        // set speed greater is closer
        balloon.speed = this.setup.minSpeed +
            closenessPct * (this.setup.maxSpeed - this.setup.minSpeed);
        // starting off
        balloon.state=0;
        // add to group to iterate changes
        this.balloonA.push(balloon);

        // set interactive.
        balloon.setInteractive();
        balloon.on('pointerdown', this.liftOff);
    }, this);
};
/* balloon states - checked at click and flying
* switched from boolean to integer because frequent updating, less code
- 0 new balloon / fallen balloon
- 1 liftoff
- 2 safe to float
- 3 floating
- 4 falling
- 5 gone
*/
// context = user touch = balloon spritesheet
gameScene.liftOff = function () {

    // first click, or rescue click (after fall)
    if (this.state==0) {
        this.state=1;
        this.setFrame(0);
        this.scene.fff.play();
    }

    // clicks when safe sets float
    if (this.state == 2) this.state = 3;
};
// context - scene
gameScene.update = function () {

    // forEach iterates arrays only
    // ES6 for-of works as well
    this.balloonA.forEach(balloon => {

        // balloon is flying but not safe, just go up
        if (balloon.state == 1) {
            // check for safety (no balloon overlap with ground)
            balloon.y -= balloon.speed;
            let bRect = balloon.getBounds();
            let tRect = this.terre.getBounds();
            if (!Phaser.Geom.Intersects.RectangleToRectangle(bRect, tRect)) {
                balloon.state=2;
                balloon.setFrame(1);
            }
            return;
        }
        // if safe 1. either click makes it float 2. lightning strike
        // balloon is flying but not safe, just go up
        if (balloon.state == 2) {
            // continue same ascent
            balloon.y -= balloon.speed;
            // but if user ignores balloon, goes into clouds
            if (balloon.y < 300) {
                // lightning
                this.foudre.x = balloon.x;
                this.foudre.alphaTween.restart();
                // sound
                this.popSound.play();
                // update state to falling
                balloon.state = 4;
            }
            return;
        }

        // floating
        if (balloon.state==3) {
            // to make math easier, make upper left balloon origins
            balloon.y -= this.float.speed;
            balloon.setDepth(5);
            // tested various scale values
            balloon.setScale(balloon.scaleX * 0.999);
            return;
        }
        // manual falling animation
        if (balloon.state == 4) {
            balloon.setFrame(2);
            balloon.y += 3;
            // once it hits ground
            if (balloon.y > balloon.oriY) {
                // waiting to be saved
                balloon.setFrame(3);
                // sound
                this.land.play();
                balloon.state=0;
            }
            return;
        }
        // if it floats away, stop moving it
        if (balloon.y < -800) {
            balloon.state=5;
        }
    });
};