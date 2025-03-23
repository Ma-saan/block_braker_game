import HighScoreManager from '../utils/HighScoreManager';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    // 前のシーンからスコアとレベルを受け取る
    this.score = data.score || 0;
    this.level = data.level || 1;
    
    // ハイスコアをチェックして更新
    this.isNewHighScore = HighScoreManager.updateHighScore(this.score);
    this.highScore = HighScoreManager.getHighScore();
  }

  create() {
    // 背景を追加
    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
    
    // ゲームオーバーテキスト
    const gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 5, 'GAME OVER', {
      font: 'bold 42px Arial',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 6
    });
    gameOverText.setOrigin(0.5);
    
    // 最終スコア表示
    const finalScoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 80, '最終スコア: ' + this.score, {
      font: '28px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    finalScoreText.setOrigin(0.5);
    
    // 達成レベル表示
    const levelText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 40, '達成レベル: ' + this.level, {
      font: '28px Arial',
      fill: '#00ffff', // 水色
      stroke: '#000000',
      strokeThickness: 4
    });
    levelText.setOrigin(0.5);
    
    // ハイスコア表示
    const highScoreText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'ハイスコア: ' + this.highScore, {
      font: '28px Arial',
      fill: '#ffd700', // 金色
      stroke: '#000000',
      strokeThickness: 4
    });
    highScoreText.setOrigin(0.5);
    
    // 新記録の場合は表示
    if (this.isNewHighScore) {
      const newRecordText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 40, '新記録達成！', {
        font: 'bold 32px Arial',
        fill: '#00ff00', // 緑色
        stroke: '#000000',
        strokeThickness: 5
      });
      newRecordText.setOrigin(0.5);
      
      // 点滅エフェクト
      this.tweens.add({
        targets: newRecordText,
        alpha: { from: 1, to: 0.3 },
        duration: 500,
        ease: 'Power1',
        yoyo: true,
        repeat: -1
      });
    }
    
    // リトライテキスト
    const retryText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height * 3/4, 'タップしてリトライ', {
      font: '24px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    });
    retryText.setOrigin(0.5);
    
    // テキストを点滅させる
    this.tweens.add({
      targets: retryText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      ease: 'Power1',
      yoyo: true,
      repeat: -1
    });
    
    // タップイベントを追加（スマホ向け）
    this.input.once('pointerdown', () => {
      // GameSceneを完全に停止して再起動
      this.scene.stop('GameScene');
      this.scene.start('GameScene');
    });
    
    // ゲームオーバー直後は操作を受け付けないように少し遅延させる
    this.input.enabled = false;
    this.time.delayedCall(1000, () => {
      this.input.enabled = true;
    });
  }
  
  // 安全に音を追加して再生するヘルパーメソッド
  safeAddSound(key, config = {}) {
    try {
      return this.sound.add(key, config);
    } catch (e) {
      console.warn(`Could not add sound "${key}": ${e.message}`);
      // ダミーのサウンドオブジェクトを返す
      return {
        play: () => {},
        once: (event, callback) => {
          // 音がない場合は即座にコールバックを実行
          if (event === 'complete') {
            setTimeout(callback, 500); // 少し遅延させる
          }
          return this;
        }
      };
    }
  }
}