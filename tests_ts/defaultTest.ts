import { describe, it, expect, beforeAll } from '@jest/globals';
import { px2agent } from '../src/px2agent';
import path from 'path';
import fs from 'fs';
import nodePhpBin from 'node-php-bin';
import { Px2Project } from '../src/px2project';

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
});

// これはテスト例の一部です。実際には他にもたくさんのテストケースがあります。