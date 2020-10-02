# gulp-jst-extend2 - An Amazing Project
Using lodash tempate to make the template modular management, each module is synthesized into a CMD or AMD JS, convenient for calling and management. This plug-in solves the problem of picture CDN cache, as long as the modified template, the path behind the picture will automatically compile and add version number

# gulp-jst-extend

> gulp plugin to compile underscore / lodash templates to js file(s).

Inspired by module [gulp-jst-concat](https://github.com/mozuo/gulp-jst-extend2.git) but this plugin add cmd/amd support, and will add more features soon.

## Install
Install using [npm](https://github.com/mozuo/gulp-jst-extend2.git).

    $ npm install gulp-jst-extend2


## Usage

``` js
gulp.task('jst', function(project, type, year) {
    if (!year) {
        year = new Date().getFullYear();
    }

    var jst = require('gulp-jst-extend');
    console.log("templatePath:" + templatePath)
    return gulp.src([type + '/project/' + year + '/' + project + '/source/tpl/**/*.html'])
        .pipe(changed(type + '/project/' + year + '/' + project + '/source/tpl/' + templatePath + '/', { extension: '.js' }))
        .pipe(jst('index.js', { renameKeys: ['^.*\/tpl\/.*\/(.*).html$', '$1'] }))
        .pipe(gulp.dest(type + '/project/' + year + '/' + project + '/source/js/tpl/' + templatePath + "/"))
        .on("end", function() {
            gulp.src(type + '/project/' + year + '/' + project + '/source/js/tpl/' + templatePath + '/*.js')
                .pipe(uglify({
                    output: {
                        ascii_only: true
                    }
                }))
                .pipe(gulp.dest(type + '/project/' + year + '/' + project + '/js/tpl/' + templatePath + "/"))
        })
});
```

More details please goto [gulp-jst-concat](https://github.com/tambourinecoder/gulp-jst-concat).

## License
MIT

