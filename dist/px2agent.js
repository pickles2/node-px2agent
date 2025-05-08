'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child_process = require('child_process');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _Px2Project_instances, _Px2Project_apiGet, _Px2Project_sitemap_children_params;
class Px2Project {
    /**
     * Px2Projectクラスのコンストラクタ
     */
    constructor(php_self, options = {}) {
        _Px2Project_instances.add(this);
        this.php_self = php_self;
        this.options = options || {};
        this.options.bin = this.options.bin || 'php';
        this.options.ini = this.options.ini || null;
        this.options.extension_dir = this.options.extension_dir || null;
    }
    /**
     * Pickles 2 にクエリを投げて、結果を受け取る (汎用)
     */
    query(path, opt = {}) {
        return new Promise((resolve, reject) => {
            const cloptions = [];
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
            const child = child_process.spawn(this.options.bin || 'php', cloptions, {});
            if (opt.success) {
                child.stdout.on('data', (data) => {
                    opt.success?.('' + data);
                    data_memo += data;
                });
            }
            else {
                child.stdout.on('data', (data) => {
                    data_memo += data;
                });
            }
            if (opt.error) {
                child.stderr.on('data', (data) => {
                    opt.error?.('' + data);
                    data_memo += data;
                });
            }
            else {
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
                }
                else {
                    reject({ message: 'Exited with code ' + code, output: data_memo, code });
                }
            });
        });
    }
    /**
     * PXコマンドを実行する
     */
    async px_command(cmd, path = '/', param = {}) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, cmd, path, param);
    }
    /**
     * バージョン番号を取得する
     */
    async get_version() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.version', '/', {});
    }
    /**
     * configデータを取得する
     */
    async get_config() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.config', '/', {});
    }
    /**
     * サイトマップデータを取得する
     */
    async get_sitemap() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.sitemap', '/', {});
    }
    /**
     * pathまたはidからページ情報を得る
     */
    async get_page_info(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.page_info', '/', {
            path: path
        });
    }
    /**
     * 親ページのIDを取得する
     */
    async get_parent(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.parent', path, {});
    }
    /**
     * 子階層のページの一覧を取得する
     */
    async get_children(path, options) {
        const params = __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_sitemap_children_params).call(this, options || {});
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.children', path, params);
    }
    /**
     * 兄弟ページの一覧を取得する
     */
    async get_bros(path, options) {
        const params = __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_sitemap_children_params).call(this, options || {});
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.bros', path, params);
    }
    /**
     * 次の兄弟ページを取得する
     */
    async get_bros_next(path, options) {
        const params = __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_sitemap_children_params).call(this, options || {});
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.bros_next', path, params);
    }
    /**
     * 前の兄弟ページを取得する
     */
    async get_bros_prev(path, options) {
        const params = __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_sitemap_children_params).call(this, options || {});
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.bros_prev', path, params);
    }
    /**
     * 次のページを取得する
     */
    async get_next(path, options) {
        const params = __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_sitemap_children_params).call(this, options || {});
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.next', path, params);
    }
    /**
     * 前のページを取得する
     */
    async get_prev(path, options) {
        const params = __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_sitemap_children_params).call(this, options || {});
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.prev', path, params);
    }
    /**
     * パンくず配列を取得する
     */
    async get_breadcrumb_array(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.breadcrumb_array', path, {});
    }
    /**
     * ダイナミックパス情報を得る
     */
    async get_dynamic_path_info(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.dynamic_path_info', '/', {
            path: path
        });
    }
    /**
     * ダイナミックパスに値をバインドする
     */
    async bind_dynamic_path_param(path, param) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.bind_dynamic_path_param', '/', {
            path: path,
            param: JSON.stringify(param)
        });
    }
    /**
     * role を取得する
     */
    async get_role(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.role', path, {});
    }
    /**
     * Actor のページID一覧を取得する
     */
    async get_actors(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.actors', path, {});
    }
    /**
     * get home directory path (deprecated)
     *
     * `get_path_homedir()` は 非推奨のメソッドです。
     * 代わりに、 `get_realpath_homedir()` を使用してください。
     */
    async get_path_homedir() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_homedir', '/', {});
    }
    /**
     * get home directory path
     */
    async get_realpath_homedir() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_homedir', '/', {});
    }
    /**
     * コンテンツルートディレクトリのパス(=install path) を取得する
     */
    async get_path_controot() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_controot', '/', {});
    }
    /**
     * DOCUMENT_ROOT のパスを取得する (deprecated)
     *
     * `get_path_docroot()` は 非推奨のメソッドです。
     * 代わりに、 `get_realpath_docroot()` を使用してください。
     */
    async get_path_docroot() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_docroot', '/', {});
    }
    /**
     * DOCUMENT_ROOT のパスを取得する
     */
    async get_realpath_docroot() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_docroot', '/', {});
    }
    /**
     * get content path
     */
    async get_path_content(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_content', path, {});
    }
    /**
     * ローカルリソースディレクトリのパスを得る
     */
    async path_files(path, path_resource = '') {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_files', path, {
            path_resource: path_resource
        });
    }
    /**
     * ローカルリソースディレクトリのサーバー内部パスを得る
     */
    async realpath_files(path, path_resource = '') {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.realpath_files', path, {
            path_resource: path_resource
        });
    }
    /**
     * ローカルリソースのキャッシュディレクトリのパスを得る
     */
    async path_files_cache(path, path_resource = '') {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_files_cache', path, {
            path_resource: path_resource
        });
    }
    /**
     * ローカルリソースのキャッシュディレクトリのサーバー内部パスを得る
     */
    async realpath_files_cache(path, path_resource = '') {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.realpath_files_cache', path, {
            path_resource: path_resource
        });
    }
    /**
     * コンテンツ別の非公開キャッシュディレクトリのサーバー内部パスを得る
     */
    async realpath_files_private_cache(path, path_resource = '') {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.realpath_files_private_cache', path, {
            path_resource: path_resource
        });
    }
    /**
     * domain を取得する
     */
    async get_domain() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.domain', '/', {});
    }
    /**
     * directory_index(省略できるファイル名) の一覧を得る
     */
    async get_directory_index() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.directory_index', '/', {});
    }
    /**
     * 最も優先されるインデックスファイル名を得る
     */
    async get_directory_index_primary() {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.directory_index_primary', '/', {});
    }
    /**
     * ファイルの処理方法を調べる
     */
    async get_path_proc_type(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.path_proc_type', path, {});
    }
    /**
     * リンク先のパスを生成する
     */
    async href(path_linkto) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.get.href', '/', {
            linkto: path_linkto
        });
    }
    /**
     * パスがダイナミックパスにマッチするか調べる
     */
    async is_match_dynamic_path(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.is.match_dynamic_path', '/', {
            path: path
        });
    }
    /**
     * ページが、パンくず内に存在しているか調べる
     */
    async is_page_in_breadcrumb(path, path_in) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.is.page_in_breadcrumb', path, {
            path: path_in
        });
    }
    /**
     * 除外ファイルか調べる
     */
    async is_ignore_path(path) {
        return await __classPrivateFieldGet(this, _Px2Project_instances, "m", _Px2Project_apiGet).call(this, 'api.is.ignore_path', '/', {
            path: path
        });
    }
    /**
     * パブリッシュする
     */
    publish(opt = {}) {
        // path_region
        if (!opt.path_region) {
            opt.path_region = '';
        }
        // paths_region
        let str_paths_region = '';
        if (typeof (opt.paths_region) === 'string') {
            opt.paths_region = [opt.paths_region];
        }
        if (Array.isArray(opt.paths_region)) {
            for (const i in opt.paths_region) {
                str_paths_region += '&paths_region[]=' + encodeURIComponent(opt.paths_region[i]);
            }
        }
        // paths_ignore
        let str_paths_ignore = '';
        if (typeof (opt.paths_ignore) === 'string') {
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
        return this.query('/?PX=publish.run&path_region=' + encodeURIComponent(opt.path_region || '') + str_paths_ignore + str_paths_region + str_keep_cache, opt);
    }
    /**
     * キャッシュを削除する
     */
    clearcache(opt = {}) {
        return this.query('/?PX=clearcache', opt);
    }
}
_Px2Project_instances = new WeakSet(), _Px2Project_apiGet = 
/**
 * PX=api.*を投げる
 */
