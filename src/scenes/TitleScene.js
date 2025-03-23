import HighScoreManager from '../utils/HighScoreManager';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    // 背景を追加
    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
    
    // タイトルテキスト
    const titleText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 4, 'BLOCK BREAKER', {
      font: 'bold 36px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    });
    titleText.setOrigin(0.5);
    
    // ハイスコアを取得して表示
    const highScore = HighScoreManager.getHighScore();
    if (highScore > 0) {
      const highScoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 20, 'ハイスコア: ' + highScore, {
        font: '24px Arial',
        fill: '#ffd700', // 金色
        stroke: '#000000',
        strokeThickness: 4
      });
      highScoreText.setOrigin(0.5);
    }
    
    // 開始指示テキスト
    const startText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'タップしてスタート', {
      font: '24px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    startText.setOrigin(0.5);
    
    // テキストを点滅させる
    this.tweens.add({
      targets: startText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      ease: 'Power1',
      yoyo: true,
      repeat: -1
    });
    
    // 制作クレジット
    const creditText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 30, '© 2025 ブロック崩しゲーム', {
      font: '12px Arial',
      fill: '#aaaaaa'
    });
    creditText.setOrigin(0.5);
    
    // タップイベントを追加（スマホ向け）
    this.input.on('pointerdown', () => {
      // GameSceneを完全に停止して再起動
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
    });
  }
}