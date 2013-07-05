var fs = require('fs');
var extname = require('path').extname;
var jsp = require('uglify-js').parser;
var pro = require('uglify-js').uglify;

var parseStrictSemicolons = false;
var mangle = true;
var squeeze = true;
var mangleOptions = undefined;
var squeezeOptions = undefined;
var gencodeOptions = undefined;


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

			var data = fs.readFileSync(path, 'utf8');

			var ast = jsp.parse(data, parseStrictSemicolons); // parse code and get the initial AST

			if (mangle) {
				ast = pro.ast_mangle(ast, mangleOptions); // get a new AST with mangled names
			}

			if (squeeze) {
				ast = pro.ast_squeeze(ast, squeezeOptions); // get an AST with compression optimizations
			}

			data = pro.gen_code(ast, gencodeOptions); // compressed code here

			if (data) {
				builder.removeFile('scripts', file);
				builder.addFile('scripts', file, data);
			}
		});
	});
};


exports.enableMangle = function (options) {
	mangle = true;
	mangleOptions = options;
};

exports.disableMangle = function () {
	mangle = false;
};

exports.enableSqueeze = function () {
	squeeze = true;
};

exports.disableSqueeze = function () {
	squeeze = false;
};

exports.parseStrictSemicolons = function (enabled) {
	parseStrictSemicolons = enabled;
};

exports.mangleOptions = function (options) {
	mangleOptions = options;
};

exports.squeezeOptions = function (options) {
	squeezeOptions = options;
};

exports.gencodeOptions = function (options) {
	gencodeOptions = options;
};