async function _Px2Project_apiGet(cmd, path = '/', param = {}) {
    const aryParam = Object.entries(param).map(([key, value]) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(value);
    });
    const paramStr = aryParam.length ? '&' + aryParam.join('&') : '';
    try {
        const data = await this.query(path + '?PX=' + cmd + paramStr);
        try {
            return JSON.parse(data);
        }
        catch (e) {
            throw new Error('JSON Parse ERROR: "' + data + '";');
        }
    }
    catch (error) {
        throw error;
    }
}, _Px2Project_sitemap_children_params = function _Px2Project_sitemap_children_params(options) {
    function boolize(val) {
        if (val === null || val === undefined) {
            return null;
        }
        else if (typeof (val) === 'string') {
            switch (val) {
                case 'true':
                case '1':
                    return 'true';
                case 'false':
                case '0':
                    return 'false';
            }
        }
        else {
            return val ? 'true' : 'false';
        }
        return null;
    }
    const rtn = {};
    const filter = boolize(options.filter);
    if (filter !== null) {
        rtn['filter'] = filter;
    }
    return rtn;
};

/**
 * px2agent.ts
 */
/**
 * Px2Agent クラス
 */
class Px2Agent {
    /**
     * プロジェクトを作成する
     */
    createProject(php_self, options) {
        return new Px2Project(php_self, options);
    }
}
// シングルトンインスタンスをエクスポート
const px2agent = new Px2Agent();

exports.Px2Project = Px2Project;
exports.default = px2agent;
exports.px2agent = px2agent;
//# sourceMappingURL=px2agent.js.map
