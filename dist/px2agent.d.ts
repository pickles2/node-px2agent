/**
 * px2agent.ts
 */
import { Px2Project } from './px2project';
import { Px2ProjectOptions } from './types/types';
export type { Px2ProjectOptions, QueryOptions, SitemapChildrenOptions, PublishOptions } from './types/types';
export { Px2Project } from './px2project';
/**
 * Px2Agent クラス
 */
declare class Px2Agent {
    /**
     * プロジェクトを作成する
     */
    createProject(php_self: string, options?: Px2ProjectOptions): Px2Project;
}
export declare const px2agent: Px2Agent;
export default px2agent;
