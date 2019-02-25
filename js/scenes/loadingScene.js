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


    // load assets (can be accessed from different scenes)
    this.load.image('ciel', 'assets/images2/ciel.png');
    this.load.image('terre', 'assets/images2/terre.png');
    this.load.image('nuage', 'assets/images2/nuage.png');
    //this.load.image('foudre', 'assets/images2/foudre.png');
    this.load.image('violet', 'assets/images2/violet.png');
    this.load.image('jaune', 'assets/images2/jaune.png');
    this.load.image('orange', 'assets/images2/orange.png');

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