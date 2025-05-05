# px2agent

__px2agent__ は、[Pickles 2](https://pickles2.com/) と NodeJS スクリプトを仲介するAPIを提供します。

[![NPM](https://nodei.co/npm/px2agent.png)](https://nodei.co/npm/px2agent/)



## 使い方 - Usage

### CommonJS (JavaScript)

```js
// CommonJS形式
const px2agent = require('px2agent');
const px2proj = px2agent.createProject('./.px_execute.php');

// コールバックスタイル（従来のAPI）
px2proj.get_version(function(version) {
  console.log('Pickles 2 バージョン: ', version);
});

// Promiseスタイル（新しいAPI）
px2proj.get_version()
  .then(version => {
    console.log('Pickles 2 バージョン: ', version);
  })
  .catch(err => {
    console.error('エラー: ', err);
  });

// async/awaitスタイル（新しいAPI）
async function checkVersion() {
  try {
    const version = await px2proj.get_version();
    console.log('Pickles 2 バージョン: ', version);
  } catch (err) {
    console.error('エラー: ', err);
  }
}
checkVersion();
```

### ES Modules (TypeScript/JavaScript)

```ts
// ESモジュール形式（TypeScript/JavaScript）
import px2agent from 'px2agent';
// または
import { px2agent } from 'px2agent';

// プロジェクトを初期化
const px2proj = px2agent.createProject('./.px_execute.php');

// async/await を使った例
async function main() {
  try {
    // バージョンを取得
    const version = await px2proj.get_version();
    console.log('Pickles 2 バージョン: ', version);
    
    // 設定を取得
    const config = await px2proj.get_config();
    console.log('設定: ', config);
    
    // サイトマップを取得
    const sitemap = await px2proj.get_sitemap();
    console.log('サイトマップ: ', sitemap);
    
    // ページ情報を取得
    const pageInfo = await px2proj.get_page_info('/');
    console.log('ページ情報: ', pageInfo);
    
    // パブリッシュを実行
    const publishResult = await px2proj.publish({
      path_region: '/path/to/publish/'
    });
    console.log('パブリッシュ結果: ', publishResult);
  } catch (err) {
    console.error('エラー: ', err);
  }
}

main();
```

### TypeScript での型定義の利用

```ts
import px2agent from 'px2agent';
import { Px2ProjectOptions, PublishOptions } from 'px2agent';

// オプションを型付きで定義
const options: Px2ProjectOptions = {
  bin: '/path/to/php',
  ini: '/path/to/php.ini',
  extension_dir: '/path/to/ext/'
};

// プロジェクトを初期化
const px2proj = px2agent.createProject('./.px_execute.php', options);

// 型付きの公開オプション
const publishOptions: PublishOptions = {
  path_region: '/path/region/',
  paths_region: [
    '/path/region1/',
    '/path/region2/'
  ],
  paths_ignore: [
    '/path/region/ignored/1/',
    '/path/region/ignored/2/'
  ],
  keep_cache: true
};

// パブリッシュを実行
async function publishProject() {
  try {
    const result = await px2proj.publish(publishOptions);
    console.log('パブリッシュ結果: ', result);
  } catch (err) {
    console.error('エラー: ', err);
  }
}
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

### ビルド - Build

```bash
$ npm run build
```

### テスト - Test

```bash
$ npm test
```

### ドキュメント出力 - Documentation

```bash
$ npm run documentation
```



## 更新履歴 - Change log

### px2agent v3.0.0 (2025年5月5日)

- コールバックベースAPIからPromise/async-awaitベースAPIへの変更
- CommonJSモジュールとESモジュール両方のサポート
- TypeScriptへ移行、型定義ファイル(.d.ts)の提供

### px2agent v2.0.7 (2021年1月16日)

- `pj.query()` に、新しいオプション `method`、 `body`、 `bodyFile` を追加。

### px2agent v2.0.6 (2019年8月12日)

- `pj.px_command()` を追加。

### px2agent v2.0.5 (2017年3月14日)

- pickles2/px-fw-2.x@2.0.29 対応
- `pj.publish()` に `keep_cache` オプションを追加。
- `pj.publish()` に `paths_region` オプションを追加。
- `pj.get_path_homedir()` を `pj.get_realpath_homedir()` に改名。(古いメソッド名の実装は残されているが非推奨)
- `pj.get_path_docroot()` を `pj.get_realpath_docroot()` に改名。(古いメソッド名の実装は残されているが非推奨)

### px2agent v2.0.4 (2016年2月22日)

- pickles2/px-fw-2.x@2.0.17 対応
- `pj.publish()` に `paths_ignore` オプションを追加。

### px2agent v2.0.3 (2015年11月9日)

- pickles2/px-fw-2.x@2.0.15 対応
- アクター機能 `pj.get_role()`, `pj.get_actors()` を追加。

###  px2agent v2.0.2 (2015年9月15日)

- PHPが異常終了した場合の例外をキャッチし、 `false` を返すようになった。

### px2agent v2.0.1 (2015年9月10日)

- PHPのパスを指定した場合の引数 `-c` と `-d` に関する不具合を修正。
- オプション `extension_dir` を追加。

### px2agent v2.0.0 (2015年6月28日)

- Initial Release.


## ライセンス - License

MIT License


## 作者 - Author

- (C)Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
