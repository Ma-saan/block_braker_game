import { defineConfig } from 'vite';

export default defineConfig({
  // リポジトリ名をベースパスとして設定
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
  }
});