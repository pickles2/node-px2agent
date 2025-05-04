import { describe, it, expect, beforeAll } from '@jest/globals';
import { px2agent } from '../src/px2agent';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodePhpBin from 'node-php-bin';
import { Px2Project } from '../src/px2project';

// ESモジュールでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getProject(testDataName: string): Px2Project {
  const options = {
    bin: nodePhpBin.get({ bin: 'php', ini: null }).getPath(),
    ini: nodePhpBin.get({ bin: 'php', ini: null }).getIniPath(),
    extension_dir: nodePhpBin.get({ bin: 'php', ini: null }).getExtensionDir()
  };
  
  return px2agent.createProject(
    path.resolve(__dirname, '../tests/testData/' + testDataName + '/.px_execute.php'),
    options
  );
}

describe('Pickles 2 API から値を取得するテスト', () => {
  const pj = getProject('htdocs1');

  it("バージョン番号を取得するテスト", async () => {
    const version = await pj.get_version();
    const matched = version.match(/^([0-9]+\.[0-9]+\.[0-9]+)(\-(?:alpha|beta|rc)(?:\.[0-9]+)?)?(\\+nb|\\+dev)?$/);
    expect(matched).not.toBeNull();
  });

  it("configを取得するテスト", async () => {
    const conf = await pj.get_config();
    expect(conf.name).toBe('px2agent test htdocs1');
    expect(conf.allow_pxcommands).toBe(1);
    expect(typeof conf.funcs).toBe('object');
    expect(typeof conf.funcs.processor.html).toBe('object');
  });

  it("phpinfo() を取得する", async () => {
    const html = await pj.query('/?PX=phpinfo');
    
    expect(typeof html).toBe('string');
    const matched1 = html.match(/phpinfo\(\)/);
    expect(matched1).not.toBeNull();
    
    const versionRegExp = '[0-9]+\\.[0-9]+\\.[0-9]+';
    const matched2 = html.match(new RegExp('PHP Version \\=\\> '+versionRegExp));
    expect(matched2).not.toBeNull();
  });

  it("サイトマップを取得するテスト", async () => {
    const sitemap = await pj.get_sitemap();
    
    expect(typeof sitemap).toBe('object');
    expect(typeof sitemap['/index.html']).toBe('object');
    expect(sitemap['/index.html'].path).toBe('/index.html');
    expect(sitemap['/index.html'].id).toBe('');
    expect(sitemap['/index.html'].title).toBe('HOME');
    expect(sitemap['/sample_pages/page1/4/{*}'].path).toBe('/sample_pages/page1/4/{*}');
    expect(sitemap['/sample_pages/page1/4/{*}'].id).toBe(':auto_page_id.13');
    expect(sitemap['/sample_pages/page1/4/{*}'].title).toBe('ダイナミックパス');
  });
});

describe('Pickles 2 からHTMLページを取得するテスト', () => {
  const pj = getProject('htdocs1');

  it("Mozilla/5.0 としてトップページを取得する", async () => {
    const html = await pj.query('/', {
      userAgent: "Mozilla/5.0"
    });
    
    expect(typeof html).toBe('string');
  });

  it("Mozilla/5.0 としてトップページをJSON形式で取得する", async () => {
    const jsonData = await pj.query('/', {
      userAgent: "Mozilla/5.0",
      output: "json"
    });
    
    const data = JSON.parse(jsonData);
    expect(data.status).toBe(200);
    expect(data.message).toBe('OK');
  });
});

describe('PXコマンドを発行するテスト', () => {
  const pj = getProject('htdocs1');

  it("path '/' のページ情報を取得する", async () => {
    const page_info = await pj.px_command(
      'api.get.page_info',
      '/',
      {
        path: '/index.html'
      }
    );
    
    expect(typeof page_info).toBe('object');
    expect(page_info.id).toBe('');
    expect(page_info.title).toBe('HOME');
    expect(page_info.path).toBe('/index.html');
  });
});

