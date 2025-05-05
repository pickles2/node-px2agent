/**
 * Px2Agentのオプション
 */
export interface Px2ProjectOptions {
    bin?: string;
    ini?: string | null;
    extension_dir?: string | null;
}
/**
 * クエリオプション
 */
export interface QueryOptions {
    output?: string;
    o?: string;
    userAgent?: string;
    u?: string;
    method?: string;
    body?: string;
    bodyFile?: string;
    success?: (data: string) => void;
    error?: (data: string) => void;
    complete?: (data: string, code: number) => void;
}
/**
 * サイトマップ子ページ取得オプション
 */
export interface SitemapChildrenOptions {
    filter?: boolean | null;
}
/**
 * パブリッシュオプション
 */
export interface PublishOptions {
    path_region?: string;
    paths_region?: string | string[];
    paths_ignore?: string | string[];
    keep_cache?: boolean;
    success?: (data: string) => void;
    error?: (data: string) => void;
    complete?: (data: string, code: number) => void;
}
