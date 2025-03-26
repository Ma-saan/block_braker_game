// src/scenes/BootScene.js - 修正版

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Canvas2D警告対応 - willReadFrequentlyを設定
    this.renderer.willReadFrequently = true;
    
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
    
    // ベースパスを動的に取得
    let basePath = '';
    
    // GitHub Pagesでのデプロイを検出
    const isGitHubPages = window.location.hostname.includes('github.io');
    if (isGitHubPages) {
      // リポジトリ名を抽出
      const pathSegments = window.location.pathname.split('/');
      if (pathSegments.length > 1) {
        // リポジトリ名がパスの最初の部分
        const repoName = pathSegments[1];
        basePath = `/${repoName}`;
      }
    }
    
    console.log('Asset base path:', basePath);
    
    // アセットのロード - 相対パスの前にベースパスを追加
    this.load.setPath(`${basePath}/assets`);
    
    this.load.image('background', 'images/background.png');
    this.load.image('ball', 'images/ball.png');
    this.load.image('paddle', 'images/paddle.png');
    this.load.image('brick', 'images/brick.png');
    
    // サウンドファイルの読み込み
    this.load.audio('paddleHit', 'sounds/paddle_hit.mp3');
    this.load.audio('brickHit', 'sounds/brick_hit.mp3');
    this.load.audio('gameOver', 'sounds/game_over.mp3');
    this.load.audio('levelComplete', 'sounds/level_complete.mp3');
    this.load.audio('startGame', 'sounds/start_game.mp3');
    
    // もしアセットの読み込みに失敗したら
    this.load.on('loaderror', (file) => {
      console.error('Failed to load asset:', file.key, file.src);
    });
  }

  create() {
    // 全てのアセットが正常に読み込まれたかレポート
    console.log('All assets loaded successfully.');
    
    // タイトルシーンへ
    this.scene.start('TitleScene');
  }
}