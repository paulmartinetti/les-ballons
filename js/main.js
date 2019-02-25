
// our game's configuration
// backgroundColor - game only
let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 1136,
  scene: [bootScene, loadingScene, homeScene, gameScene],
  title: 'Sauvez Les Ballons',
  pixelArt: false,
  backgroundColor: '6666FF'
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
