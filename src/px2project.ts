/**
 * px2project.ts
 */
import { spawn } from 'child_process';
import { Px2ProjectOptions, QueryOptions, SitemapChildrenOptions, PublishOptions } from './types/types';

export class Px2Project {
	private php_self: string;
	private options: Px2ProjectOptions;

	/**
	 * Px2Projectクラスのコンストラクタ
	 */
	constructor(php_self: string, options: Px2ProjectOptions = {}) {
		this.php_self = php_self;
		this.options = options || {};
		this.options.bin = this.options.bin || 'php';
		this.options.ini = this.options.ini || null;
		this.options.extension_dir = this.options.extension_dir || null;
	}

	/**
	 * Pickles 2 にクエリを投げて、結果を受け取る (汎用)
	 */
	query(path: string, opt: QueryOptions = {}): Promise<string> {
		return new Promise((resolve, reject) => {
			const cloptions: string[] = [];
			
			if (this.options.ini) {
				cloptions.push('-c');
				cloptions.push(this.options.ini);
			}
			
			if (this.options.extension_dir) {
				cloptions.push('-d');
				cloptions.push('extension_dir=' + this.options.extension_dir);
			}
			
			cloptions.push(this.php_self);

			// 出力形式
			if (opt.output || opt.o) {
				cloptions.push('-o');
				cloptions.push(opt.output || opt.o || '');
			}

			// USER_AGENT
			if (opt.userAgent || opt.u) {
				cloptions.push('-u');
				cloptions.push(opt.userAgent || opt.u || '');
			}

			// Request Method
			if (opt.method) {
				cloptions.push('--method');
				cloptions.push(opt.method);
			}

			// Request Body
			if (opt.body) {
				cloptions.push('--body');
				cloptions.push(opt.body);
			}
			
			if (opt.bodyFile) {
				cloptions.push('--body-file');
				cloptions.push(opt.bodyFile);
			}

			// PHPのパス
			cloptions.push('--command-php');
			cloptions.push(this.options.bin || 'php');
			
			if (this.options.ini) {
				cloptions.push('-c');
				cloptions.push(this.options.ini);
			}
			
			if (this.options.extension_dir) {
				cloptions.push('-d');
				cloptions.push('extension_dir=' + this.options.extension_dir);
			}

			cloptions.push(path);

			let data_memo = '';
			const child = spawn(
				this.options.bin || 'php',
				cloptions,
				{}
			);

			if (opt.success) {
				child.stdout.on('data', (data) => {
					opt.success?.('' + data);
					data_memo += data;
				});
			} else {
				child.stdout.on('data', (data) => {
					data_memo += data;
				});
			}

			if (opt.error) {
				child.stderr.on('data', (data) => {
					opt.error?.('' + data);
					data_memo += data;
				});
			} else {
				child.stderr.on('data', (data) => {
					data_memo += data;
				});
			}

			child.on('close', (code) => {
				if (opt.complete) {
					opt.complete(data_memo, code || 0);
				}
				
				if (code === 0) {
					resolve(data_memo);
				} else {
					reject({ message: 'Exited with code ' + code, output: data_memo, code });
				}
			});
		});
	}

	// ----------------------------------------------------------------------------
	// System API

	/**
	 * PXコマンドを実行する
	 */
	async px_command(cmd: string, path: string = '/', param: Record<string, string> = {}): Promise<any> {
		return await this.#apiGet(cmd, path, param);
	}

	/**
	 * バージョン番号を取得する
	 */
	async get_version(): Promise<string> {
		return await this.#apiGet('api.get.version', '/', {});
	}

	/**
	 * configデータを取得する
	 */
	async get_config(): Promise<any> {
		return await this.#apiGet('api.get.config', '/', {});
	}

	/**
	 * domain を取得する
	 */
	async get_domain(): Promise<string> {
		return await this.#apiGet('api.get.domain', '/', {});
	}

	/**
	 * get home directory path (deprecated)
	 *
	 * `get_path_homedir()` は 非推奨のメソッドです。
	 * 代わりに、 `get_realpath_homedir()` を使用してください。
	 */
	async get_path_homedir(): Promise<string> {
		return await this.#apiGet('api.get.path_homedir', '/', {});
	}

	/**
	 * get home directory path
	 */
	async get_realpath_homedir(): Promise<string> {
		return await this.#apiGet('api.get.path_homedir', '/', {});
	}

	/**
	 * コンテンツルートディレクトリのパス(=install path) を取得する
	 */
	async get_path_controot(): Promise<string> {
		return await this.#apiGet('api.get.path_controot', '/', {});
	}

	/**
	 * DOCUMENT_ROOT のパスを取得する (deprecated)
	 *
	 * `get_path_docroot()` は 非推奨のメソッドです。
	 * 代わりに、 `get_realpath_docroot()` を使用してください。
	 */
	async get_path_docroot(): Promise<string> {
		return await this.#apiGet('api.get.path_docroot', '/', {});
	}

