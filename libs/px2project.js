/**
 * px2project.js
 */
module.exports = function(px2agent, php_self, options){
	var _this = this;
	this.php_self = php_self;
	options = options||{};
	options.bin = options.bin||'php';
	options.ini = options.ini||null;
	options.extension_dir = options.extension_dir||null;
	this.options = options;
	// console.log(php_self);

	var childProcess = require('child_process');
	var phpjs = require('phpjs');

	/**
	 * Pickles2 にクエリを投げて、結果を受け取る
	 */
	this.query = function(path, opt){
		opt = opt||{};
		opt.output = opt.output||opt.o||undefined;
		opt.userAgent = opt.userAgent||opt.u||undefined;
		opt.success = opt.success||function(){};
		opt.error = opt.error||function(){};
		opt.complete = opt.complete||function(){};

		var cloptions = [];
		if( options.ini ){
			cloptions.push( '-c' );
			cloptions.push( options.ini );
		}
		if( options.extension_dir ){
			cloptions.push( '-d' );
			cloptions.push( 'extension_dir='+options.extension_dir );
		}
			// memo:
			// 	Windows上では、 -c と -d オプションは、this.php_self の前に指定しないと
			// 	PHPの設定に対して有効にならない。
			// 	かつ、this.php_self の後に指定しないと、PHPスクリプトがオプションとして取得できない。
			// 	(ので、パブリッシュのテストが通らなくなる)
			// 	よって、前後にそれぞれ1回ずつ、計2つ指定しなければいけない。

		cloptions.push( this.php_self );

		// 出力形式
		if( opt.output ){
			cloptions.push( '-o' );
			cloptions.push( opt.output );
		}

		// USER_AGENT
		if( opt.userAgent ){
			cloptions.push( '-u' );
			cloptions.push( opt.userAgent );
		}

		// PHPのパス
		cloptions.push( '--command-php' );
		cloptions.push( options.bin );
		if( options.ini ){
			cloptions.push( '-c' );
			cloptions.push( options.ini );
		}
		if( options.extension_dir ){
			cloptions.push( '-d' );
			cloptions.push( 'extension_dir='+options.extension_dir );
		}
			// memo:
			// 	Windows上では、 -c と -d オプションは、this.php_self の前に指定しないと
			// 	PHPの設定に対して有効にならない。
			// 	かつ、this.php_self の後に指定しないと、PHPスクリプトがオプションとして取得できない。
			// 	(ので、パブリッシュのテストが通らなくなる)
			// 	よって、前後にそれぞれ1回ずつ、計2つ指定しなければいけない。

		cloptions.push( path );

		var data_memo = '';
		var rtn = (function(cliParams, opts){
			cliParams = cliParams || [];
			opts = opts || {};
			var child = childProcess.spawn(
				options.bin,
				cliParams,
				opts
			);
			return child;
		})(
			cloptions,
			{}
		);
		if( opt.success ){ rtn.stdout.on('data', function( data ){
			opt.success(''+data);
			data_memo += data;
		}); }
		if( opt.error ){ rtn.stderr.on('data', function( data ){
			opt.error(''+data);
			data_memo += data;
		}); }
		if( opt.complete ){ rtn.on('close', function( code ){
			opt.complete(data_memo, code);
		}); }

		return rtn;
	}
	/**
	 * PX=api.*を投げる
	 */
	function apiGet(cmd, path, param, cb){
		path = path||'/';
		param = param||{};
		param = (function(param){
			var aryParam = [];
			for( var idx in param ){
				aryParam.push( phpjs.urlencode(idx)+'='+phpjs.urlencode(param[idx]) )
			}
			if(!aryParam.length){return '';}
			return '&'+aryParam.join('&');
		})(param);
		cb = cb||function(){};
		var errorMsg = null;
		return _this.query(
			path+'?PX='+cmd+param ,
			{
				"error": function(data){
					if( errorMsg === null ){ errorMsg = ''; }
					errorMsg += data;
				},
				"complete": function(data, code){
					// console.log(code);
					try {
						data = JSON.parse(data);
					} catch (e) {
						if( errorMsg === null ){ errorMsg = ''; }
						errorMsg += 'JSON Parse ERROR: "'+data+'";'
						data = false;
					}
					cb( data, code, errorMsg );
				}
			}
		);
	}

	/**
	 * バージョン番号を取得する
	 */
	this.get_version = function(cb){
		return apiGet('api.get.version', '/', {}, cb);
	}


	/**
	 * configデータを取得する
	 */
	this.get_config = function(cb){
		return apiGet('api.get.config', '/', {}, cb);
	}

	/**
	 * サイトマップデータを取得する
	 */
	this.get_sitemap = function(cb){
		return apiGet('api.get.sitemap', '/', {}, cb);
	}

	/**
	 * pathまたはidからページ情報を得る
	 */
	this.get_page_info = function(path, cb){
		return apiGet('api.get.page_info', '/', {
			"path":path
		}, cb);
	}

	/**
	 * 親ページのIDを取得する
	 */
	this.get_parent = function(path, cb){
		return apiGet('api.get.parent', path, {}, cb);
	}

	/**
	 * 子階層のページの一覧を取得する
	 */
	this.get_children = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.children', path, options, cb);
	}

	/**
	 * 兄弟ページの一覧を取得する
	 */
	this.get_bros = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.bros', path, options, cb);
	}

	/**
	 * 次の兄弟ページを取得する
	 */
	this.get_bros_next = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.bros_next', path, options, cb);
	}

	/**
	 * 前の兄弟ページを取得する
	 */
	this.get_bros_prev = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.bros_prev', path, options, cb);
	}

	/**
	 * 次のページを取得する
	 */
	this.get_next = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.next', path, options, cb);
	}

	/**
	 * 前のページを取得する
	 */
	this.get_prev = function(path, cb){
		var options = {};
		if(arguments.length >= 3){
			options = sitemap_children_params(arguments[1]);
			cb = arguments[2];
		}
		return apiGet('api.get.prev', path, options, cb);
	}

	/**
	 * パンくず配列を取得する
	 */
	this.get_breadcrumb_array = function(path, cb){
		return apiGet('api.get.breadcrumb_array', path, {}, cb);
	}

	/**
	 * ダイナミックパス情報を得る
	 */
	this.get_dynamic_path_info = function(path, cb){
		return apiGet('api.get.dynamic_path_info', '/', {
			"path":path
		}, cb);
	}

	/**
	 * ダイナミックパスに値をバインドする
	 */
	this.bind_dynamic_path_param = function(path, param, cb){
		return apiGet('api.get.bind_dynamic_path_param', '/', {
			"path":path,
			"param":JSON.stringify(param)
		}, cb);
	}

	/**
	 * role を取得する
	 */
	this.get_role = function(path, cb){
		return apiGet('api.get.role', path, {}, cb);
	}

	/**
	 * Actor のページID一覧を取得する
	 */
	this.get_actors = function(path, cb){
		return apiGet('api.get.actors', path, {}, cb);
	}

	/**
	 * get home directory path
	 */
	this.get_path_homedir = function(cb){
		return apiGet('api.get.path_homedir', '/', {}, cb);
	}

	/**
	 * コンテンツルートディレクトリのパス(=install path) を取得する
	 */
	this.get_path_controot = function(cb){
		return apiGet('api.get.path_controot', '/', {}, cb);
	}

	/**
	 * DOCUMENT_ROOT のパスを取得する
	 */
	this.get_path_docroot = function(cb){
		return apiGet('api.get.path_docroot', '/', {}, cb);
	}

	/**
	 * get content path
	 */
	this.get_path_content = function(path, cb){
		return apiGet('api.get.path_content', path, {}, cb);
	}

	/**
	 * ローカルリソースディレクトリのパスを得る
	 */
	this.path_files = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.path_files', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * ローカルリソースディレクトリのサーバー内部パスを得る
	 */
	this.realpath_files = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.realpath_files', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * ローカルリソースのキャッシュディレクトリのパスを得る
	 */
	this.path_files_cache = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.path_files_cache', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * ローカルリソースのキャッシュディレクトリのサーバー内部パスを得る
	 */
	this.realpath_files_cache = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.realpath_files_cache', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * コンテンツ別の非公開キャッシュディレクトリのサーバー内部パスを得る
	 */
	this.realpath_files_private_cache = function(path, path_resource, cb){
		path_resource = path_resource||'';
		return apiGet('api.get.realpath_files_private_cache', path, {
			"path_resource":path_resource
		}, cb);
	}

	/**
	 * domain を取得する
	 */
	this.get_domain = function(cb){
		return apiGet('api.get.domain', '/', {}, cb);
	}

	/**
	 * directory_index(省略できるファイル名) の一覧を得る
	 */
	this.get_directory_index = function(cb){
		return apiGet('api.get.directory_index', '/', {}, cb);
	}

	/**
	 * 最も優先されるインデックスファイル名を得る
	 */
	this.get_directory_index_primary = function(cb){
		return apiGet('api.get.directory_index_primary', '/', {}, cb);
	}

	/**
	 * ファイルの処理方法を調べる
	 */
	this.get_path_proc_type = function(path, cb){
		return apiGet('api.get.path_proc_type', path, {}, cb);
	}

	/**
	 * リンク先のパスを生成する
	 */
	this.href = function(path_linkto, cb){
		return apiGet('api.get.href', '/', {
			"linkto":path_linkto
		}, cb);
	}

	/**
	 * パスがダイナミックパスにマッチするか調べる
	 */
	this.is_match_dynamic_path = function(path, cb){
		return apiGet('api.is.match_dynamic_path', '/', {
			"path":path
		}, cb);
	}

	/**
	 * ページが、パンくず内に存在しているか調べる
	 */
	this.is_page_in_breadcrumb = function(path, path_in, cb){
		return apiGet('api.is.page_in_breadcrumb', path, {
			"path":path_in
		}, cb);
	}

	/**
	 * 除外ファイルか調べる
	 */
	this.is_ignore_path = function(path, cb){
		return apiGet('api.is.ignore_path', '/', {
			"path":path
		}, cb);
	}


	/**
	 * パブリッシュする
	 */
	this.publish = function(opt){
		opt = opt||{};
		if( !opt.path_region ){
			opt.path_region = '';
		}
		var str_paths_ignore = '';
		if( typeof(opt.paths_ignore) == typeof('') ){
			opt.paths_ignore = [opt.paths_ignore];
		}
		if( typeof(opt.paths_ignore) == typeof([]) ){
			for( var i in opt.paths_ignore ){
				str_paths_ignore += '&paths_ignore[]='+phpjs.urlencode(opt.paths_ignore[i]);
			}
		}

		return this.query(
			'/?PX=publish.run&path_region='+phpjs.urlencode(opt.path_region)+str_paths_ignore ,
			opt
		);
	}

	/**
	 * キャッシュを削除する
	 */
	this.clearcache = function(opt){
		opt = opt||{};

		return this.query(
			'/?PX=clearcache' ,
			opt
		);
	}


	/**
	 * get_children() へ渡されるオプションを調整する
	 * この形式のオプションは、get_bros(), get_bros_next(), get_bros_prev(), get_next(), get_prev() でも共通です。
	 */
	function sitemap_children_params(options){
		function boolize(val){
			if(typeof(val) === typeof(null) || val === undefined){
				val = null;
			}else if(typeof(val) === typeof('string')){
				switch( val ){
					case 'true':
					case '1':
						val = 'true'; break;
					case 'false':
					case '0':
						val = 'false'; break;
				}
			}else{
				val = (val?'true':'false')
			}
			return val;
		}
		options = options||{};
		var rtn = {};
		rtn['filter'] = boolize(options['filter']);
		return rtn;
	}


}
