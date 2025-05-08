import { Px2ProjectOptions, QueryOptions, SitemapChildrenOptions, PublishOptions } from './types/types';
export declare class Px2Project {
    #private;
    private php_self;
    private options;
    /**
     * Px2Projectクラスのコンストラクタ
     */
    constructor(php_self: string, options?: Px2ProjectOptions);
    /**
     * Pickles 2 にクエリを投げて、結果を受け取る (汎用)
     */
    query(path: string, opt?: QueryOptions): Promise<string>;
    /**
     * PXコマンドを実行する
     */
    px_command(cmd: string, path?: string, param?: Record<string, string>): Promise<any>;
    /**
     * バージョン番号を取得する
     */
    get_version(): Promise<string>;
    /**
     * configデータを取得する
     */
    get_config(): Promise<any>;
    /**
     * サイトマップデータを取得する
     */
    get_sitemap(): Promise<any>;
    /**
     * pathまたはidからページ情報を得る
     */
    get_page_info(path: string): Promise<any>;
    /**
     * 親ページのIDを取得する
     */
    get_parent(path: string): Promise<string | false>;
    /**
     * 子階層のページの一覧を取得する
     */
    get_children(path: string, options?: SitemapChildrenOptions): Promise<string[]>;
    /**
     * 兄弟ページの一覧を取得する
     */
    get_bros(path: string, options?: SitemapChildrenOptions): Promise<string[]>;
    /**
     * 次の兄弟ページを取得する
     */
    get_bros_next(path: string, options?: SitemapChildrenOptions): Promise<string | false>;
    /**
     * 前の兄弟ページを取得する
     */
    get_bros_prev(path: string, options?: SitemapChildrenOptions): Promise<string | false>;
    /**
     * 次のページを取得する
     */
    get_next(path: string, options?: SitemapChildrenOptions): Promise<string | false>;
    /**
     * 前のページを取得する
     */
    get_prev(path: string, options?: SitemapChildrenOptions): Promise<string | false>;
    /**
     * パンくず配列を取得する
     */
    get_breadcrumb_array(path: string): Promise<string[]>;
    /**
     * ダイナミックパス情報を得る
     */
    get_dynamic_path_info(path: string): Promise<any>;
    /**
     * ダイナミックパスに値をバインドする
     */
    bind_dynamic_path_param(path: string, param: Record<string, string>): Promise<string>;
    /**
     * role を取得する
     */
    get_role(path: string): Promise<string>;
    /**
     * Actor のページID一覧を取得する
     */
    get_actors(path: string): Promise<string[]>;
    /**
     * get home directory path (deprecated)
     *
     * `get_path_homedir()` は 非推奨のメソッドです。
     * 代わりに、 `get_realpath_homedir()` を使用してください。
     */
    get_path_homedir(): Promise<string>;
    /**
     * get home directory path
     */
    get_realpath_homedir(): Promise<string>;
    /**
     * コンテンツルートディレクトリのパス(=install path) を取得する
     */
    get_path_controot(): Promise<string>;
    /**
     * DOCUMENT_ROOT のパスを取得する (deprecated)
     *
     * `get_path_docroot()` は 非推奨のメソッドです。
     * 代わりに、 `get_realpath_docroot()` を使用してください。
     */
    get_path_docroot(): Promise<string>;
    /**
     * DOCUMENT_ROOT のパスを取得する
     */
    get_realpath_docroot(): Promise<string>;
    /**
     * get content path
     */
    get_path_content(path: string): Promise<string>;
    /**
     * ローカルリソースディレクトリのパスを得る
     */
    path_files(path: string, path_resource?: string): Promise<string>;
    /**
     * ローカルリソースディレクトリのサーバー内部パスを得る
     */
    realpath_files(path: string, path_resource?: string): Promise<string>;
    /**
     * ローカルリソースのキャッシュディレクトリのパスを得る
     */
    path_files_cache(path: string, path_resource?: string): Promise<string>;
    /**
     * ローカルリソースのキャッシュディレクトリのサーバー内部パスを得る
     */
    realpath_files_cache(path: string, path_resource?: string): Promise<string>;
    /**
     * コンテンツ別の非公開キャッシュディレクトリのサーバー内部パスを得る
     */
    realpath_files_private_cache(path: string, path_resource?: string): Promise<string>;
    /**
     * domain を取得する
     */
    get_domain(): Promise<string>;
    /**
     * directory_index(省略できるファイル名) の一覧を得る
     */
    get_directory_index(): Promise<string[]>;
    /**
     * 最も優先されるインデックスファイル名を得る
     */
    get_directory_index_primary(): Promise<string>;
    /**
     * ファイルの処理方法を調べる
     */
    get_path_proc_type(path: string): Promise<string>;
    /**
     * リンク先のパスを生成する
     */
    href(path_linkto: string): Promise<string>;
    /**
     * パスがダイナミックパスにマッチするか調べる
     */
    is_match_dynamic_path(path: string): Promise<boolean>;
    /**
     * ページが、パンくず内に存在しているか調べる
     */
    is_page_in_breadcrumb(path: string, path_in: string): Promise<boolean>;
    /**
     * 除外ファイルか調べる
     */
    is_ignore_path(path: string): Promise<boolean>;
    /**
     * パブリッシュする
     */
    publish(opt?: PublishOptions): Promise<string>;
    /**
     * キャッシュを削除する
     */
    clearcache(opt?: QueryOptions): Promise<string>;
}
