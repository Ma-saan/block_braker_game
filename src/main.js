// import Phaser from 'phaser'; - CDNでロードするため不要

import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// ウィンドウサイズに応じたゲームサイズを計算
function calculateGameSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // モバイルデバイス向けの最適化
  // 横幅が縦幅より大きい場合（横向き）は、アスペクト比を調整
  if (width > height) {
    return {
      width: Math.min(width, height * 1.5), // 横長すぎないように制限
      height: height
    };
  } else {
    return {
      width: width,
      height: Math.min(height, width * 1.8) // 縦長すぎないように制限
    };
  }
}

// ゲームサイズを計算
const gameSize = calculateGameSize();

// Phaserの設定
const config = {
  type: Phaser.AUTO,
  width: gameSize.width,
  height: gameSize.height,
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene]
};

// ゲームインスタンスを作成
const game = new Phaser.Game(config);

// ウィンドウサイズが変更されたときの処理
window.addEventListener('resize', () => {
  if (game.scale) {
    game.scale.resize(window.innerWidth, window.innerHeight);
  }
});

// ゲームインスタンスをグローバルに公開（デバッグや他のスクリプトからアクセスするため）
window.game = game;

export default game;