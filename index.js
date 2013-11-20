var fs = require('fs');
var extname = require('path').extname;
var uglify = require('uglify-js');


function deepCopy(obj) {
	var out;

	if (Array.isArray(obj)) {
		var len = obj.length;

		out = new Array(len);

		for (var i = 0; i < len; i++) {
			out[i] = deepCopy(obj[i]);
		}
	} else if (obj && typeof obj === 'object') {
		out = {};

		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				out[key] = deepCopy(obj[key]);
			}
		}
	} else {
		out = obj;
	}

	return out;
}

function jsFilter(fileName) {
	return extname(fileName) === '.js';
}

function getRootBuilder(builder) {
	while (builder.parent) {
		builder = builder.parent;
	}

	return builder;
}


function plugin(builder, options) {
	// set up the hook for scripts

	options = deepCopy(options) || {};

	builder.hook('before scripts', function (builder) {
		if (!builder.config.scripts) {
			return;
		}

		var files = builder.config.scripts.filter(jsFilter);
		var root;

		function addSourceMap(longName, map) {
			root = root || getRootBuilder(builder);
			root.sourcemaps = root.sourcemaps || {};
			root.sourcemaps[longName] = map;
		}

		files.forEach(function (file) {
			var path = builder.path(file);
			var longName = builder.basename + '/' + file;

			if (options.outSourceMap) {
				options.outSourceMap = longName;
			}

			result = uglify.minify(path, options);

			if (!result || !result.code) {
				return;
			}

			builder.removeFile('scripts', file);
			builder.addFile('scripts', file, result.code);

			if (result.map) {
				addSourceMap(longName, result.map);
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