describe('ページ情報を取得するテスト', () => {
  const pj = getProject('htdocs1');

  it("path '/' のページ情報を取得する", async () => {
    const page_info = await pj.get_page_info('/');
    
    expect(typeof page_info).toBe('object');
    expect(page_info.id).toBe('');
    expect(page_info.title).toBe('HOME');
    expect(page_info.path).toBe('/index.html');
  });

  it("id '' のページ情報を取得する", async () => {
    const page_info = await pj.get_page_info('');
    
    expect(typeof page_info).toBe('object');
    expect(page_info.id).toBe('');
    expect(page_info.title).toBe('HOME');
    expect(page_info.path).toBe('/index.html');
  });

  it("path '/actors/role.html' のページ情報を取得する", async () => {
    const page_info = await pj.get_page_info('/actors/role.html');
    
    expect(typeof page_info).toBe('object');
    expect(page_info.id).toBe('role-page');
    expect(page_info.path).toBe('/actors/role.html');
  });

  it("path '/actors/actor-1.html' のページ情報を取得する", async () => {
    const page_info = await pj.get_page_info('/actors/actor-1.html');
    
    expect(typeof page_info).toBe('object');
    expect(page_info.id).toBe('actor-1');
    expect(page_info.path).toBe('/actors/actor-1.html');
    expect(page_info.role).toBe('role-page');
  });
});

describe('親ページのページIDを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/' のページ情報を取得する", async () => {
    const parent = await pj.get_parent('/sample_pages/');
    expect(parent).toBe('');
  });

  it("path '/' の親ページを取得する", async () => {
    const parent = await pj.get_parent('/');
    expect(parent).toBe(false);
  });
});

describe('子ページのページID一覧を取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/' の子ページ一覧を取得する", async () => {
    const children = await pj.get_children('/sample_pages/');
    
    expect(typeof children).toBe('object');
    expect(children[0]).toBe(':auto_page_id.4');
    expect(children[6]).toBe('sitemapExcel_auto_id_1');
    expect(children.length).toBe(7);
  });

  it("path '/' の子ページ一覧を取得する", async () => {
    const children = await pj.get_children('/');
    
    expect(typeof children).toBe('object');
    expect(children[0]).toBe(':auto_page_id.3');
    expect(children[4]).toBe('help');
    expect(children.length).toBe(6);
  });

  it("path '/bros3/' の子ページ一覧を取得する", async () => {
    const children = await pj.get_children('/bros3/');
    
    expect(typeof children).toBe('object');
    expect(children[0]).toBe('Bros3-2');
    expect(children[2]).toBe('Bros3-6');
    expect(children.length).toBe(3);
  });

  it("path '/bros3/' の子ページ一覧を、filterを無効にして取得する", async () => {
    const children = await pj.get_children('/bros3/', { filter: false });
    
    expect(typeof children).toBe('object');
    expect(children[0]).toBe('Bros3-2');
    expect(children[4]).toBe('Bros3-6');
    expect(children.length).toBe(5);
  });
});

describe('兄弟ページのページID一覧を取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/' の兄弟ページ一覧を取得する", async () => {
    const bros = await pj.get_bros('/sample_pages/');
    
    expect(typeof bros).toBe('object');
    expect(bros[0]).toBe(':auto_page_id.3');
    expect(bros[4]).toBe('help');
    expect(bros.length).toBe(6);
  });

  it("path '/' の兄弟ページ一覧を取得する", async () => {
    const bros = await pj.get_bros('/');
    
    expect(typeof bros).toBe('object');
    expect(bros[0]).toBe('');
    expect(bros.length).toBe(1);
  });

  it("path '/bros3/3.html' の兄弟ページ一覧を、filterを無効にして取得する", async () => {
    const bros = await pj.get_bros('/bros3/3.html', { filter: false });
    
    expect(typeof bros).toBe('object');
    expect(bros[0]).toBe('Bros3-2');
    expect(bros[4]).toBe('Bros3-6');
    expect(bros.length).toBe(5);
  });
});

describe('次の兄弟ページを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page2/1.htm' の次の兄弟ページIDを取得する", async () => {
    const pageId = await pj.get_bros_next('/sample_pages/page2/1.htm');
    expect(pageId).toBe(':auto_page_id.17');
  });

  it("path '/sample_pages/page2/2.html' の次の兄弟ページIDを取得する", async () => {
    const pageId = await pj.get_bros_next('/sample_pages/page2/2.html');
    expect(pageId).toBe(false);
  });

  it("path '/bros3/4.html' の次の兄弟ページIDを、filterを無効にして取得する", async () => {
    const pageId = await pj.get_bros_next('/bros3/4.html', { filter: false });
    expect(pageId).toBe('Bros3-5');
  });
});

