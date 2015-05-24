/**
 * px2agent.js
 */
module.exports = new (function(){
	var _this = this;

	/**
	 * プロジェクトを作成する
	 */
	this.createProject = function(php_self){
		var px2project = require(__dirname+'/px2project');
		return new px2project(this, php_self);
	}

})();