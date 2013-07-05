var fs = require('fs');
var extname = require('path').extname;
var uglify = require('uglify-js');


function jsFilter(fileName) {
	return extname(fileName) === '.js';
}


exports = module.exports = function (builder) {
	// set up the hook for scripts

	builder.hook('before scripts', function (builder) {
		if (!builder.config.scripts) {
			return;
		}

		var files = builder.config.scripts.filter(jsFilter);

		files.forEach(function (file) {
			var path = builder.path(file);

			result = uglify.minify(path);

			if (result) {
				builder.removeFile('scripts', file);
				builder.addFile('scripts', file, result.code);
			}
		});
	});
};

