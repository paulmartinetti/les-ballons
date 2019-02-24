// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  
*  1. Ballons s'elevent
*  2. 
*  3. 
*  4. 
* 
* load assets (can be accessed from different scenes)
*   this.load.image('bg', 'assets/images/bg.png');
*   this.load.image('terre', 'assets/images/terre.png');
*   this.load.image('nuage', 'assets/images/nuage.png');
*   this.load.image('foudre', 'assets/images/foudre.png');
*   this.load.image('b1', 'assets/images/violetUp.png');
*
*
*
*/

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    // game / scene stats at the beginning
    this.balloon = {
        minSpeed: 0.5,
        maxSpeed: 2,
        minY: 0,
        maxY: this.gameH
    };

   
};

// executed once, after assets were loaded
gameScene.create = function () {

    // load clouds - not interactive yet
    let nuage = this.add.sprite(0, 0, 'nuage').setOrigin(0, 0).setDepth(30);
    //nuage.depth = 3;
    // note two formats for setting depth
    let terre = this.add.sprite(0, this.gameH - 395, 'terre').setOrigin(0, 0);
    terre.depth = 2;

    // add a few balloons at 163 x 406 each
    // https://github.com/photonstorm/phaser/blob/master/src/gameobjects/group/typedefs/GroupCreateConfig.js
    // create config ^^
    this.balloons = this.add.group({
        // game objects config
        // required
        key: 'b1',
        // create (1 + repeat) game objects
        repeat: 5,
        // Actions.SetXY(gameObjects, x, y, stepX, stepY)
        setXY: {
            x: 0,
            y: this.balloon.maxY,
            stepX: 170, // step - separation between balloons
            stepY: 100
        },
        // Actions.SetScale(gameObjects, x, y, stepX, stepY)
        setScale: {
            x: 1,
            y: 1,
            stepX: 0.1,
            stepY: 0.1
        }
    });
    // going up - make depths between 0 (bg) and 30 (nuage)
    this.balloons.setDepth(1,1);
    // reset origins
    this.balloons.getChildren().forEach(element => {

        // to make math easier, make upper left balloon origins
        element.setOrigin(0,0);

        // if we wanted all at same depth (balloons may overlap)
        //element.setDepth(1);

        // define ascending speed.
        element.speed = this.balloon.minSpeed + 
        Math.random() * (this.balloon.maxSpeed-this.balloon.minSpeed);

    });
    //console.log(this.balloons);
};

// fn context - Scene
gameScene.createUI = function () {

    // states
    this.uiBlocked = false;

    // refresh in case of previous run
    this.uiReady();
};

gameScene.update = function(){
    this.balloons.getChildren().forEach(element => {

        // to make math easier, make upper left balloon origins
        element.y -= element.speed;

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
