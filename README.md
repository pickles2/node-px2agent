px2agent [![Build Status - master](https://secure.travis-ci.org/tomk79/px2agent.png?branch=master)](https://travis-ci.org/tomk79/px2agent)
==============

[![NPM](https://nodei.co/npm/px2agent.png)](https://nodei.co/npm/px2agent/)

## Usage

```
var px2proj = require('px2agent').createProject('./px_execute.php');


/**
 * Pickles2 にクエリを投げて、結果を受け取る
 */
px2proj.query('/?PX=phpinfo', {
	"output": "json",
	"userAgent": "Mozilla/5.0",
	"success": function(data){
		console.log(data);
	},
	"complete": function(data_memo, code){
		console.log(data_memo, code);
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
 * PX=api.get.parent
 */
px2proj.get_parent('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.children
 */
px2proj.get_children('/', function(value){
	console.log(value);
});

/**
 * PX=api.get.bros
 */
px2proj.get_bros('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.bros_next
 */
px2proj.get_bros_next('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.bros_prev
 */
px2proj.get_bros_prev('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.next
 */
px2proj.get_next('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.prev
 */
px2proj.get_prev('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.breadcrumb_array
 */
px2proj.get_breadcrumb_array('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.dynamic_path_info&path={$path}
 */
px2proj.get_dynamic_path_info('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.path_homedir
 */
px2proj.get_path_homedir(function(value){
	console.log(value);
})

/**
 * 	<dt>PX=api.get.path_controot</dt>
 */
px2proj.get_path_controot(function(value){
	console.log(value);
});

/**
 * PX=api.get.path_docroot
 */
px2proj.get_path_docroot(function(value){
	console.log(value);
});

/**
 * 	<dt>PX=api.get.path_content</dt>
 */
px2proj.get_path_content('/', function(value){
	console.log(value);
});

/**
 * PX=api.get.path_files&path_content={$path}
 */
px2proj.path_files('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * PX=api.get.realpath_files&path_content={$path}
 */
px2proj.realpath_files('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * PX=api.get.path_files_cache&path_content={$path}
 */
px2proj.path_files_cache('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * PX=api.get.realpath_files_cache&path_content={$path}
 */
px2proj.realpath_files_cache('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * PX=api.get.realpath_files_private_cache&path_content={$path}
 */
px2proj.realpath_files_private_cache('/', '/images/sample.png', function(value){
	console.log(value);
});

/**
 * PX=api.get.domain
 */
px2proj.get_domain(function(value){
	console.log(value);
});

/**
 * PX=api.get.directory_index
 */
px2proj.get_directory_index(function(value){
	console.log(value);
});

/**
 * PX=api.get.directory_index_primary
 */
px2proj.get_directory_index_primary(function(value){
	console.log(value);
});

/**
 * PX=api.get.path_proc_type
 */
px2proj.get_path_proc_type('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.get.href&linkto={$path_linkto}
 */
px2proj.href('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.is.match_dynamic_path&path={$path}
 */
px2proj.is_match_dynamic_path('/sample_pages/', function(value){
	console.log(value);
});

/**
 * PX=api.is.page_in_breadcrumb&path={$path}
 */
px2proj.is_page_in_breadcrumb('/sample_pages/', '/', function(value){
	console.log(value);
});

/**
 * PX=api.is.ignore_path&path={$path}
 */
px2proj.is_ignore_path('/sample_pages/', function(value){
	console.log(value);
});


/**
 * パブリッシュする
 */
px2proj.publish({
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

### Specifying path to the PHP binary

```
var px2proj = require('px2agent').createProject(
  './px_execute.php',
  {'bin': '/path/to/php'}
);
```


## for developers

### Setting up development environment

```
$ cd {$project_root}
$ composer install
$ npm install
```

### Test

```
$ npm test
```