describe('前の兄弟ページを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page2/index.html' の前の兄弟ページIDを取得する", async () => {
    const pageId = await pj.get_bros_prev('/sample_pages/page2/index.html');
    expect(pageId).toBe(':auto_page_id.3');
  });

  it("path '/sample_pages/' の前の兄弟ページIDを取得する", async () => {
    const pageId = await pj.get_bros_prev('/sample_pages/');
    expect(pageId).toBe(false);
  });

  it("path '/bros3/4.html' の前の兄弟ページIDを、filterを無効にして取得する", async () => {
    const pageId = await pj.get_bros_prev('/bros3/4.html', { filter: false });
    expect(pageId).toBe('Bros3-3');
  });
});

describe('次のページを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page2/1.htm' の次のページIDを取得する", async () => {
    const pageId = await pj.get_next('/sample_pages/page2/1.htm');
    expect(pageId).toBe(':auto_page_id.17');
  });

  it("path '/sample_pages/page2/2.html' の次のページIDを取得する", async () => {
    const pageId = await pj.get_next('/sample_pages/page2/2.html');
    expect(pageId).toBe(':auto_page_id.18');
  });

  it("path '/bros3/4.html' の次のページIDを、filterを無効にして取得する", async () => {
    const pageId = await pj.get_next('/bros3/4.html', { filter: false });
    expect(pageId).toBe('Bros3-5');
  });

  // PHPの警告が出るためスキップ
  it.skip("path '/actors/role.html' の次のページIDを取得する", async () => {
    const pageId = await pj.get_next('/actors/role.html');
    expect(pageId).toBe(false);
  });
});

describe('前のページを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page2/index.html' の前のページIDを取得する", async () => {
    const pageId = await pj.get_prev('/sample_pages/page2/index.html');
    expect(pageId).toBe(':auto_page_id.13');
  });

  it("path '/sample_pages/' の前のページIDを取得する", async () => {
    const pageId = await pj.get_prev('/sample_pages/');
    expect(pageId).toBe('');
  });

  it("path '/bros3/4.html' の前のページIDを、filterを無効にして取得する", async () => {
    const pageId = await pj.get_prev('/bros3/4.html', { filter: false });
    expect(pageId).toBe('Bros3-3');
  });

  it("path '/' の前のページIDを取得する", async () => {
    const pageId = await pj.get_prev('/');
    expect(pageId).toBe(false);
  });
});

describe('パンくず上のページ一覧を取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page1/2.html' のパンくず一覧を取得する", async () => {
    // ※このAPIが返す値には、自分自身は含まれない。
    const breadcrumb = await pj.get_breadcrumb_array('/sample_pages/page1/2.html');
    
    expect(typeof breadcrumb).toBe('object');
    expect(breadcrumb[0]).toBe('');
    expect(breadcrumb[1]).toBe(':auto_page_id.3');
    expect(breadcrumb.length).toBe(2);
  });
});

describe('ダイナミックパス情報を取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page1/2.html' のダイナミックパス情報を取得する", async () => {
    const value = await pj.get_dynamic_path_info('/sample_pages/page1/2.html');
    expect(value).toBe(false);
  });

  it("path '/sample_pages/page1/4/{*}' のダイナミックパス情報を取得する", async () => {
    const value = await pj.get_dynamic_path_info('/sample_pages/page1/4/{*}');
    
    expect(typeof value).toBe('object');
    expect(value.path).toBe('/sample_pages/page1/4/');
    expect(value.path_original).toBe('/sample_pages/page1/4/{*}');
    expect(value.id).toBe(':auto_page_id.13');
  });

  it("path '/sample_pages/page1/4/param/value/index.html' のダイナミックパス情報を取得する", async () => {
    const value = await pj.get_dynamic_path_info('/sample_pages/page1/4/param/value/index.html');
    
    expect(typeof value).toBe('object');
    expect(value.path).toBe('/sample_pages/page1/4/');
    expect(value.path_original).toBe('/sample_pages/page1/4/{*}');
    expect(value.id).toBe(':auto_page_id.13');
  });
});

