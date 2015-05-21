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


describe('Pickles2 からHTMLページを取得するテスト', function() {
	var pj = new px(
		path.resolve(__dirname,'./testData/htdocs1/.px_execute.php'),
		path.resolve(__dirname,'./testData/htdocs1/px-files/')
	);

	it("Mozilla/5.0 としてトップページを取得する", function(done) {
		pj.query(
			'/' ,
			{
				"userAgent": "Mozilla/5.0",
				"complete": function(html, code){
					// console.log(html);
					// var matched = version.match(new RegExp('^([0-9]+\\.[0-9]+\\.[0-9]+)(\\-(?:alpha|beta)[0-9]+)?(\\-nb)?$'));
					assert.equal(typeof(html), typeof(''));
					done();
				}
			}
		);
	});

	it("Mozilla/5.0 としてトップページをJSON形式で取得する", function(done) {
		pj.query(
			'/' ,
			{
				"userAgent": "Mozilla/5.0",
				"output": "json" ,
				"complete": function(data, code){
					data = JSON.parse(data);
					// console.log(data);
					assert.equal(data.status, 200);
					assert.equal(data.message, 'OK');
					done();
				}
			}
		);
	});

});



describe('ページ情報を取得するテスト', function() {
	var pj = new px(
		path.resolve(__dirname,'./testData/htdocs1/.px_execute.php'),
		path.resolve(__dirname,'./testData/htdocs1/px-files/')
	);

	it("path / のページ情報を取得する。", function(done) {
		pj.get_page_info( '/', function( page_info ){
			// console.log(page_info);
			assert.equal( typeof(page_info), typeof({}) );
			done();
		} );
	});

});




	// /**
	//  * PX=api.get.parent
	//  */
	// this.get_parent = function(path, cb){
	// 	return apiGet('api.get.parent', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.children
	//  */
	// this.get_children = function(path, cb){
	// 	return apiGet('api.get.children', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.bros
	//  */
	// this.get_bros = function(path, cb){
	// 	return apiGet('api.get.bros', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.bros_next
	//  */
	// this.get_bros_next = function(path, cb){
	// 	return apiGet('api.get.bros_next', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.bros_prev
	//  */
	// this.get_bros_prev = function(path, cb){
	// 	return apiGet('api.get.bros_prev', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.next
	//  */
	// this.get_next = function(path, cb){
	// 	return apiGet('api.get.next', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.prev
	//  */
	// this.get_prev = function(path, cb){
	// 	return apiGet('api.get.prev', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.breadcrumb_array
	//  */
	// this.get_breadcrumb_array = function(path, cb){
	// 	return apiGet('api.get.breadcrumb_array', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.dynamic_path_info&path={$path}
	//  */
	// this.get_dynamic_path_info = function(path, cb){
	// 	return apiGet('api.get.dynamic_path_info', '/', {
	// 		"path":path
	// 	}, cb);
	// }

	// /**
	//  * PX=api.get.path_homedir
	//  */
	// this.get_path_homedir = function(cb){
	// 	return apiGet('api.get.path_homedir', '/', {}, cb);
	// }

	// /**
	//  * 	<dt>PX=api.get.path_controot</dt>
	//  */
	// this.get_path_controot = function(cb){
	// 	return apiGet('api.get.path_controot', '/', {}, cb);
	// }

	// /**
	//  * PX=api.get.path_docroot
	//  */
	// this.get_path_docroot = function(cb){
	// 	return apiGet('api.get.path_docroot', '/', {}, cb);
	// }

	// /**
	//  * 	<dt>PX=api.get.path_content</dt>
	//  */
	// this.get_path_content = function(cb){
	// 	return apiGet('api.get.path_content', '/', {}, cb);
	// }

	// /**
	//  * PX=api.get.path_files&path_content={$path}
	//  */
	// this.path_files = function(path, path_resource, cb){
	// 	path_resource = path_resource||'';
	// 	return apiGet('api.get.path_content', path, {
	// 		"path_resource":path_resource
	// 	}, cb);
	// }

	// /**
	//  * PX=api.get.realpath_files&path_content={$path}
	//  */
	// this.realpath_files = function(path, path_resource, cb){
	// 	path_resource = path_resource||'';
	// 	return apiGet('api.get.realpath_files', path, {
	// 		"path_resource":path_resource
	// 	}, cb);
	// }

	// /**
	//  * PX=api.get.path_files_cache&path_content={$path}
	//  */
	// this.path_files_cache = function(path, path_resource, cb){
	// 	path_resource = path_resource||'';
	// 	return apiGet('api.get.path_files_cache', path, {
	// 		"path_resource":path_resource
	// 	}, cb);
	// }

	// /**
	//  * PX=api.get.realpath_files_cache&path_content={$path}
	//  */
	// this.realpath_files_cache = function(path, path_resource, cb){
	// 	path_resource = path_resource||'';
	// 	return apiGet('api.get.realpath_files_cache', path, {
	// 		"path_resource":path_resource
	// 	}, cb);
	// }

	// /**
	//  * PX=api.get.realpath_files_private_cache&path_content={$path}
	//  */
	// this.realpath_files_private_cache = function(path, path_resource, cb){
	// 	path_resource = path_resource||'';
	// 	return apiGet('api.get.realpath_files_private_cache', path, {
	// 		"path_resource":path_resource
	// 	}, cb);
	// }

	// /**
	//  * PX=api.get.domain
	//  */
	// this.get_domain = function(cb){
	// 	return apiGet('api.get.domain', '/', {}, cb);
	// }

	// /**
	//  * PX=api.get.directory_index
	//  */
	// this.get_directory_index = function(cb){
	// 	return apiGet('api.get.directory_index', '/', {}, cb);
	// }

	// /**
	//  * PX=api.get.directory_index_primary
	//  */
	// this.get_directory_index_primary = function(cb){
	// 	return apiGet('api.get.directory_index_primary', '/', {}, cb);
	// }

	// /**
	//  * PX=api.get.path_proc_type
	//  */
	// this.get_path_proc_type = function(path, cb){
	// 	return apiGet('api.get.path_proc_type', path, {}, cb);
	// }

	// /**
	//  * PX=api.get.href&linkto={$path_linkto}
	//  */
	// this.href = function(path, path_linkto, cb){
	// 	return apiGet('api.get.href', path, {
	// 		"linkto":path_linkto
	// 	}, cb);
	// }

	// /**
	//  * PX=api.is.match_dynamic_path&path={$path}
	//  */
	// this.is_match_dynamic_path = function(path, cb){
	// 	return apiGet('api.is.match_dynamic_path', '/', {
	// 		"path":path
	// 	}, cb);
	// }

	// /**
	//  * PX=api.is.page_in_breadcrumb&path={$path}
	//  */
	// this.is_page_in_breadcrumb = function(path, path_in, cb){
	// 	return apiGet('api.is.page_in_breadcrumb', path, {
	// 		"path":path_in
	// 	}, cb);
	// }

	// /**
	//  * PX=api.is.ignore_path&path={$path}
	//  */
	// this.is_ignore_path = function(path, cb){
	// 	return apiGet('api.is.ignore_path', '/', {
	// 		"path":path
	// 	}, cb);
	// }




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


