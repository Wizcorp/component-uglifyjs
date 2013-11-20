# component-uglifyjs

UglifyJS plugin for component-builder

## Installing

```bash
npm install component-uglifyjs
```

## Usage

To enable UglifyJS minification of your scripts, run the following code:

```javascript
var Builder = require('component-builder');
var uglify = require('component-uglifyjs');
var fs = require('fs');

var builder = new Builder(__dirname);

builder.use(uglify);

// or if you want to pass options to uglify:
builder.use(uglify.withOptions({ mangle: false, outSourceMap: true }));

builder.build(function (error, build) {
    if (error) {
		throw error;
	}

    fs.writeFileSync('build/build.js', build.require + build.js);

    if (build.css) {
		fs.writeFileSync('build/build.css', build.css);
	}

	// NOTE: sourcemaps are stored on the builder, not the build!

	if (builder.sourcemaps) {
	    fs.writeFileSync('build/sourcemaps.json', JSON.stringify(builder.sourcemaps));
	}
});
```

Or from the command line:

```bash
component build --use component-uglifyjs
```

## License

MIT