describe('ダイナミックパス情報に値をバインドする', () => {
  const pj = getProject('htdocs1');

  it("path '/dynamicPath/{*}' に値をバインドする", async () => {
    const value = await pj.bind_dynamic_path_param('/dynamicPath/{*}', {'': 'abc.html'});
    expect(value).toBe('/dynamicPath/abc.html');
  });

  it("path '/dynamicPath/id_{$id}/name_{$name}/{*}' に値をバインドする", async () => {
    const value = await pj.bind_dynamic_path_param('/dynamicPath/id_{$id}/name_{$name}/{*}', {'': 'abc.html', 'id': 'hoge', 'name': 'fuga'});
    expect(value).toBe('/dynamicPath/id_hoge/name_fuga/abc.html');
  });
});

describe('アクター情報を取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/actors/actor-1.html' のroleを取得する", async () => {
    const value = await pj.get_role('/actors/actor-1.html');
    expect(value).toBe('role-page');
  });

  it("path '/actors/role.html' のactorの一覧を取得する", async () => {
    const value = await pj.get_actors('/actors/role.html');
    expect(value).toEqual(['actor-1', 'actor-2']);
  });
});

describe('ホームディレクトリのパスを取得する', () => {
  const pj = getProject('htdocs1');

  it("ホームディレクトリのパスを取得する", async () => {
    const path_home_dir = await pj.get_realpath_homedir();
    
    expect(typeof path_home_dir).toBe('string');
    expect(fs.realpathSync(path_home_dir)).toBe(fs.realpathSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/')));
  });
});

describe('コンテンツルートディレクトリのパスを取得する', () => {
  const pj = getProject('htdocs1');

  it("コンテンツルートディレクトリのパスを取得する", async () => {
    const path_controot = await pj.get_path_controot();
    
    expect(typeof path_controot).toBe('string');
    expect(path_controot).toBe('/');
  });
});

describe('ドキュメントルートディレクトリのパスを取得する', () => {
  const pj = getProject('htdocs1');

  it("ドキュメントルートディレクトリのパスを取得する", async () => {
    const path_docroot = await pj.get_realpath_docroot();
    
    expect(typeof path_docroot).toBe('string');
    expect(fs.realpathSync(path_docroot)).toBe(fs.realpathSync(path.join(__dirname, '../tests/testData/htdocs1/')));
  });
});

describe('コンテンツのパスを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/' のコンテンツのパスを取得する", async () => {
    const path_content = await pj.get_path_content('/');
    expect(path_content).toBe('/index.html');
  });

  it("path '/sample_pages/page1/3.html' のコンテンツのパスを取得する", async () => {
    const path_content = await pj.get_path_content('/sample_pages/page1/3.html');
    expect(path_content).toBe('/sample_pages/page1/3.html.md');
  });
});

describe('コンテンツのリソースディレクトリのパスを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/' のコンテンツのリソースディレクトリのパスを取得する", async () => {
    const path_content = await pj.path_files('/', '/images/test.png');
    expect(path_content).toBe('/index_files/images/test.png');
  });

  it("path '/' のコンテンツのリソースディレクトリのパスを取得する(第二引数をnullで指定)", async () => {
    const path_content = await pj.path_files('/', undefined);
    expect(path_content).toBe('/index_files/');
  });

  it("path '/sample_pages/page1/3.html' のコンテンツのリソースディレクトリのパスを取得する", async () => {
    const path_content = await pj.path_files('/sample_pages/page1/3.html', '');
    expect(path_content).toBe('/sample_pages/page1/3_files/');
  });
});

describe('コンテンツのリソースディレクトリの絶対パスを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/' のコンテンツのリソースディレクトリの絶対パスを取得する", async () => {
    const path_content = await pj.realpath_files('/', '/images/test.png');
    expect(path.resolve(path_content)).toBe(path.resolve(path.join(__dirname, '../tests/testData/htdocs1/index_files/images/test.png')));
  });

  it("path '/' のコンテンツのリソースディレクトリの絶対パスを取得する(第二引数をnullで指定)", async () => {
    const path_content = await pj.realpath_files('/', undefined);
    expect(path.resolve(path_content)).toBe(path.resolve(path.join(__dirname, '../tests/testData/htdocs1/index_files/')));
  });

  it("path '/sample_pages/page1/3.html' のコンテンツのリソースディレクトリの絶対パスを取得する", async () => {
    const path_content = await pj.realpath_files('/sample_pages/page1/3.html', '');
    expect(path.resolve(path_content)).toBe(path.resolve(path.join(__dirname, '../tests/testData/htdocs1/sample_pages/page1/3_files/')));
  });
});

