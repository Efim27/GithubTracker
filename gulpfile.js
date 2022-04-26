const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const tildeImporter = require('node-sass-tilde-importer');
sass.compiler = require('node-sass');

const minifyCss = require('gulp-clean-css');
var tsify = require("tsify");
var source = require('vinyl-source-stream');
const browserify = require("browserify");

const config = {
    scss: {
        watch: './web/src/scss/**/*.scss',
        entry: './web/src/scss/main.scss',
        outDir: './web/css/',
    },
    ts: {
        watch: './web/src/ts/**/*.ts',
        entry: './web/src/ts/main.ts',
        outDir: './web/js/',
    }
}

const compileSass = () => {
    return src(config.scss.entry)
        .pipe(sass({
            importer: tildeImporter
        }).on('error', sass.logError))
        .pipe(minifyCss())
        .pipe(dest(config.scss.outDir));
}

const compileTs = () => {
    return browserify({
            basedir: '.',
            debug: true,
            entries: [config.ts.entry],
            cache: {},
            packageCache: {}
        })
        .plugin(tsify)
        .bundle()
        .pipe(source('main.min.js'))
        .pipe(dest(config.ts.outDir));
}

exports.default = () => {
    watch([config.scss.watch], compileSass);
    watch([config.ts.watch], compileTs);
}

exports.build = series(compileSass, compileTs);