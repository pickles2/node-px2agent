/**
 * px2agent.ts
 */
import { Px2Project } from './px2project';
import { Px2ProjectOptions } from './types';

// 型定義をエクスポート
export type { Px2ProjectOptions, QueryOptions, SitemapChildrenOptions, PublishOptions } from './types';
export { Px2Project } from './px2project';

/**
 * Px2Agent クラス
 */
class Px2Agent {
  /**
   * プロジェクトを作成する
   */
  createProject(php_self: string, options?: Px2ProjectOptions): Px2Project {
    return new Px2Project(php_self, options);
  }
}

// シングルトンインスタンスをエクスポート
export const px2agent = new Px2Agent();

// デフォルトエクスポート
export default px2agent;