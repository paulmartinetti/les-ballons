// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  
*  Depths
*  1. nuage - 100
*  2. ballons attérris / s'élèvent - 52-70
*  3. terre - 51
*  4. ballons s'eloignent 50-0 if(this.isOffGround)
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
        minY: this.gameH - 300,
        maxY: this.gameH - 100,
        minDepth: 52,
        maxDepth: 70,
        minScale: 0.7,
        maxScale: 0.9
    };

    // float state FT -- > TT
    this.float = {
        speed: 0.25,
        minDepth: 0,
        maxDepth: 51,
        minY: this.gameH - 500
    };

    // balloon colors
    this.colorsA = ['violet', 'rouge', 'vert', 'jaune', 'orange'];
    this.curColorInd = 4;

    // balloon states
    this.isFlying = false;
    this.isTouched = false;
    // set by y
    this.isOffGround = false;

    // balloons
    this.balloonA = [];

};

// executed once, after assets were loaded
gameScene.create = function () {

    // load clouds - not interactive yet
    let nuage = this.add.sprite(this.gameW / 2, 0, 'nuage').setDepth(100);
    //nuage.depth = 100;

    // add color selector
    let colors = this.add.sprite(this.gameW / 2, this.gameH - 29.5, 'colors', 4).setInteractive().setDepth(101);
    colors.angle = -90;
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
        // user adds balloons one at a time
        //let balloon = this.add.sprite(localX, localY, this.colorsA[this.curColorInd]);
        let balloon = this.add.sprite(pointer.downX, pointer.downY, this.colorsA[this.curColorInd]);
        //console.log(balloon.y);
        // depth is greater closer
        balloon.setDepth(this.setup.minDepth);
        // scale is greater closer
        balloon.setScale(this.setup.minScale + ((closenessPct) * (this.setup.maxScale - this.setup.minScale)));
        // set speed greater is closer
        balloon.speed = this.setup.minSpeed +
            closenessPct * (this.setup.maxSpeed - this.setup.minSpeed);
        // starting off FF
        balloon.isFlying = false;
        balloon.isTouched = false;
        balloon.isOffGround = false;

        // add to group
        this.balloonA.push(balloon);

        // set interactive.
        balloon.setInteractive();
        balloon.on('pointerdown', this.liftOff);
    },this);
};
gameScene.liftOff = function () {
    this.isFlying = true;
    // if FF, make TF
    if (!this.isFlying && !this.isTouched) {
        this.isFlying = true;
        return;
    }

    if (this.isFlying && !this.isTouched && this.y < this.scene.float.minY) this.isTouched = true;
};

gameScene.update = function () {

    this.balloonA.forEach(balloon => {
        //console.log(this.balloonA.length);
        // if too high, reset
        if (balloon.y < -1000) balloon.isFlying = balloon.isTouched = false;

        // TF
        if (balloon.isFlying && !balloon.isTouched) {
            // to make math easier, make upper left balloon origins
            balloon.y -= balloon.speed;
            
        }

        // TT
        if (balloon.isFlying && balloon.isTouched) {
            // to make math easier, make upper left balloon origins
            balloon.y -= this.float.speed;
            balloon.setDepth(5);
            balloon.setScale(balloon.scaleX * 0.999);
            //console.log('2nd');
        }

    });

};

// fn context - Scene
gameScene.uiReady = function () {
    // nothing is being selected
    this.selectedItem = null;

    // unblock ui (scene)
    this.uiBlocked = false;

};

// heads up display
/* gameScene.createHud = function () {
    // health stat
    this.healthText = this.add.text(20, 20, 'Health: ', {
        font: '24px Arial',
        fill: '#ffffff'
    }
    );
    // fun stat
    this.funText = this.add.text(170, 20, 'Fun: ', {
        font: '24px Arial',
        fill: '#ffffff'
    }
    );
}; */

// update stats display
/* gameScene.refreshHud = function () {
    this.healthText.setText('Health: ' + this.stats.health);
    this.funText.setText('Fun: ' + this.stats.fun);
}; */

// update stats data
// statDiff is the this.selectedItem.customStats obj
/* gameScene.updateStats = function (statDiffObj) {
    // update health - bc only two properties can do manually
    //this.stats.health += statDiffObj.health;
    //this.stats.fun += statDiffObj.fun;
    //
    //console.log(this.stats.health);
    let isGameOver = false;

    // update health if there are lots of inconsistent properties
    // e.g. some don't have health, some don't have fun..
    // the var 'stat' is like each or index, made-up
    for (stat in statDiffObj) {
        // if property is only in selectedItem...
        // to avoid inherited properties from __prototype__
        if (statDiffObj.hasOwnProperty(stat)) {
            // increment
            this.stats[stat] += statDiffObj[stat];

            // prevent stats from below 0
            if (this.stats[stat] < 0) {
                isGameOver = true;
                this.stats[stat] = 0;
            }
        }
    }
    // refresh hud
    this.refreshHud();

    //
    if (isGameOver) this.gameOver();
}; */

/* gameScene.gameOver = function () {

    // block ui
    this.uiBlocked = true;

    // change the frame of the pet to dead
    this.pet.setFrame(4);

    // scope inside fn is the fn
    // to access scene to restart, use callbackScope 'this'
    this.time.addEvent({
        delay: 2000,
        repeat: 0,
        callback: function () {
            // restart scene
            this.scene.start('Home');
        },
        callbackScope: this
    });

    //
    //console.log('game over');
}; */