/**
 * px2agent.js
 */
module.exports = function(php_self, path_homedir){
	this.php_self = php_self;
	this.path_homedir = path_homedir;
	// console.log(php_self, path_homedir);

	var phpjs = require('phpjs');

	/**
	 * バージョン番号を取得する
	 */
	this.get_version = function(cb){
		var data_memo = '';
		var rtn = spawn(
			'php',
			[this.php_self, '/?PX=api.get.version'],
			{
				success: function( data ){
					data_memo += data;
				} ,
				'complete': function( code ){
					var fin = JSON.parse(data_memo);
					cb(fin);
				}
			}
		);
		return rtn;
	}


	/**
	 * configデータを取得する
	 */
	this.get_config = function(cb){
		var data_memo = '';
		var rtn = spawn(
			'php',
			[this.php_self, '/?PX=api.get.config'],
			{
				success: function( data ){
					data_memo += data;
				} ,
				'complete': function( code ){
					var fin = JSON.parse(data_memo);
					cb(fin);
				}
			}
		);
		return rtn;
	}

	/**
	 * サイトマップデータを取得する
	 */
	this.get_sitemap = function(cb){
		var data_memo = '';
		var rtn = spawn(
			'php',
			[this.php_self, '/?PX=api.get.sitemap'],
			{
				success: function( data ){
					data_memo += data;
				} ,
				'complete': function( code ){
					var fin = JSON.parse(data_memo);
					cb(fin);
				}
			}
		);
		return rtn;
	}

	/**
	 * パブリッシュする
	 */
	this.publish = function(opt){
		opt = opt||{};
		opt.success = opt.success||function(){};
		opt.complete = opt.complete||function(){};
		if( !opt.path_region ){
			opt.path_region = '';
		}

		var data_memo = '';
		var rtn = spawn(
			'php',
			[this.php_self, '/?PX=publish.run&path_region='+phpjs.urlencode(opt.path_region)],
			{
				success: function( data ){
					opt.success(''+data);
					data_memo += data;
				} ,
				'complete': function( code ){
					opt.complete(data_memo);
				}
			}
		);
		return rtn;
	}

	/**
	 * キャッシュを削除する
	 */
	this.clearcache = function(opt){
		opt = opt||{};
		opt.success = opt.success||function(){};
		opt.complete = opt.complete||function(){};

		var data_memo = '';
		var rtn = spawn(
			'php',
			[this.php_self, '/?PX=clearcache'],
			{
				success: function( data ){
					opt.success(''+data);
					data_memo += data;
				} ,
				'complete': function( code ){
					opt.complete(data_memo);
				}
			}
		);
		return rtn;
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