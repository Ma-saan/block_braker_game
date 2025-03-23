export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // ロード画面の設定
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(this.cameras.main.width / 4, this.cameras.main.height / 2 - 30, this.cameras.main.width / 2, 50);
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px Arial',
      fill: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);
    
    // ロード進捗イベント
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(this.cameras.main.width / 4 + 10, this.cameras.main.height / 2 - 20, (this.cameras.main.width / 2 - 20) * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
    
    // アセットのロード - 相対パスに修正
    this.load.image('background', './assets/images/background.png');
    this.load.image('ball', './assets/images/ball.png');
    this.load.image('paddle', './assets/images/paddle.png');
    this.load.image('brick', './assets/images/brick.png');
    
    // サウンドファイルの読み込み - 相対パスに修正
    this.load.audio('paddleHit', './assets/sounds/paddle_hit.mp3');
    this.load.audio('brickHit', './assets/sounds/brick_hit.mp3');
    this.load.audio('gameOver', './assets/sounds/game_over.mp3');
    this.load.audio('levelComplete', './assets/sounds/level_complete.mp3');
    this.load.audio('startGame', './assets/sounds/start_game.mp3');
  }

  create() {
    this.scene.start('TitleScene');
  }
}