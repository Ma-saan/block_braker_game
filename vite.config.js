import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // すべてのネットワークインターフェースでリッスン
    port: 3000,      // ポート番号（任意の数字に変更可能）
    open: false      // サーバー起動時にブラウザを自動的に開く
  }
});