var assert = require('assert');
var px = require('../px2agent');
var path = require('path');
var fs = require('fs');
var phpjs = require('phpjs');

// suite('px2を実行してみるテスト', function() {
// 	it("通常のトップページの出力を得るテスト", function(done {

// 		var pj = new px('./htdocs1/.px_execute.php', './htdocs1/px-files/');
// 		pj.get_config(function(conf){
// 			console.log(conf);
// 			test('1 + 1は2になること', function() {
// 				assert.equal(1 + 1, 2);
// 			});
// 		});

// 	});
// });

describe('Pickles2 API から値を取得するテスト', function() {
	var pj = new px(
		path.resolve(__dirname,'./testData/htdocs1/.px_execute.php'),
		path.resolve(__dirname,'./testData/htdocs1/px-files/')
	);

	it("バージョン番号を取得するテスト", function(done) {
		pj.get_version(function(version){
			// version = '2.0.111-beta299-nb';
			// console.log(typeof(version));
			// console.log(version);
			var matched = version.match(new RegExp('^([0-9]+\\.[0-9]+\\.[0-9]+)(\\-(?:alpha|beta)[0-9]+)?(\\-nb)?$'));
			assert.notEqual(matched, null);
			done();
		});
	});

	it("configを取得するテスト", function(done) {
		pj.get_config(function(conf){
			// console.log(conf);
			assert.equal(conf.name, 'px2agent test htdocs1');
			assert.equal(conf.allow_pxcommands, 1);
			assert.equal(typeof(conf.funcs), typeof({}));
			assert.equal(typeof(conf.funcs.processor.html), typeof({}));
			done();
		});
	});

	it("サイトマップを取得するテスト", function(done) {
		pj.get_sitemap(function(sitemap){
			// console.log(sitemap);
			// assert.equal(conf.name, 'px2agent test htdocs1');
			// assert.equal(conf.allow_pxcommands, 1);
			// assert.equal(typeof(conf.funcs), typeof({}));
			// assert.equal(typeof(conf.funcs.processor.html), typeof({}));
			done();
		});
	});
});

describe('パブリッシュするテスト', function() {
	var pj = new px(
		path.resolve(__dirname,'./testData/htdocs1/.px_execute.php'),
		path.resolve(__dirname,'./testData/htdocs1/px-files/')
	);

	it("パブリッシュする", function(done) {
		this.timeout(20*1000);
		pj.publish({
			"success": function(output){
				// console.log(output);
			},
			"complete": function(output){
				// console.log(output);
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/alert_log.csv'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'), true );

				done();
			}
		});
	});

	it("/common/ ディレクトリのみパブリッシュする", function(done) {
		this.timeout(20*1000);
		pj.publish({
			"path_region": "/common/",
			"success": function(output){
				// console.log(output);
			},
			"complete": function(output){
				// console.log(output);
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/index.html'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/caches/'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/common/styles/contents.css'), true );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'), true );

				done();
			}
		});
	});
// path_region
});

describe('キャッシュを削除するテスト', function() {
	var pj = new px(
		path.resolve(__dirname,'./testData/htdocs1/.px_execute.php'),
		path.resolve(__dirname,'./testData/htdocs1/px-files/')
	);

	it("キャッシュを削除する", function(done) {
		pj.clearcache({
			"success": function(output){
				// console.log(output);
			},
			"complete":function(output){
				// console.log(output);
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/applock.txt'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/publish_log.csv'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/alert_log.csv'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/htdocs/'), false );
				assert.equal( fs.existsSync(__dirname+'/testData/htdocs1/px-files/_sys/ram/publish/.gitkeep'), true );
				done();
			}
		});
	});

});



// describe('テストする準備', function() {
// 	it("だけどまだ準備が整っていない。", function() {
// 		assert.equal(3, 3, 'string');
// 		expect(3).to.eql("Sample Test BDD");
// 	});
// });


