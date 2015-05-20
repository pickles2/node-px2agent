/**
 * px2agent.js
 */
module.exports = function(php_self, path_homedir){
	this.php_self = php_self;
	this.path_homedir = path_homedir;
	// console.log(php_self, path_homedir);

	var phpjs = require('phpjs');

	/**
	 * Pickles2 にクエリを投げて、結果を受け取る
	 */
	this.query = function(path, opt){
		opt = opt||{};
		opt.output = opt.output||opt.o||undefined;
		opt.userAgent = opt.userAgent||opt.u||undefined;
		opt.success = opt.success||function(){};
		opt.complete = opt.complete||function(){};

		var cloptions = [];
		cloptions.push( this.php_self );
		if( opt.output ){
			cloptions.push( '-o' );
			cloptions.push( opt.output );
		}
		if( opt.userAgent ){
			cloptions.push( '-u' );
			cloptions.push( opt.userAgent );
		}
		cloptions.push( path );

		var data_memo = '';
		var rtn = spawn(
			'php' ,
			cloptions ,
			{
				success: function( data ){
					opt.success(''+data);
					data_memo += data;
				} ,
				'complete': function( code ){
					opt.complete(data_memo, code);
				}
			}
		);
		return rtn;
	}

	/**
	 * バージョン番号を取得する
	 */
	this.get_version = function(cb){
		cb = cb||function(){};
		return this.query(
			'/?PX=api.get.version' ,
			{
				"complete": function(data, code){
					data = JSON.parse(data);
					cb( data );
				}
			}
		);
	}


	/**
	 * configデータを取得する
	 */
	this.get_config = function(cb){
		cb = cb||function(){};
		return this.query(
			'/?PX=api.get.config' ,
			{
				"complete": function(data, code){
					data = JSON.parse(data);
					cb( data );
				}
			}
		);
	}

	/**
	 * サイトマップデータを取得する
	 */
	this.get_sitemap = function(cb){
		cb = cb||function(){};
		return this.query(
			'/?PX=api.get.sitemap' ,
			{
				"complete": function(data, code){
					data = JSON.parse(data);
					cb( data );
				}
			}
		);
	}

	/**
	 * パブリッシュする
	 */
	this.publish = function(opt){
		opt = opt||{};
		if( !opt.path_region ){
			opt.path_region = '';
		}

		return this.query(
			'/?PX=publish.run&path_region='+phpjs.urlencode(opt.path_region) ,
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
	 * システムコマンドを実行する(spawn)
	 */
	function spawn(cmd, cliOpts, opts){
		opts = opts||{};
		if( opts.cd ){
			process.chdir( opts.cd );
		}
		// console.log( opts.cd );
		// console.log( process.cwd() );

		var proc = require('child_process').spawn(cmd, cliOpts);
		if( opts.success ){ proc.stdout.on('data', opts.success); }
		if( opts.error ){ proc.stderr.on('data', opts.error); }
		if( opts.complete ){ proc.on('close', opts.complete); }

		if( opts.cd ){
			process.chdir( _pathCurrentDir );
		}
		// console.log( process.cwd() );

		return proc;
	}

}