var fs = require('fs');
var extname = require('path').extname;
var uglify = require('uglify-js');


function jsFilter(fileName) {
	return extname(fileName) === '.js';
}


function plugin(builder, options) {
	// set up the hook for scripts

	builder.hook('before scripts', function (builder) {
		if (!builder.config.scripts) {
			return;
		}

		var files = builder.config.scripts.filter(jsFilter);

		files.forEach(function (file) {
			var path = builder.path(file);

			result = uglify.minify(path, options);

			if (result) {
				builder.removeFile('scripts', file);
				builder.addFile('scripts', file, result.code);
			}
		});
	});
}


plugin.withOptions = function (options) {
	return function (builder) {
		plugin(builder, options);
	};
};


module.exports = plugin;

