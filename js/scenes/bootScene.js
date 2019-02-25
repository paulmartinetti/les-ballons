// create a new scene
let bootScene = new Phaser.Scene('Boot');

// boot is what users see during preload
//bootScene.preload = function () {
    // usually just a tiny logo
    //this.load.image('logo','assets/images2/jv-logo.png');
//};

// 
bootScene.create = function(){
    this.scene.start('Loading');
};