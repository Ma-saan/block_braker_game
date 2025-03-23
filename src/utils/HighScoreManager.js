/**
 * ハイスコアを管理するためのユーティリティクラス
 */
export default class HighScoreManager {
    /**
     * ローカルストレージに保存するキー名
     */
    static STORAGE_KEY = 'block_breaker_highscore';
    
    /**
     * 現在のハイスコアを取得する
     * @returns {number} 現在のハイスコア（ない場合は0）
     */
    static getHighScore() {
      try {
        const highScore = localStorage.getItem(this.STORAGE_KEY);
        return highScore ? parseInt(highScore, 10) : 0;
      } catch (error) {
        console.warn('ハイスコアの取得に失敗しました:', error);
        return 0;
      }
    }
    
    /**
     * 新しいスコアでハイスコアを更新する（より高い場合のみ）
     * @param {number} score 新しいスコア
     * @returns {boolean} ハイスコアが更新されたかどうか
     */
    static updateHighScore(score) {
      try {
        const currentHighScore = this.getHighScore();
        
        // 現在のスコアがハイスコアを超えた場合のみ更新
        if (score > currentHighScore) {
          localStorage.setItem(this.STORAGE_KEY, score.toString());
          return true;
        }
        
        return false;
      } catch (error) {
        console.warn('ハイスコアの更新に失敗しました:', error);
        return false;
      }
    }
    
    /**
     * ハイスコアをリセットする
     */
    static resetHighScore() {
      try {
        localStorage.removeItem(this.STORAGE_KEY);
      } catch (error) {
        console.warn('ハイスコアのリセットに失敗しました:', error);
      }
    }
  }