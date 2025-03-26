// import Phaser from 'phaser'; - CDNでロードするため不要

import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
// import Phaser from 'phaser'; - CDNでロードするため不要

import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// アスペクト比を維持するためのゲームサイズ計算
function calculateGameSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // 理想的なアスペクト比 (16:9)
  const targetRatio = 9 / 16;
  const currentRatio = width / height;
  
  // 横向きモードと縦向きモードで異なる処理
  if (width > height) {
    // 横向きモード - 高さに合わせて幅を調整
    return {
      width: Math.min(width, height / targetRatio),
      height: height,
      isLandscape: true
    };
  } else {
    // 縦向きモード - 幅に合わせて高さを調整
    return {
      width: width,
      height: Math.min(height, width / targetRatio),
      isLandscape: false
    };
  }
}
}

// ゲームサイズを計算
const gameSize = calculateGameSize();
const gameSize = calculateGameSize();

// Phaserの設定
// Phaserの設定
const config = {
  type: Phaser.AUTO,
  width: gameSize.width,
  height: gameSize.height,
  parent: 'game-container',
  parent: 'game-container',
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT, // RESIZEからFITに変更してアスペクト比を維持
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gameSize.width,
    height: gameSize.height
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene]
  scene: [BootScene, TitleScene, GameScene, GameOverScene]
};

// ゲームインスタンスを作成
const game = new Phaser.Game(config);
const game = new Phaser.Game(config);

// 現在のゲームの向き（縦/横）を保存
let currentOrientation = gameSize.isLandscape ? 'landscape' : 'portrait';

// ウィンドウサイズが変更されたときの処理
window.addEventListener('resize', () => {
  if (game.scale) {
    const newSize = calculateGameSize();
    const newOrientation = newSize.isLandscape ? 'landscape' : 'portrait';
    
    // 向きが変わった場合は特別な処理
    if (newOrientation !== currentOrientation) {
      currentOrientation = newOrientation;
      
      // 現在アクティブなシーンに向きの変更を通知
      const currentScene = game.scene.getScenes(true)[0];
      if (currentScene && typeof currentScene.handleOrientationChange === 'function') {
        currentScene.handleOrientationChange(newOrientation);
      }
    }
    
    // ゲームサイズを更新
    game.scale.resize(newSize.width, newSize.height);
    
    // 100ms後に再度センタリングを行い、配置を安定させる
    setTimeout(() => {
      game.scale.refresh();
    }, 100);
  }
});

// 回転イベントのより良い処理
window.addEventListener('orientationchange', () => {
  // 少し遅延を設けて処理
  setTimeout(() => {
    const newSize = calculateGameSize();
    const newOrientation = newSize.isLandscape ? 'landscape' : 'portrait';
    
    // 向きが変わった場合は特別な処理
    if (newOrientation !== currentOrientation) {
      currentOrientation = newOrientation;
      
      // 現在アクティブなシーンに向きの変更を通知
      const currentScene = game.scene.getScenes(true)[0];
      if (currentScene && typeof currentScene.handleOrientationChange === 'function') {
        currentScene.handleOrientationChange(newOrientation);
      }
    }
    
    // ゲームサイズを更新
    if (game.scale) {
      game.scale.resize(newSize.width, newSize.height);
      game.scale.refresh();
    }
    
    // スクロールをリセット
    window.scrollTo(0, 0);
  }, 200);
});

// グローバルに公開（デバッグや他のスクリプトからアクセスするため）
window.game = game;
window.gameOrientation = () => currentOrientation;

export default game;