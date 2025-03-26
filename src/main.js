// src/main.js - モジュールの二重読み込みを防ぐ版

// シーンのインポート
import BootScene from './scenes/BootScene.js';
import TitleScene from './scenes/TitleScene.js';
import GameScene from './scenes/GameScene.js';
import GameOverScene from './scenes/GameOverScene.js';

// このファイルが複数回実行されないようにするためのチェック
if (window.gameInitialized) {
  console.warn('Game already initialized, skipping...');
} else {
  window.gameInitialized = true;
  
  // ゲーム初期化処理をここに記述
  initGame();
}

// ウィンドウサイズに応じたゲームサイズを計算
function calculateGameSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // モバイルデバイス向けの最適化
  if (width > height) {
    return {
      width: Math.min(width, height * 1.5),
      height: height
    };
  } else {
    return {
      width: width,
      height: Math.min(height, width * 1.8)
    };
  }
}

// ゲーム初期化関数
function initGame() {
  console.log('Initializing game...');
  
  try {
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
      scene: [BootScene, TitleScene, GameScene, GameOverScene],
      // Canvas2Dの警告を解消するための設定
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        // Canvas2Dの警告を解消するために追加
        willReadFrequently: true
      }
    };

    // 既存のゲームインスタンスがあれば破棄
    if (window.game) {
      console.log('Destroying existing game instance');
      window.game.destroy(true);
    }

    // ゲームインスタンスを作成
    window.game = new Phaser.Game(config);

    // ウィンドウサイズが変更されたときの処理
    window.addEventListener('resize', () => {
      if (window.game && window.game.scale) {
        window.game.scale.resize(window.innerWidth, window.innerHeight);
      }
    });

    console.log('Game initialization complete');
  } catch (error) {
    console.error('Error initializing game:', error);
    alert('ゲームの初期化中にエラーが発生しました。ページを再読み込みしてください。');
  }
}

// グローバルエクスポート（デバッグ用）
window.debugGame = {
  restart: () => {
    if (window.game) {
      window.game.destroy(true);
      window.game = null;
    }
    window.gameInitialized = false;
    initGame();
  }
};