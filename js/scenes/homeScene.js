// create a new scene
let homeScene = new Phaser.Scene('Home');

homeScene.create = function () {

    // welcome text
    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    // set bg and make interactive
    let bg = this.add.sprite(0, 0, 'ciel').setOrigin(0, 0).setInteractive();

    // load clouds - not interactive yet
    //let nuage = this.add.sprite(gameW/2,0, 'nuage');
    //nuage.depth = 3;
    // note two formats for setting depth
    //let terre = this.add.sprite(0, gameH - 300, 'terre').setOrigin(0, 0);

    let text = this.add.text(gameW / 2, gameH / 2, 'Launch Balloons \n Click to start', {
        fontFamily: '"Lucida Console", Monaco, monospace',
        fontSize: '40px',
        align: 'center',
        fill: '#ffffff'
    });
    // origin is center of text obj (note fns..setOrigin for text vs setPosition for graphics)
    text.setOrigin(0.5, 0.5);
    // (note to self - this is inconsistent, should be setDepth bc obj is created)
    text.depth = 1;

    // text bg
    // add rectangle behind the text to increase contrast
    // use width of text to size the rectangle
    let textBg = this.add.graphics();
    // API  for Graphics obj is similar to Canvas
    // enter color first, then alpha value
    textBg.fillStyle(0x000000, 0.5);
    // rect position determined by half h & w of text
    // params - x, y, h, w
    textBg.fillRect(gameW / 2 - text.width / 2 - 10
        , gameH / 2 - text.height / 2 - 10
        , text.width + 20,
        text.height + 20);

    // click anywhere to start the game
    // bg is a Sprite, so the context of the embedded fn is Sprite
    // include 'this' in bg Sprite methods to access/callBack homeScene
    // scope 'this' is read before the fn, even though it appears after in params
    bg.on('pointerdown', function () {
        this.scene.start('Game');
        //this.scene.start('Watch');
        // /console.log('on y est');
    }, this);
};