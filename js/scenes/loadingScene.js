// create a new scene
let loadingScene = new Phaser.Scene('Loading');

// preload
// load asset files for our game
// ALL scenes have access to these objects!
loadingScene.preload = function () {
    
    // 
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    // loaded in bootScene
    //let logo = this.add.sprite(gameW / 2, 250, 'logo');

    // progress bar bg
    let bgBar = this.add.graphics();
    let barW = 150;
    let barH = 30;

    // for graphics objs, the default origin is top-left
    bgBar.setPosition(gameW / 2 - barW / 2, gameH / 2 - barH / 2);
    // color, alpha (0-1)
    bgBar.fillStyle(0xF5F5F5,1);
    bgBar.fillRect(0,0,barW,barH);

    // progress bar
    let progressBar = this.add.graphics();
    progressBar.setPosition(gameW / 2 - barW / 2, gameH / 2 - barH / 2);

    // listen to progress event
    // value = 0-1 of loaded
    this.load.on('progress',function(value){

        // clear the bar so we can draw it again
        progressBar.clear();

        // set style
        progressBar.fillStyle(0x9AD98D);

        // draw with updated 'value'
        progressBar.fillRect(0, 0, (barW*value), barH);

    },this);

    // balloon colors
    this.colorsA = ['violet', 'rouge', 'vert', 'jaune', 'orange'];

    // load assets (can be accessed from different scenes)
    this.load.image('ciel', 'assets/images/ciel.png');
    this.load.image('terre', 'assets/images/terre2.png');
    this.load.image('nuage', 'assets/images/nuage.png');
    this.load.image('foudre', 'assets/images/foudre.png');
  
    // load sounds
    this.load.audio('pop1','assets/audio/pop1.mp3');
    this.load.audio('fff', 'assets/audio/fff.mp3');
    this.load.audio('land', 'assets/audio/BasketLand.mp3');

    for (let i=0;i<this.colorsA.length;i++){
        this.load.spritesheet(this.colorsA[i], 'assets/images/'+this.colorsA[i]+'Sprite.png', {
            frameWidth: 283,
            frameHeight: 519,
            startFrame: 0,
            endFrame: 3,
            margin: 1,
            spacing: 1,
            frameNum: 0
        });
    }

    //https://github.com/photonstorm/phaser/blob/master/src/textures/parsers/SpriteSheet.js
    // need to turn -90 degrees
    this.load.spritesheet('colors', 'assets/images/btns291.png', {
        frameWidth: 57,
        frameHeight: 289,
        startFrame: 0,
        endFrame: 4,
        margin: 1,
        spacing: 1,
        frameNum: 4
    });

    // load character spritesheet
    /* this.load.spritesheet('pet', 'assets/images/pet.png', {
        frameWidth: 97,
        frameHeight: 83,
        margin: 1,
        spacing: 1
    }); */

    // TESTING ONLY - to watch progress bar grow
    //for (let i=0;i<500;i++){
    //    this.load.image('test'+i, 'assets/images/candy.png');
    //}
};

loadingScene.create = function () {

    // animation of spritesheet - animations are global (available in multiple scenes)
    // to loop forever, repeat: -1
    // key name is arbitrary
    /* this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
        frameRate: 7,
        yoyo: true,
        repeat: 0
    }); */

    // 

    // ready to offer game
    this.scene.start('Home');

};