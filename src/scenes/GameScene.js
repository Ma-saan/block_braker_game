import HighScoreManager from '../utils/HighScoreManager';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.lives = 3;
    this.isGameStarted = false;
    this.levelCompleting = false; // レベルクリア処理中かどうかのフラグ
    this.highScore = 0; // ハイスコアを保存
    this.stageLevel = 1; // ステージレベル
    this.initialBallSpeed = 300; // 初期ボール速度
  }
  
  // シーン開始時の初期化（リトライ時にも呼ばれる）
  init() {
    // ゲーム変数をリセット
    this.score = 0;
    this.lives = 3;
    this.isGameStarted = false;
    this.levelCompleting = false;
    this.stageLevel = 1; // ステージレベルを1にリセット
  }

  create() {
    // 背景を追加
    this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
      .setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    // パドルの目標X座標を追跡する変数を追加
    this.paddleTargetX = this.cameras.main.width / 2;
    
    // 物理境界の設定 - 下側は衝突しないように設定
    this.physics.world.setBounds(0, 0, this.cameras.main.width, this.cameras.main.height, true, true, true, false);
    
    // ハイスコアを取得
    this.highScore = HighScoreManager.getHighScore();
    
    // スコアとライフのテキスト表示
    this.scoreText = this.add.text(16, 16, 'スコア: ' + this.score, {
      font: '18px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    
    // ハイスコア表示
    this.highScoreText = this.add.text(this.cameras.main.width / 2, 16, 'ハイスコア: ' + this.highScore, {
      font: '14px Arial',
      fill: '#ffd700', // 金色
      stroke: '#000000',
      strokeThickness: 2
    });
    this.highScoreText.setOrigin(0.5, 0);
    
    this.livesText = this.add.text(this.cameras.main.width - 16, 16, 'ライフ: ' + this.lives, {
      font: '18px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.livesText.setOrigin(1, 0);
    
    // レベル表示
    this.levelText = this.add.text(this.cameras.main.width / 2, 40, 'レベル: ' + this.stageLevel, {
      font: '16px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.levelText.setOrigin(0.5, 0);
    
    // パドルを作成（プレイヤーが操作するもの）- 位置を上に調整
    // 画面の高さの80%の位置にパドルを配置
    const paddleY = this.cameras.main.height * 0.80;
    this.paddle = this.physics.add.image(this.cameras.main.width / 2, paddleY, 'paddle');
    this.paddle.setImmovable(true);
    this.paddle.setCollideWorldBounds(true);
    
    // ボールを作成
    this.ball = this.physics.add.image(this.cameras.main.width / 2, paddleY - 20, 'ball');
    this.ball.setCollideWorldBounds(true, 1, 1, false); // 下側の衝突境界をfalseに設定
    this.ball.setBounce(1);
    this.ball.setScale(0.6);
    this.resetBall();
    
    // ブロックのグループを作成
    this.bricks = this.physics.add.staticGroup();
    this.createBricks();
    
    // 衝突判定を設定
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
    this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    
    // タッチ操作（スマホ向け）
    this.input.on('pointermove', (pointer) => {
      // 目標位置だけを更新
      this.paddleTargetX = Phaser.Math.Clamp(
        pointer.x, 
        this.paddle.width / 2, 
        this.cameras.main.width - this.paddle.width / 2
      );
    // ゲームがまだ始まっていない場合、ボールもパドルと一緒に移動
    if (!this.isGameStarted) {
      this.ball.x = this.paddle.x;
    }
    });
    
    // ゲーム開始用のタップイベント
    this.input.on('pointerup', () => {
      if (!this.isGameStarted) {
        this.isGameStarted = true;
        this.startBall();
      }
    });
    
    // 開始指示テキスト
    this.startText = this.add.text(
      this.cameras.main.width / 2, 
      this.cameras.main.height / 2, 
      'タップしてボールを打ち出す', 
      {
        font: '20px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    this.startText.setOrigin(0.5);
    
    // テキストを点滅させる
    this.tweens.add({
      targets: this.startText,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      ease: 'Power1',
      yoyo: true,
      repeat: -1
    });
  }

  update() {
    // パドルを目標位置にスムーズに移動させる
  if (this.paddle.x !== this.paddleTargetX) {
    // 現在位置と目標位置の差に基づいて移動速度を計算
    // 係数0.2は動きの滑らかさを調整（0.1-0.3の範囲で試してみてください）
    const moveSpeed = 0.2;
    this.paddle.x += (this.paddleTargetX - this.paddle.x) * moveSpeed;
  }

    // ボールが画面下部に落ちた場合
    if (this.ball.y > this.cameras.main.height) {
      this.lives--;
      this.livesText.setText('ライフ: ' + this.lives);
      
      if (this.lives > 0) {
        this.resetBall();
        this.isGameStarted = false;
        this.startText.setVisible(true);
      } else {
        // ゲームオーバー音を再生 - safeAddSoundを使用
        const gameOverSound = this.safeAddSound('gameOver', { volume: 0.8 });
        gameOverSound.play();
        
        // 達成情報をコンソールに出力（デバッグ用）
        console.log(`Game Over - Score: ${this.score}, Level: ${this.stageLevel}`);
        
        // ゲームオーバー - 現在のレベルとスコアを渡す
        this.scene.start('GameOverScene', { 
          score: this.score,
          level: this.stageLevel
        });
      }
    }
    
    // すべてのブロックを壊した場合（勝利）
    if (this.bricks.countActive() === 0 && !this.levelCompleting) {
      this.levelCompleting = true;
      this.handleLevelComplete();
    }
    
    // パドルがタッチ操作されていない場合、ゲーム開始前はボールをパドルの位置に合わせる
    if (!this.isGameStarted && this.ball.getData('onPaddle')) {
      this.ball.x = this.paddle.x;
      this.ball.y = this.paddle.y - this.paddle.height / 2 - this.ball.height / 2;
    }
  }
  
  // レベルクリア時の処理
  handleLevelComplete() {
    // ボールを停止
    this.ball.setVelocity(0, 0);
    
    // ステージレベルを上げる
    this.stageLevel++;
    
    // レベルクリアメッセージの表示
    const levelCompleteText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 30,
      'レベルクリア!',
      {
        font: 'bold 36px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
      }
    );
    levelCompleteText.setOrigin(0.5);
    
    // 次のレベル表示
    const nextLevelText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 30,
      'レベル ' + this.stageLevel + ' へ進む',
      {
        font: '24px Arial',
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    nextLevelText.setOrigin(0.5);
    
    // テキストをフェードイン
    levelCompleteText.alpha = 0;
    nextLevelText.alpha = 0;
    
    this.tweens.add({
      targets: [levelCompleteText, nextLevelText],
      alpha: 1,
      duration: 500,
      ease: 'Power1'
    });
    
    // クリア音を再生し、完了を待つ
    const completeSound = this.safeAddSound('levelComplete', { volume: 0.8 });
    
    completeSound.once('complete', () => {
      // テキストをフェードアウト
      this.tweens.add({
        targets: [levelCompleteText, nextLevelText],
        alpha: 0,
        duration: 500,
        ease: 'Power1',
        onComplete: () => {
          // テキストを削除
          levelCompleteText.destroy();
          nextLevelText.destroy();
          
          // レベル表示を更新
          this.levelText.setText('レベル: ' + this.stageLevel);
          
          // レベルアップ効果
          this.tweens.add({
            targets: this.levelText,
            scale: { from: 1, to: 1.5 },
            duration: 300,
            yoyo: true,
            ease: 'Power1'
          });
          
          // 次のレベルを開始
          this.resetLevel();
          this.levelCompleting = false;
        }
      });
    });
    
    // 音の再生開始
    completeSound.play();
  }

  resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, this.paddle.y - this.paddle.height / 2 - this.ball.height / 2);
    this.ball.setData('onPaddle', true);
  }

  startBall() {
    if (this.ball.getData('onPaddle')) {
      this.ball.setData('onPaddle', false);
      this.startText.setVisible(false);
      
      // ボールの発射をサウンド再生完了後に行う
      const startSound = this.safeAddSound('startGame', { volume: 0.5 });
      
      startSound.once('complete', () => {
        // ランダムな角度でボールを打ち出す（ただし、真横や真下には打ち出さない）
        const angle = Phaser.Math.Between(220, 320);
        
        // レベルに応じたボール速度を計算
        const speed = this.calculateBallSpeed();
        
        this.ball.setVelocity(
          speed * Math.cos(Phaser.Math.DegToRad(angle)),
          speed * Math.sin(Phaser.Math.DegToRad(angle))
        );
      });
      
      // 音の再生開始
      startSound.play();
    }
  }
  
  // レベルに応じたボール速度を計算
  calculateBallSpeed() {
    // 基本速度 + (レベル-1) * 30 の速度に設定（レベル1なら基本速度のまま）
    const levelBonus = (this.stageLevel - 1) * 30;
    return this.initialBallSpeed + levelBonus;
  }

  createBricks() {
    // 画面サイズに基づいてブロックのサイズと配置を計算
    const screenWidth = this.cameras.main.width;
    const brickWidth = Math.floor(screenWidth / 7); // 6個のブロック + 余白
    const brickHeight = Math.floor(brickWidth / 2.5); // アスペクト比を保つ
    const padding = 4;
    
    // 画面の上部1/3あたりからブロックを配置
    const offsetX = (screenWidth - (brickWidth * 6) - (padding * 5)) / 2 + brickWidth / 2;
    const offsetY = this.cameras.main.height * 0.2;
    
    // レベルに応じたブロック配置
    let rows = 6; // 基本は6行
    if (this.stageLevel > 1) {
      // レベル2以上は行数を増やす（最大8行）
      rows = Math.min(6 + (this.stageLevel - 1), 8);
    }
    
    // レベルに応じた配置パターン
    let pattern = 0;
    if (this.stageLevel > 1) {
      // レベル2以上はランダムな配置パターン
      pattern = (this.stageLevel - 1) % 3; // 3種類のパターンをローテーション
    }
    
    // ブロック配置
    for (let col = 0; col < 6; col++) {
      for (let row = 0; row < rows; row++) {
        // パターンによって配置を変える
        if ((pattern === 1 && (col + row) % 2 === 0) || 
            (pattern === 2 && (row % 3 !== 0 || col % 2 !== 0)) ||
            pattern === 0) {
          
          const brick = this.bricks.create(
            offsetX + col * (brickWidth + padding),
            offsetY + row * (brickHeight + padding),
            'brick'
          );
          
          // ブロックのサイズを調整
          brick.displayWidth = brickWidth;
          brick.displayHeight = brickHeight;
          
          // 行によって色を変える
          brick.setTint(this.getBrickColor(row));
          brick.setOrigin(0.5);
          
          // レベルが上がるごとにブロックの耐久度も考慮（将来の拡張用）
          const points = (rows - row) * 10 * Math.sqrt(this.stageLevel);
          brick.setData('points', Math.floor(points)); // 上のほうのブロックほど高得点
        }
      }
    }
  }

  getBrickColor(row) {
    // 行ごとに異なる色を返す
    const colors = [
      0xFF0000, // 赤
      0xFF7F00, // オレンジ
      0xFFFF00, // 黄
      0x00FF00, // 緑
      0x0000FF, // 青
      0x4B0082, // 藍
      0x9400D3, // 紫
      0xFF69B4  // ピンク
    ];
    return colors[row % colors.length];
  }

  // 安全に音を再生するヘルパーメソッド
  playSound(key, config = {}) {
    // 音声ファイルが存在するか確認してから再生
    if (this.sound.get(key)) {
      return this.sound.play(key, config);
    } else {
      console.warn(`Sound "${key}" not found.`);
      return { once: () => {} }; // ダミーオブジェクトを返す
    }
  }
  
  // 安全に音を追加して再生するヘルパーメソッド
  safeAddSound(key, config = {}) {
    try {
      // サウンドキャッシュにあるか確認
      if (this.sound.get(key)) {
        return this.sound.get(key);
      }
      
      // サウンドを新規追加
      return this.sound.add(key, config);
    } catch (e) {
      console.warn(`Could not add sound "${key}": ${e.message}`);
      
      // ダミーのサウンドオブジェクトを返す
      return {
        play: () => {
          // 効果音の代わりに最低限の視覚フィードバック
          if (key === 'brickHit' || key === 'paddleHit') {
            this.cameras.main.shake(50, 0.005);
          }
          return this;
        },
        once: (event, callback) => {
          // 音がない場合は即座にコールバックを実行（少し遅延）
          if (event === 'complete') {
            // イベントによって異なる遅延を設定
            const delay = key === 'startGame' ? 500 : 
                          key === 'levelComplete' ? 1500 : 
                          key === 'gameOver' ? 1000 : 200;
            
            setTimeout(callback, delay);
          }
          return this;
        }
      };
    }
  }
  
  hitBrick(ball, brick) {
    // ブロックを非アクティブにする（消す）
    brick.disableBody(true, true);
    
    // スコアを加算
    this.score += brick.getData('points');
    this.scoreText.setText('スコア: ' + this.score);
    
    // ハイスコアの更新確認
    this.checkHighScore();
    
    // 速度をやや増加させる
    const velocity = this.ball.body.velocity;
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    
    // レベルに応じた最大速度を設定
    const maxSpeed = 500 + (this.stageLevel - 1) * 50; // レベルごとに最大速度を増加
    const newSpeed = Math.min(speed * 1.01, maxSpeed);
    const angle = Math.atan2(velocity.y, velocity.x);
    
    this.ball.setVelocity(
      newSpeed * Math.cos(angle),
      newSpeed * Math.sin(angle)
    );
    
    // ブロック破壊音を再生 - safeAddSoundを使用
    const brickSound = this.safeAddSound('brickHit', { volume: 0.3 });
    brickSound.play();
  }
  
  // ハイスコアを確認・更新する
  checkHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreText.setText('ハイスコア: ' + this.highScore);
      
      // ハイスコアを一時的に点滅させる
      this.tweens.add({
        targets: this.highScoreText,
        scale: { from: 1, to: 1.5 },
        duration: 200,
        yoyo: true,
        ease: 'Power1'
      });
      
      // localStorageへの保存はGameOverSceneで行う
    }
  }

  hitPaddle(ball, paddle) {
    // パドルのどこに当たったかによって反射角度を変える
    const diff = ball.x - paddle.x;
    
    // -1.0 から 1.0 の範囲に正規化
    const norm = diff / (paddle.width / 2);
    
    // 基本角度は-60度から60度（ラジアン）
    const angle = norm * Math.PI/3;
    
    // 速度を計算
    const speed = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2));
    
    // 新しい速度を設定
    ball.setVelocity(
      speed * Math.sin(angle),
      -speed * Math.cos(angle)
    );
    
    // パドル衝突音を再生 - safeAddSoundを使用
    const paddleSound = this.safeAddSound('paddleHit', { volume: 0.2 });
    paddleSound.play();
  }

  resetLevel() {
    // ブロックを再作成
    this.bricks.clear(true, true);
    this.createBricks();
    
    // ボールをリセット
    this.resetBall();
    this.isGameStarted = false;
    this.startText.setVisible(true);
  }

// ここから新しく追加するメソッド
handleOrientationChange(orientation) {
  console.log(`向きの変更を検出: ${orientation}`);
  
  // ブロックとパドルの再配置
  this.resizeGameElements();
  
  // ボールがパドル上にある場合は位置を調整
  if (!this.isGameStarted && this.ball.getData('onPaddle')) {
    this.resetBall();
  }
  
  // テキスト要素の再配置
  this.repositionUI();
}

resizeGameElements() {
  // パドルの再配置 - 画面の高さの80%の位置
  const paddleY = this.cameras.main.height * 0.80;
  this.paddle.setPosition(this.paddle.x, paddleY);
  
  // ブロックを再配置する必要がある場合
  // 注: 現在プレイ中の場合は再配置しない
  if (!this.isGameStarted || this.levelCompleting) {
    // 既存のブロックをクリア
    this.bricks.clear(true, true);
    // 新しいレイアウトでブロックを作成
    this.createBricks();
  }
}

repositionUI() {
  // スコアテキストとライフテキストの位置を更新
  this.scoreText.setPosition(16, 16);
  
  this.highScoreText.setPosition(this.cameras.main.width / 2, 16);
  this.highScoreText.setOrigin(0.5, 0);
  
  this.livesText.setPosition(this.cameras.main.width - 16, 16);
  this.livesText.setOrigin(1, 0);
  
  this.levelText.setPosition(this.cameras.main.width / 2, 40);
  this.levelText.setOrigin(0.5, 0);
  
  // 開始指示テキストが表示されている場合は中央に配置
  if (this.startText && this.startText.visible) {
    this.startText.setPosition(this.cameras.main.width / 2, this.cameras.main.height / 2);
    this.startText.setOrigin(0.5);
  }
}
}  // ← クラスの終了括弧