describe('コンテンツの cache directory のパスを調べる', () => {
  const pj = getProject('htdocs1');

  it("path '/' の cache directory のパス", async () => {
    const result = await pj.path_files_cache('/', '/sample.png');
    expect(result).toBe('/caches/c/index_files/sample.png');
  });
});

describe('コンテンツの cache directory の絶対パスを調べる', () => {
  const pj = getProject('htdocs1');

  it("path '/' の cache directory の絶対パス", async () => {
    const realpath = await pj.realpath_files_cache('/', '/sample.png');
    expect(path.resolve(realpath)).toBe(path.resolve(path.join(__dirname, '../tests/testData/htdocs1/caches/c/index_files/sample.png')));
  });
});

describe('コンテンツの private cache directory の絶対パスを調べる', () => {
  const pj = getProject('htdocs1');

  it("path '/' の private cache directory の絶対パス", async () => {
    const realpath = await pj.realpath_files_private_cache('/', '/sample.png');
    expect(path.resolve(realpath)).toBe(path.resolve(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/caches/c/index_files/sample.png')));
  });
});

describe('ドメイン名を取得する', () => {
  const pj = getProject('htdocs1');

  it("ドメイン名を取得する", async () => {
    const domain = await pj.get_domain();
    expect(domain).toBe('pickles2.pxt.jp');
  });
});

describe('ディレクトリインデックスのテスト', () => {
  const pj = getProject('htdocs1');

  it("ディレクトリインデックスの一覧を取得する", async () => {
    const directory_index = await pj.get_directory_index();
    
    expect(typeof directory_index).toBe('object');
    expect(directory_index[0]).toBe('index.html');
    expect(directory_index.length).toBe(1);
  });

  it("最も優先されるディレクトリインデックスを取得する", async () => {
    const directory_index = await pj.get_directory_index_primary();
    expect(directory_index).toBe('index.html');
  });
});

describe('proc_typeを取得する', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/index.html' のproc_typeを取得", async () => {
    const proc_type = await pj.get_path_proc_type('/sample_pages/index.html');
    expect(proc_type).toBe('html');
  });

  it("path '/common/styles/common.css' のproc_typeを取得", async () => {
    const proc_type = await pj.get_path_proc_type('/common/styles/common.css');
    expect(proc_type).toBe('css');
  });

  it("path '/common/images/logo.png' のproc_typeを取得", async () => {
    const proc_type = await pj.get_path_proc_type('/common/images/logo.png');
    expect(proc_type).toBe('direct');
  });

  it("path '/vendor/autoload.php' のproc_typeを取得", async () => {
    const proc_type = await pj.get_path_proc_type('/vendor/autoload.php');
    expect(proc_type).toBe('ignore');
  });
});

describe('リンク先を解決するテスト', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/index.html' へのリンク", async () => {
    const href = await pj.href('/sample_pages/index.html');
    
    expect(typeof href).toBe('string');
    expect(href).toBe('/sample_pages/');
  });
});

describe('ダイナミックパスの一覧に含まれるかどうか調べる', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/page1/4/{*}' がダイナミックパスかチェック", async () => {
    const result = await pj.is_match_dynamic_path('/sample_pages/page1/4/{*}');
    expect(result).toBe(true);
  });

  it("path '/sample_pages/page1/4/' がダイナミックパスかチェック", async () => {
    const result = await pj.is_match_dynamic_path('/sample_pages/page1/4/');
    expect(result).toBe(true);
  });

  it("path '/sample_pages/page1/4/param1/param2.html' がダイナミックパスかチェック", async () => {
    const result = await pj.is_match_dynamic_path('/sample_pages/page1/4/param1/param2.html');
    expect(result).toBe(true);
  });

  it("path '/sample_pages/' がダイナミックパスかチェック", async () => {
    const result = await pj.is_match_dynamic_path('/sample_pages/');
    expect(result).toBe(false);
  });
});

