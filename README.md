# px2agent

__px2agent__ は、[Pickles 2](http://pickles2.pxt.jp/) と NodeJS スクリプトを仲介するAPIを提供します。

<table>
  <thead>
	<tr>
	  <th></th>
	  <th>Linux</th>
	  <th>Windows</th>
	</tr>
  </thead>
  <tbody>
	<tr>
	  <th>master</th>
	  <td align="center">
		<a href="https://travis-ci.org/pickles2/node-px2agent"><img src="https://secure.travis-ci.org/pickles2/node-px2agent.svg?branch=master"></a>
	  </td>
	  <td align="center">
		<a href="https://ci.appveyor.com/project/tomk79/node-px2agent"><img src="https://ci.appveyor.com/api/projects/status/jd0dcl2ya2t2nrsa/branch/master?svg=true"></a>
	  </td>
	</tr>
	<tr>
	  <th>develop</th>
	  <td align="center">
		<a href="https://travis-ci.org/pickles2/node-px2agent"><img src="https://secure.travis-ci.org/pickles2/node-px2agent.svg?branch=develop"></a>
	  </td>
	  <td align="center">
		<a href="https://ci.appveyor.com/project/tomk79/node-px2agent"><img src="https://ci.appveyor.com/api/projects/status/jd0dcl2ya2t2nrsa/branch/develop?svg=true"></a>
	  </td>
	</tr>
  </tbody>
</table>

[![NPM](https://nodei.co/npm/px2agent.png)](https://nodei.co/npm/px2agent/)



## 使い方 - Usage

```js
var px2proj = require('px2agent').createProject('./.px_execute.php');


/**
 * Pickles2 にクエリを投げて、結果を受け取る
 */
px2proj.query('/?PX=phpinfo', {
	"output": "json",
	"userAgent": "Mozilla/5.0",
	"success": function(data){
		console.log(data);
	},
	"complete": function(data, code){
		console.log(data, code);
	}
});

/**
 * バージョン番号を取得する
 */
px2proj.get_version(function(value){
	console.log(value);
});


/**
 * configデータを取得する
 */
px2proj.get_config(function(value){
	console.log(value);
});

/**
 * サイトマップデータを取得する
 */
px2proj.get_sitemap(function(value){
	console.log(value);
});

/**
 * pathまたはidからページ情報を得る
 */
px2proj.get_page_info('/', function(value){
	console.log(value);
});

/**
 * 親ページのIDを取得する
 */
px2proj.get_parent('/sample_pages/', function(value){
	console.log(value);
});

/**
 * 子階層のページの一覧を取得する
 */
px2proj.get_children('/', function(value){
	console.log(value);
});
/**
 * 子階層のページの一覧を、filterを無効にして取得する
 */
px2proj.get_children('/', {filter: false}, function(value){
	console.log(value);
});

/**
 * 同じ階層のページの一覧を取得する
 */
px2proj.get_bros('/sample_pages/', function(value){
	console.log(value);
});

/**
 * 同じ階層のページの一覧を、filterを無効にして取得する
 */
px2proj.get_bros('/sample_pages/', {filter: false}, function(value){
	console.log(value);
});

/**
 * 同じ階層の次のページのIDを取得する
 */
px2proj.get_bros_next('/sample_pages/', function(value){
	console.log(value);
});

/**
 * 同じ階層の次のページのIDを、filterを無効にして取得する
 */
px2proj.get_bros_next('/sample_pages/', {filter: false}, function(value){
	console.log(value);
});

/**
 * 同じ階層の前のページのIDを取得する
 */
px2proj.get_bros_prev('/sample_pages/', function(value){
	console.log(value);
});

/**
 * 同じ階層の前のページのIDを、filterを無効にして取得する
 */
px2proj.get_bros_prev('/sample_pages/', {filter: false}, function(value){
	console.log(value);
});

/**
 * 次のページのIDを取得する
 */
px2proj.get_next('/sample_pages/', function(value){
	console.log(value);
});

/**
 * 次のページのIDを、filterを無効にして取得する
 */
px2proj.get_next('/sample_pages/', {filter: false}, function(value){
	console.log(value);
});

/**
 * 前のページのIDを取得する
 */
px2proj.get_prev('/sample_pages/', function(value){
	console.log(value);
});

/**
 * 前のページのIDを、filterを無効にして取得する
 */
px2proj.get_prev('/sample_pages/', {filter: false}, function(value){
	console.log(value);
});

/**
 * パンくず配列を取得する
 */
px2proj.get_breadcrumb_array('/sample_pages/', function(value){
	console.log(value);
});

/**
 * ダイナミックパス情報を得る
 */
px2proj.get_dynamic_path_info('/sample_pages/', function(value){
	console.log(value);
});

/**
 * ダイナミックパスに値をバインドする
 */
px2proj.bind_dynamic_path_param('/dynamicPath/{*}', {'':'abc.html'}, function(value){
	console.log(value);
});

/**
 * role を取得する
 */
px2proj.get_role('/sample_pages/actor1.html', function(role){
	console.log(role);
});

/**
 * Actor のページID一覧を取得する
 */
px2proj.get_actors('/sample_pages/role.html', function(actors){
	console.log(actors);
});

/**
 * get home directory path
 */
px2proj.get_realpath_homedir(function(value){
	console.log(value);
})

/**
 * コンテンツルートディレクトリのパス(=install path) を取得する
 */
px2proj.get_path_controot(function(value){
	console.log(value);
});

/**
 * DOCUMENT_ROOT のパスを取得する
 */
px2proj.get_realpath_docroot(function(value){
	console.log(value);
});

/**
 * get content path
 */
px2proj.get_path_content('/', function(value){
	console.log(value);
});

/**
 * ローカルリソースディレクトリのパスを得る
 */
px2proj.path_files('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * ローカルリソースディレクトリのサーバー内部パスを得る
 */
px2proj.realpath_files('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * ローカルリソースのキャッシュディレクトリのパスを得る
 */
px2proj.path_files_cache('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * ローカルリソースのキャッシュディレクトリのサーバー内部パスを得る
 */
px2proj.realpath_files_cache('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * コンテンツ別の非公開キャッシュディレクトリのサーバー内部パスを得る
 */
px2proj.realpath_files_private_cache('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * domain を取得する
 */
px2proj.get_domain(function(value){
	console.log(value);
});

/**
 * directory_index(省略できるファイル名) の一覧を得る
 */
px2proj.get_directory_index(function(value){
	console.log(value);
});

/**
 * 最も優先されるインデックスファイル名を得る
 */
px2proj.get_directory_index_primary(function(value){
	console.log(value);
});

/**
 * ファイルの処理方法を調べる
 */
px2proj.get_path_proc_type('/sample_pages/', function(value){
	console.log(value);
});

/**
 * リンク先のパスを生成する
 */
px2proj.href('/sample_pages/', function(value){
	console.log(value);
});

/**
 * パスがダイナミックパスにマッチするか調べる
 */
px2proj.is_match_dynamic_path('/sample_pages/', function(value){
	console.log(value);
});

/**
 * ページが、パンくず内に存在しているか調べる
 */
px2proj.is_page_in_breadcrumb('/sample_pages/', '/', function(value){
	console.log(value);
});

/**
 * 除外ファイルか調べる
 */
px2proj.is_ignore_path('/sample_pages/', function(value){
	console.log(value);
});


/**
 * パブリッシュする
 */
px2proj.publish({
	"path_region": "/path/region/",
	"paths_region": [
		"/path/region1/",
		"/path/region2/"
	],
	"paths_ignore": [
		"/path/region/ignored/1/",
		"/path/region/ignored/2/"
	],
	"keep_cache": 1,
	"success": function(output){
		// console.log(output);
	},
	"complete":function(output){
		console.log(output);
	}
});

/**
 * キャッシュを削除する
 */
px2proj.clearcache({
	"success": function(output){
		// console.log(output);
	},
	"complete":function(output){
		console.log(output);
	}
});
```

### PHPバイナリのパスを指定する場合 - Specifying path to PHP binary

```js
var px2proj = require('px2agent').createProject(
  './px_execute.php',
  {
	'bin': '/path/to/php',
	'ini': '/path/to/php.ini',
	'extension_dir': '/path/to/ext/'
  }
);
```


## 開発者向け情報 - for developers

### 開発環境セットアップ - Setting up development environment

```bash
$ cd {$project_root}
$ composer install
$ npm install
```

### テスト - Test

```bash
$ npm test
```

### ドキュメント出力 - JSDoc

```bash
$ npm run documentation
```



## 更新履歴 - Change log

### px2agent 2.0.6 (2017年??月??日)

- ??????????????????????????????

### px2agent 2.0.5 (2017年3月14日)

- pickles2/px-fw-2.x@2.0.29 対応
- `pj.publish()` に `keep_cache` オプションを追加。
- `pj.publish()` に `paths_region` オプションを追加。
- `pj.get_path_homedir()` を `pj.get_realpath_homedir()` に改名。(古いメソッド名の実装は残されているが非推奨)
- `pj.get_path_docroot()` を `pj.get_realpath_docroot()` に改名。(古いメソッド名の実装は残されているが非推奨)

### px2agent 2.0.4 (2016年2月22日)

- pickles2/px-fw-2.x@2.0.17 対応
- `pj.publish()` に `paths_ignore` オプションを追加。

### px2agent 2.0.3 (2015年11月9日)

- pickles2/px-fw-2.x@2.0.15 対応
- アクター機能 `pj.get_role()`, `pj.get_actors()` を追加。

###  px2agent 2.0.2 (2015年9月15日)

- PHPが異常終了した場合の例外をキャッチし、 `false` を返すようになった。

### px2agent 2.0.1 (2015年9月10日)

- PHPのパスを指定した場合の引数 `-c` と `-d` に関する不具合を修正。
- オプション `extension_dir` を追加。

### px2agent 2.0.0 (2015年6月28日)

- Initial Release.


## ライセンス - License

MIT License


## 作者 - Author

- (C)Tomoya Koyanagi <tomk79@gmail.com>
- website: <http://www.pxt.jp/>
- Twitter: @tomk79 <http://twitter.com/tomk79/>
