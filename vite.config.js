import { defineConfig } from 'vite';

export default defineConfig({
  // リポジトリ名をベースパスとして設定
  // 以下のようにリポジトリ名を設定してください
  base: '/block_braker_game/',
  
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // ソースマップを生成（デバッグ用）
    sourcemap: true,
  },
  
  // GitHub Pagesへのデプロイを考慮した設定
  server: {
    host: true,
    port: 3000,
    open: true
  },
  
  // アセットのURLを修正するプラグイン
  plugins: []
});