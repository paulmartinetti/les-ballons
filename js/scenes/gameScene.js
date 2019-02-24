// create a new scene
let gameScene = new Phaser.Scene('Game');

/* game flow
*  
*  states change - state machine
*  1. Ready state - nothing is selected, all items ready (reset)
*  2. Once user selects something, state changes to Selected Item
*  3. Pet will move toward the item, so during this time block other items
*  4. Also while rotating which takes time, block the ui
* 
* Ready ----> Selected Item
*   ^         /
*   |        /
*   |      /
*   v    v
*   Blocked
*/

// some parameters for our scene
gameScene.init = function () {

    // game / scene stats at the beginning
    this.stats = {
        health: 100,
        fun: 100
    };

    // rate of decay / boredom
    this.decayRates = {
        health: -5,
        fun: -2
    };
};

// executed once, after assets were loaded
gameScene.create = function () {

    // set bg and make interactive
    let bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    // listen on bg - the 'on' fn is available after setInteractive()
    // bc we're not changing bg, we can pass scene context 'this'
    bg.on('pointerdown', this.placeItem, this);

    // add the pet, make it interactive
    let frameNum = 0;
    this.pet = this.add.sprite(100, 200, 'pet', frameNum).setInteractive();
    // apple and candy sprites are default depth 0
    this.pet.depth = 1;

    // make pet draggable
    // access the input object of this scene
    this.input.setDraggable(this.pet);

    // define dragging fns - follow the mouse pointer
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        // make sprite follow pointer
        gameObject.x = dragX;
        gameObject.y = dragY;
        // to capture the name of the object being dragged
        //console.log(gameObject.texture.key);
    });

    // create ui
    this.createUI();

    // diplay stats - Heads-up display
    this.createHud();
    // show initial values
    this.refreshHud();

    // decay of health and fun over time
    // callback is fn @ delay
    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            // update stats (final implementation) - pass stats obj
            this.updateStats(this.decayRates);
        },
        callbackScope: this
    });

};

// fn context - Scene
gameScene.createUI = function () {
    // lose this
    //let pickItem = this.pickItem;

    // add buttons and make interactive
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    // if you put stats here bc on() context is this Sprite
    this.appleBtn.customStats = { health: 20, fun: 0 };
    this.appleBtn.on('pointerdown', this.pickItem);

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.customStats = { health: -10, fun: 10 };
    this.candyBtn.on('pointerdown', this.pickItem);

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.customStats = { health: 0, fun: 15 };
    // params - pointer action, fn, context - this is Scene
    //this.toyBtn.on('pointerdown', this.pickItem, this);
    // params - pointer action, fn, context - default is Sprite (toy)
    this.toyBtn.on('pointerdown', this.pickItem);

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
    this.rotateBtn.customStats = { fun: 20 };
    this.rotateBtn.on('pointerdown', this.rotatePet);

    // save btn array for ui control / refresh
    this.buttonA = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

    // states
    this.uiBlocked = false;

    // refresh in case of previous run
    this.uiReady();
};

// fn context is Sprite - rotateBtn
gameScene.rotatePet = function () {
    // respond based on state
    // this fn is called by button listener, so context = btn (Sprite)
    // to access scene, need this.scene.sceneVars
    if (this.scene.uiBlocked) return;

    // reset ui elements
    this.scene.uiReady();

    // block ui during rotation
    this.scene.uiBlocked = true;

    // 
    this.alpha = 0.5;

    // set timer
    // fn inside fn of Sprite context - requires local var for Scene
    //let scene = this.scene;
    //setTimeout(function(){
    // set scene back to ready
    //scene.uiReady();
    //}, 2000);

    // rotation tween
    // callbackScope - because the fn inside this object is in tween context
    // want to increase fun, use callback to access customStats properties
    let rotationTween = this.scene.tweens.add({
        targets: this.scene.pet,
        duration: 600,
        angle: 360,
        pause: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {

            // update stats (final implementation)
            this.scene.updateStats(this.customStats);

            // set ui to ready after fun
            this.scene.uiReady();

            //console.log(this.scene.stats);

        }
    });

    //console.log('rotating pet');
};

// fn context is Sprite - picking item
gameScene.pickItem = function () {

    // respond based on state
    // this fn is called by button listener, so context = btn (Sprite)
    // to access scene, need this.scene.sceneVars
    if (this.scene.uiBlocked) return;

    // reset ui elements
    this.scene.uiReady();

    // select item (sets var true)
    this.scene.selectedItem = this;

    // change transparency
    this.alpha = 0.5;

    // demonstrate context - clicked Sprite
    //console.log(this.texture.key);
    //console.log(this.customStats.health);

    //console.log('picking item');
};

// fn context - Scene
gameScene.uiReady = function () {
    // nothing is being selected
    this.selectedItem = null;

    // remove any transparency applied during game
    this.buttonA.forEach(element => {
        element.alpha = 1;
    });

    // unblock ui (scene)
    this.uiBlocked = false;



};
// fn context = Scene not Sprite (bg) passed 'this' in on();
gameScene.placeItem = function (pointer, localX, localY) {
    // var 'pointer' shows game scene coordinates
    // vars localX, localY show coordinates of object selected
    // with our bg, it's the same in this case
    //console.log(localX, localY);

    // check for selected item, otherwise it's just a bg click
    if (!this.selectedItem) return;

    // ui must be unblocked
    //if(if.uiBlocked) return;

    // create a new item in the position where user clicked
    let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key)

    // block UI while pet goes to eat selectedItem
    this.uiBlocked = true;

    // move this.pet to newItem (set in create fn)
    // onComplete is the callback fn
    // tween is inside scene context (passed 'this' from btn)
    let petTween = this.tweens.add({
        targets: this.pet,
        duration: 500,
        x: newItem.x,
        y: newItem.y,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {

            // make newItem disappear
            newItem.destroy();

            // listen for chewing to finish before unlocking ui
            this.pet.on('animationcomplete', function () {

                // put pet face back to frame 0
                // use setFrame after obj is created (instead of .frame())
                this.pet.setFrame(0);

                // to limit placing one item, null selectedItem, reset ui
                // this must follow stats update that needs selectedItem
                this.uiReady();
                // pass scene context (this)
            }, this);

            // newItem is reached, so play chewing animation
            this.pet.play('funnyfaces');

            // update stats (final implementation)
            this.updateStats(this.selectedItem.customStats);

        }
    });
};

// heads up display
gameScene.createHud = function () {
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
};

// update stats display
gameScene.refreshHud = function () {
    this.healthText.setText('Health: ' + this.stats.health);
    this.funText.setText('Fun: ' + this.stats.fun);
};

// update stats data
// statDiff is the this.selectedItem.customStats obj
gameScene.updateStats = function (statDiffObj) {
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
};

gameScene.gameOver = function () {

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
};