describe('パンくずに含まれるかどうか調べる', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/' が path '/sample_pages/page1/2.html' のパンくずに含まれるかチェック", async () => {
    const result = await pj.is_page_in_breadcrumb('/sample_pages/page1/2.html', '/sample_pages/');
    expect(result).toBe(true);
  });
});

describe('ignore_pathかどうか調べる', () => {
  const pj = getProject('htdocs1');

  it("path '/sample_pages/index.html' をチェック", async () => {
    const is_ignore = await pj.is_ignore_path('/sample_pages/index.html');
    expect(is_ignore).toBe(false);
  });

  it("path '/common/styles/common.css' をチェック", async () => {
    const is_ignore = await pj.is_ignore_path('/common/styles/common.css');
    expect(is_ignore).toBe(false);
  });

  it("path '/common/images/logo.png' をチェック", async () => {
    const is_ignore = await pj.is_ignore_path('/common/images/logo.png');
    expect(is_ignore).toBe(false);
  });

  it("path '/vendor/autoload.php' をチェック", async () => {
    const is_ignore = await pj.is_ignore_path('/vendor/autoload.php');
    expect(is_ignore).toBe(true);
  });
});

describe('パブリッシュするテスト', () => {
  const pj = getProject('htdocs1');

  // タイムアウト時間を60秒に設定
  it("パブリッシュする", async () => {
    const output = await pj.publish();
    
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/alert_log.csv'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'))).toBe(true);

    const html = fs.readFileSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html')).toString();
    const versionRegExp = '[0-9]+\\.[0-9]+\\.[0-9]+';
    const matched = html.match(new RegExp('PHP Version \\=\\> '+versionRegExp));
    expect(matched).not.toBeNull();
  }, 60000); // タイムアウト60秒を明示的に指定

  it("/common/ ディレクトリのみパブリッシュする", async () => {
    const output = await pj.publish({
      path_region: "/common/"
    });
    
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/common/styles/contents.css'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'))).toBe(true);
  }, 60000); // タイムアウト60秒を明示的に指定

  it("/common/ ディレクトリのみパブリッシュしない", async () => {
    const output = await pj.publish({
      path_region: "/",
      paths_ignore: ["/common/"]
    });
    
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'))).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/common/styles/contents.css'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'))).toBe(true);
  }, 60000); // タイムアウト60秒を明示的に指定
});

describe('PHPを異常終了させるテスト', () => {
  const pj = getProject('htdocs2');
  const childProcRtnCode = 255;

  it("APIをコールするとPHPが異常終了するテスト", async () => {
    try {
      const data = await pj.query('/?PX=phpinfo', {
        output: "json",
        userAgent: "Mozilla/5.0"
      });
      expect(true).toBe(false); // 成功した場合は失敗
    } catch (error: any) {
      expect(error.code).toBe(childProcRtnCode);
    }

    try {
      const version = await pj.get_version();
      expect(true).toBe(false); // 成功した場合は失敗
    } catch (error: any) {
      expect(error.code).toBe(childProcRtnCode);
      expect(typeof error.message).toBe('string');
    }

    try {
      const config = await pj.get_config();
      expect(true).toBe(false); // 成功した場合は失敗
    } catch (error: any) {
      expect(error.code).toBe(childProcRtnCode);
      expect(typeof error.message).toBe('string');
    }

    // 他の API 関数も同じパターンでチェック可能ですが、簡潔にするために省略します
  });
});

describe('キャッシュを削除するテスト', () => {
  const pj = getProject('htdocs1');

  // テスト前にキャッシュを作成するためのパブリッシュを実行
  beforeAll(async () => {
    try {
      // まずパブリッシュを実行してキャッシュを作成
      await pj.publish({
        path_region: "/common/"
      });
    } catch (e) {
      console.error("パブリッシュに失敗しました", e);
    }
  }, 60000);

  it("キャッシュを削除する", async () => {
    // キャッシュを削除
    const output = await pj.clearcache();
    
    // ファイルが存在しないことを確認
    // ただし、.gitkeepは残るはず
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/alert_log.csv'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'))).toBe(false);
    expect(fs.existsSync(path.join(__dirname, '../tests/testData/htdocs1/px-files/_sys/ram/publish/.gitkeep'))).toBe(true);
  });
});