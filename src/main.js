import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

// モバイル端末かどうかを判定
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 画面のサイズを取得
const getGameSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // モバイルデバイスでは利用可能な最大サイズを使用
  if (isMobile) {
    return {
      width: width,
      height: height,
      maxWidth: width,
      maxHeight: height
    };
  } else {
    // デスクトップでは適切なサイズに制限
    return {
      width: Math.min(width, 400),
      height: Math.min(height, 800),
      maxWidth: width,
      maxHeight: height
    };
  }
};

// ゲームサイズを計算
const gameSize = getGameSize();

// ゲームの設定
const config = {
  type: Phaser.AUTO,
  width: gameSize.width,
  height: gameSize.height,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game-container',
    width: gameSize.width,
    height: gameSize.height,
    max: {
      width: gameSize.maxWidth,
      height: gameSize.maxHeight
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  input: {
    activePointers: 2 // マルチタッチに対応
  },
  audio: {
    disableWebAudio: false
  },
  scene: [BootScene, TitleScene, GameScene, GameOverScene],
  render: {
    pixelArt: false,
    antialias: true
  }
};

// ゲームインスタンスを作成
window.game = new Phaser.Game(config);

// 画面サイズ変更時の処理
const resizeGame = () => {
  if (window.game.isBooted) {
    const newSize = getGameSize();
    window.game.scale.resize(newSize.width, newSize.height);
    window.game.scale.refresh();
  }
};

// リサイズイベント
window.addEventListener('resize', () => {
  resizeGame();
});

// オリエンテーション変更時
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    resizeGame();
  }, 200);
});

// フルスクリーン切り替え時
document.addEventListener('fullscreenchange', () => {
  setTimeout(() => {
    resizeGame();
  }, 200);
});
document.addEventListener('webkitfullscreenchange', () => {
  setTimeout(() => {
    resizeGame();
  }, 200);
});