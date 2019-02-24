
// our game's configuration
// backgroundColor - game only
let config = {
  type: Phaser.AUTO,
  width: 1125,
  height: 2100,
  scene: [bootScene, loadingScene, homeScene, gameScene],
  title: 'Sauvez Les Ballons',
  pixelArt: false,
  backgroundColor: '3333FF'
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
