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
    this.curColorInd = 4;

    // balloon states
    this.isFlying = false;
    this.isSafe = false;
    this.isTouched = false;
    // set by y
    this.isFalling = false;

    // balloons
    this.balloonA = [];

};

// executed once, after assets were loaded
gameScene.create = function () {

    // load clouds - not interactive yet
    let nuage = this.add.sprite(this.gameW / 2, 0, 'nuage').setDepth(100);
    this.foudre = this.add.sprite(this.gameW / 2, 100, 'foudre').setDepth(99);
    this.foudre.visible = false;
    //nuage.depth = 100;

    // add color selector
    let colors = this.add.sprite(29.5, this.gameH - 300, 'colors', 4).setInteractive().setDepth(101);
    //colors.angle = -90;this.gameW / 2this.gameH - 29.5
    colors.on('pointerdown', function (pointer, localX, localY) {
        let step = 58;
        for (let i = 0; i < this.colorsA.length; i++) {
            //console.log(Math.round(localY) - step);
            if (localY - step < 0) {
                colors.setFrame(i);
                this.curColorInd = i;
                break;
            } else {
                step += 58;
            }

        }
    }, this);

    // set bg and make interactive
    // note two formats for setting depth
    this.terre = this.add.sprite(0, this.gameH - 300, 'terre').setOrigin(0, 0).setDepth(51).setInteractive();
    //terre.depth = 51;
    this.terre.on('pointerdown', function (pointer, localX, localY) {
        let closenessPct = localY / this.terre.displayHeight;
        // user adds balloons one at a time - 283w x 519h
        //let balloon = this.add.sprite(localX, localY, this.colorsA[this.curColorInd]);
        // setOrigin(bottom middle);
        let balloon = this.add.sprite(pointer.downX, pointer.downY, this.colorsA[this.curColorInd], 0).setOrigin(0.5, 0.9);
        //console.log(balloon.y);
        // depth is greater closer
        balloon.setDepth(this.setup.minDepth);
        // scale is greater closer
        balloon.setScale(this.setup.minScale + ((closenessPct) * (this.setup.maxScale - this.setup.minScale)));
        // set speed greater is closer
        balloon.speed = this.setup.minSpeed +
            closenessPct * (this.setup.maxSpeed - this.setup.minSpeed);
        // starting off FF
        balloon.isSafe = false;
        balloon.isFlying = false;
        balloon.isTouched = false;
        balloon.isFalling = false;

        // add to group
        this.balloonA.push(balloon);

        // set interactive.
        balloon.setInteractive();
        balloon.on('pointerdown', this.liftOff);
    }, this);
};
gameScene.liftOff = function () {

    // first click
    if (!this.isFlying && !this.isFalling) {
        this.isFlying = true;
        this.setFrame(0);
    }


    // clicks when safe sets float
    if (this.isSafe && !this.isTouched) {
        this.isTouched = true;
    }
};

gameScene.update = function () {

    this.balloonA.forEach(balloon => {
        //console.log(this.balloonA.length);

        // if too high, reset
        if (balloon.y < -1000) balloon.isFlying = balloon.isTouched = false;

        // balloon is flying but not safe, just go up
        if (balloon.isFlying && !balloon.isSafe) {
            // check for safety
            balloon.y -= balloon.speed;
            let bRect = balloon.getBounds();
            let tRect = this.terre.getBounds();
            if (!Phaser.Geom.Intersects.RectangleToRectangle(bRect, tRect)) {
                balloon.isSafe = true;
                balloon.setFrame(1);
            }

        }
        // if safe make TT
        // balloon is flying but not safe, just go up
        if (balloon.isFlying && balloon.isSafe && !balloon.isTouched) {
            // check for safety
            balloon.y -= balloon.speed;
            // but if user ignores balloon --
            if (balloon.y < 300) {
                balloon.isFalling = true;
                this.foudre.visible = true;
            }
        }

        // TT
        if (balloon.isFlying && balloon.isSafe && balloon.isTouched) {
            // to make math easier, make upper left balloon origins
            balloon.y -= this.float.speed;
            balloon.setDepth(5);
            balloon.setScale(balloon.scaleX * 0.999);
            //console.log('2nd');
        }
        // falling animation
        if (balloon.isFalling) {
            // check for safety
            balloon.setFrame(2);
            balloon.y += 3;
            // once it hits ground
            if (balloon.y > 950) {
                balloon.setFrame(3);
                balloon.isFlying = false;
                balloon.isFalling = false;
                balloon.isSafe = false;
                balloon.isTouched = false;
                this.foudre.visible = false;
            }
        }

    });

};