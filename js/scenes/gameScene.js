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
        minY: this.gameH - 500,
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
    this.colorsA = ['violet', 'jaune', 'orange', 'vert', 'rouge'];

    // balloon states
    this.isFlying = false;
    this.isTouched = false;
    // set by y
    this.isOffGround = false;

};

// executed once, after assets were loaded
gameScene.create = function () {

    // load clouds - not interactive yet
    let nuage = this.add.sprite(this.gameW / 2, 0, 'nuage').setDepth(100);
    //nuage.depth = 3;

    // note two formats for setting depth
    let terre = this.add.sprite(0, this.gameH - 300, 'terre').setOrigin(0, 0);
    terre.depth = 51;

    // add a few balloons at 163 x 406 each
    // https://github.com/photonstorm/phaser/blob/master/src/gameobjects/group/typedefs/GroupCreateConfig.js
    // create config ^^
    let myA = [];
    let len = this.colorsA.length;
    for (let i = 0; i < len; i++) {
        //console.log(this.colorsA.length);
        let obj = {
            key: this.colorsA[i],
            repeat: 2
        };
        myA.push(obj);
    }
    this.balloons = this.add.group(myA);

    // params = start, step
    //this.balloons.setDepth(1,1);

    // 
    this.balloons.getChildren().forEach(balloon => {
        // to make math easier, make upper left balloon origins
        //balloon.setOrigin(0, 0);

        // define ascending speed
        let tempR = Math.round(Math.random() * 100) / 100;
        //console.log(tempR);
        //
        balloon.speed = this.setup.minSpeed +
            tempR * (this.setup.maxSpeed - this.setup.minSpeed);

        // slower balloons are also smaller
        let tempS = this.setup.minScale + tempR * (this.setup.maxScale - this.setup.minScale);
        balloon.setScale(tempS, tempS);
        //console.log(balloon.scaleX);

        // define depth based on speed
        balloon.setDepth(this.setup.minDepth + tempR * (this.setup.maxDepth - this.setup.minDepth));
        // define depth based on speed
        balloon.y = this.setup.minY + tempR * (this.setup.maxY - this.setup.minY);
        balloon.x = Math.round(80 + Math.random() * this.gameW);

        // starting off FF
        balloon.isFlying = false;
        balloon.isTouched = false;
        balloon.isOffGround = false;

        // set interactive.
        balloon.setInteractive();
        balloon.on('pointerdown', this.liftOff);

    });
};
gameScene.liftOff = function () {
    // if FF, make TF
    if (!this.isFlying && !this.isTouched) {
        this.isFlying = true;
        return;
    }

    if (this.isFlying && !this.isTouched && this.y < this.scene.float.minY) this.isTouched = true;
};


// fn context - Scene
gameScene.createUI = function () {

    // states
    this.uiBlocked = false;

    // refresh in case of previous run
    this.uiReady();
};

gameScene.update = function () {

    this.balloons.getChildren().forEach(balloon => {
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
            console.log('2nd');
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