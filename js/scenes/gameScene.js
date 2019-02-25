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
    this.lim = {
        minSpeed: 0.5,
        maxSpeed: 2,
        minY: 0,
        maxY: this.gameH - 300,
        minDepth: 2,
        maxDepth: 30,
        minScale: 0.2,
        maxScale: 2
    };

    // balloon colors
    this.colorsA = ['violet', 'jaune', 'orange'];


};

// executed once, after assets were loaded
gameScene.create = function () {

    // load clouds - not interactive yet
    let nuage = this.add.sprite(0, 0, 'nuage').setOrigin(0, 0).setDepth(50);
    //nuage.depth = 3;
    // note two formats for setting depth
    let terre = this.add.sprite(0, this.gameH - 395, 'terre').setOrigin(0, 0);
    terre.depth = 50;

    // add a few balloons at 163 x 406 each
    // https://github.com/photonstorm/phaser/blob/master/src/gameobjects/group/typedefs/GroupCreateConfig.js
    // create config ^^
    let myA = [];
    for (let i = 0; i < this.colorsA.length; i++) {
        console.log(this.colorsA.length);
        let obj = {
            key: this.colorsA[i],
            repeat: 6,
            setXY: {
                x: 10,
                y: this.lim.maxY,
                stepX: (150 + (i * 10)),
                stepY: 100
            }
        };
        myA.push(obj);
    }
    this.balloons = this.add.group(myA);
    // going up - make depths between 0 (bg) and 30 (nuage)
    // params = start, step
    //this.balloons.setDepth(1,1);

    // 
    this.balloons.getChildren().forEach(balloon => {
        // to make math easier, make upper left balloon origins
        balloon.setOrigin(0, 0);

        // define ascending speed
        let tempR = Math.round(Math.random() * 100) / 100;
        //console.log(tempR);
        //
        balloon.speed = this.lim.minSpeed +
            tempR * (this.lim.maxSpeed - this.lim.minSpeed);

        // slower balloons are also smaller
        let tempS = this.lim.minScale + tempR * (this.lim.maxScale - this.lim.minScale);
        balloon.setScale(tempS, tempS);
        console.log(balloon.scaleX);

        // define depth based on speed
        balloon.setDepth(this.lim.minDepth + tempR * (this.lim.maxDepth - this.lim.minDepth));
    });
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
