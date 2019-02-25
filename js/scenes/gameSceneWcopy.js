// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  Depths
*  1. ciel - 100
*  2. ballons attérris / s'élèvent - 55, 60, 65, 70, 75
*  3. terre - 51
*  4. ballons s'eloignent 50-0 if(this.offGround)
* 
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
        minSpeed: 0.25,
        maxSpeed: 1.5,
        minY: 0,
        maxY: this.gameH - 300,
        minDepth: 0,
        maxDepth: 30,
        minScale: 0.1,
        maxScale: 1
    };

    // balloon colors, 283x519
    this.colorsA = ['violet', 'jaune', 'orange', 'jaune', 'orange'];

    // balloon states
    this.isFlying = false;
    this.isTouched = false;
    // set by y
    this.isOffGround = false;

    /**************** ballons setup on the ground ********************/
    this.setupA = [];
    // depth will be 50, 55, 60, 65, 70
    let dStep = 5;
    // scale will be 0.7, 0.75, 0.8, 0.85, 0.9 
    let sStep = 0.05;
    // starting y will be 50, 100, 150, 200, 250
    // terre is h: 300
    let yStep = 50;
    // starting speed will be 0.25, 0.5, 0.75, 1, 1.25
    let spStep = 0.25;
    // non rnd selection of indices
    this.rand = [3, 1, 4, 0, 2];
    // create array of objs to be used to init balloons sur terre
    for (let i = 0; i < 5; i++) {
        let obj = {
            depth: 50 + dStep,
            scale: 0.65 + sStep,
            speed: spStep,
            y: this.gameH - 300 + yStep
        };
        this.setupA.push(obj);
        dStep += 5; sStep += 0.05; yStep += 50; spStep += 0.25;
    }
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
        let obj = {
            key: this.colorsA[i],
            repeat: 2,
            setXY: {
                x: 10,
                y: this.setupA[this.rand[i]].y,
                stepX: 200,
                stepY: 0
            }
        };
        myA.push(obj);
        console.log(myA);
    }
    this.balloons = this.add.group(myA);
    // going up - make depths between 0 (bg) and 30 (nuage)
    // params = start, step
    //this.balloons.setDepth(1,1);

    //
    let balloonA = this.balloons.getChildren();

    for (let j = 0; j < len; j++) {

        balloonA[j].setScale(this.setupA[this.rand[j]], this.setupA[this.rand[j]]);
        //console.log(balloon.scaleX);

        // define depth based on speed
        balloon.setDepth();

        // to make math easier, make upper left balloon origins
        balloon.setOrigin(0, 0);
    }
    //console.log(this.balloons.getChildren());
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

        // to make math easier, make upper left balloon origins
        balloon.y -= balloon.speed;
        if (balloon.y < -650) balloon.y = this.lim.maxY;

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