	/**
	 * DOCUMENT_ROOT のパスを取得する
	 */
	async get_realpath_docroot(): Promise<string> {
		return await this.#apiGet('api.get.path_docroot', '/', {});
	}

	/**
	 * directory_index(省略できるファイル名) の一覧を得る
	 */
	async get_directory_index(): Promise<string[]> {
		return await this.#apiGet('api.get.directory_index', '/', {});
	}

	/**
	 * 最も優先されるインデックスファイル名を得る
	 */
	async get_directory_index_primary(): Promise<string> {
		return await this.#apiGet('api.get.directory_index_primary', '/', {});
	}

	/**
	 * ファイルの処理方法を調べる
	 */
	async get_path_proc_type(path: string): Promise<string> {
		return await this.#apiGet('api.get.path_proc_type', path, {});
	}

	/**
	 * リンク先のパスを生成する
	 */
	async href(path_linkto: string): Promise<string> {
		return await this.#apiGet('api.get.href', '/', {
			linkto: path_linkto
		});
	}

	/**
	 * パスがダイナミックパスにマッチするか調べる
	 */
	async is_match_dynamic_path(path: string): Promise<boolean> {
		return await this.#apiGet('api.is.match_dynamic_path', '/', {
			path: path
		});
	}

	/**
	 * ページが、パンくず内に存在しているか調べる
	 */
	async is_page_in_breadcrumb(path: string, path_in: string): Promise<boolean> {
		return await this.#apiGet('api.is.page_in_breadcrumb', path, {
			path: path_in
		});
	}

	/**
	 * 除外ファイルか調べる
	 */
	async is_ignore_path(path: string): Promise<boolean> {
		return await this.#apiGet('api.is.ignore_path', '/', {
			path: path
		});
	}

	// ----------------------------------------------------------------------------
	// Sitemap

	/**
	 * サイトマップデータを取得する
	 */
	async get_sitemap(): Promise<any> {
		return await this.#apiGet('api.get.sitemap', '/', {});
	}

	/**
	 * pathまたはidからページ情報を得る
	 */
	async get_page_info(path: string): Promise<any> {
		return await this.#apiGet('api.get.page_info', '/', {
			path: path
		});
	}

	/**
	 * 親ページのIDを取得する
	 */
	async get_parent(path: string): Promise<string | false> {
		return await this.#apiGet('api.get.parent', path, {});
	}

	/**
	 * 子階層のページの一覧を取得する
	 */
	async get_children(path: string, options?: SitemapChildrenOptions): Promise<string[]> {
		const params = this.#sitemap_children_params(options || {});
		return await this.#apiGet('api.get.children', path, params);
	}

	/**
	 * 兄弟ページの一覧を取得する
	 */
	async get_bros(path: string, options?: SitemapChildrenOptions): Promise<string[]> {
		const params = this.#sitemap_children_params(options || {});
		return await this.#apiGet('api.get.bros', path, params);
	}

	/**
	 * 次の兄弟ページを取得する
	 */
	async get_bros_next(path: string, options?: SitemapChildrenOptions): Promise<string | false> {
		const params = this.#sitemap_children_params(options || {});
		return await this.#apiGet('api.get.bros_next', path, params);
	}

	/**
	 * 前の兄弟ページを取得する
	 */
	async get_bros_prev(path: string, options?: SitemapChildrenOptions): Promise<string | false> {
		const params = this.#sitemap_children_params(options || {});
		return await this.#apiGet('api.get.bros_prev', path, params);
	}

	/**
	 * 次のページを取得する
	 */
	async get_next(path: string, options?: SitemapChildrenOptions): Promise<string | false> {
		const params = this.#sitemap_children_params(options || {});
		return await this.#apiGet('api.get.next', path, params);
	}

	/**
	 * 前のページを取得する
	 */
	async get_prev(path: string, options?: SitemapChildrenOptions): Promise<string | false> {
		const params = this.#sitemap_children_params(options || {});
		return await this.#apiGet('api.get.prev', path, params);
	}

	/**
	 * パンくず配列を取得する
	 */
	async get_breadcrumb_array(path: string): Promise<string[]> {
		return await this.#apiGet('api.get.breadcrumb_array', path, {});
	}

	/**
	 * ダイナミックパス情報を得る
	 */
	async get_dynamic_path_info(path: string): Promise<any> {
		return await this.#apiGet('api.get.dynamic_path_info', '/', {
			path: path
		});
	}

	/**
	 * ダイナミックパスに値をバインドする
	 */
	async bind_dynamic_path_param(path: string, param: Record<string, string>): Promise<string> {
		return await this.#apiGet('api.get.bind_dynamic_path_param', '/', {
			path: path,
			param: JSON.stringify(param)
		});
	}

	/**
	 * role を取得する
	 */
	async get_role(path: string): Promise<string> {
		return await this.#apiGet('api.get.role', path, {});
	}

	/**
	 * Actor のページID一覧を取得する
	 */
	async get_actors(path: string): Promise<string[]> {
		return await this.#apiGet('api.get.actors', path, {});
	}


	// ----------------------------------------------------------------------------
	// BlogKit

	// ----------------------------------------------------------------------------
	// Pages

	// ----------------------------------------------------------------------------
	// Contents

	/**
	 * get content path
	 */
	async get_path_content(path: string): Promise<string> {
		return await this.#apiGet('api.get.path_content', path, {});
	}

	/**
	 * ローカルリソースディレクトリのパスを得る
	 */
	async path_files(path: string, path_resource: string = ''): Promise<string> {
		return await this.#apiGet('api.get.path_files', path, {
			path_resource: path_resource
		});
	}

	/**
	 * ローカルリソースディレクトリのサーバー内部パスを得る
	 */
	async realpath_files(path: string, path_resource: string = ''): Promise<string> {
		return await this.#apiGet('api.get.realpath_files', path, {
			path_resource: path_resource
		});
	}

	/**
	 * ローカルリソースのキャッシュディレクトリのパスを得る
	 */
	async path_files_cache(path: string, path_resource: string = ''): Promise<string> {
		return await this.#apiGet('api.get.path_files_cache', path, {
			path_resource: path_resource
		});
	}

	/**
	 * ローカルリソースのキャッシュディレクトリのサーバー内部パスを得る
	 */
	async realpath_files_cache(path: string, path_resource: string = ''): Promise<string> {
		return await this.#apiGet('api.get.realpath_files_cache', path, {
			path_resource: path_resource
		});
	}

	/**
	 * コンテンツ別の非公開キャッシュディレクトリのサーバー内部パスを得る
	 */
	async realpath_files_private_cache(path: string, path_resource: string = ''): Promise<string> {
		return await this.#apiGet('api.get.realpath_files_private_cache', path, {
			path_resource: path_resource
		});
	}


	// ----------------------------------------------------------------------------
	// Themes

	// ----------------------------------------------------------------------------
	// Modules

	// ----------------------------------------------------------------------------
	// Tools

	/**
	 * パブリッシュする
	 */
	publish(opt: PublishOptions = {}): Promise<string> {
		// path_region
		if (!opt.path_region) {
			opt.path_region = '';
		}

		// paths_region
		let str_paths_region = '';
		if (typeof(opt.paths_region) === 'string') {
			opt.paths_region = [opt.paths_region];
		}
		if (Array.isArray(opt.paths_region)) {
			for (const i in opt.paths_region) {
				str_paths_region += '&paths_region[]=' + encodeURIComponent(opt.paths_region[i]);
			}
		}

		// paths_ignore
		let str_paths_ignore = '';
		if (typeof(opt.paths_ignore) === 'string') {
			opt.paths_ignore = [opt.paths_ignore];
		}
		if (Array.isArray(opt.paths_ignore)) {
			for (const i in opt.paths_ignore) {
				str_paths_ignore += '&paths_ignore[]=' + encodeURIComponent(opt.paths_ignore[i]);
			}
		}

		// keep_cache
		let str_keep_cache = '';
		if (opt.keep_cache) {
			str_keep_cache = '&keep_cache=1';
		}

		return this.query(
			'/?PX=publish.run&path_region=' + encodeURIComponent(opt.path_region || '') + str_paths_ignore + str_paths_region + str_keep_cache,
			opt
		);
	}

	/**
	 * キャッシュを削除する
	 */
	clearcache(opt: QueryOptions = {}): Promise<string> {
		return this.query(
			'/?PX=clearcache',
			opt
		);
	}

	// ----------------------------------------------------------------------------

	/**
	 * PX=* を投げる
	 */
	async #apiGet(cmd: string, path: string = '/', param: Record<string, string> = {}): Promise<any> {
		const aryParam = Object.entries(param).map(([key, value]) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(value);
		});
		
		const paramStr = aryParam.length ? '&' + aryParam.join('&') : '';
		
		try {
			const data = await this.query(path + '?PX=' + cmd + paramStr);
			
			try {
				return JSON.parse(data);
			} catch (e) {
				throw new Error('JSON Parse ERROR: "' + data + '";');
			}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * get_children() へ渡されるオプションを調整する
	 * この形式のオプションは、get_bros(), get_bros_next(), get_bros_prev(), get_next(), get_prev() でも共通です。
	 */
	#sitemap_children_params(options: SitemapChildrenOptions): Record<string, string> {
		function boolize(val: any): string | null {
			if (val === null || val === undefined) {
				return null;
			} else if (typeof(val) === 'string') {
				switch (val) {
					case 'true':
					case '1':
						return 'true';
					case 'false':
					case '0':
						return 'false';
				}
			} else {
				return val ? 'true' : 'false';
			}
			return null;
		}
		
		const rtn: Record<string, string> = {};
		const filter = boolize(options.filter);
		
		if (filter !== null) {
			rtn['filter'] = filter;
		}
		
		return rtn;
	}
}