// パッケージの読み込み
var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var plumber = require( 'gulp-plumber' );
var notify = require( 'gulp-notify' );
var sassGlob = require( 'gulp-sass-glob' );
var mmq = require( 'gulp-merge-media-queries' );
var browserSync = require( 'browser-sync' );

var imagemin = require( 'gulp-imagemin' );
var imageminPngquant = require( 'imagemin-pngquant' );
var imageminMozjpeg = require( 'imagemin-mozjpeg' );

var postcss = require( 'gulp-postcss' );
var autoprefixer = require( 'autoprefixer' );
var cssdeclsort = require( 'css-declaration-sorter' );

var ejs = require( 'gulp-ejs' );
var rename = require( 'gulp-rename' );
var replace = require( 'gulp-replace' );

var imageminOption = [
  imageminPngquant({ quality: '65-80' }),
  imageminMozjpeg({ quality: 85 }),

  // gif画像　圧縮
  imagemin.gifsicle({
    interlaced: false,
    optimizationLevel: 1,
    colors: 256
  }),
  imagemin.jpegtran(), // jpeg画像　圧縮
  imagemin.optipng(), // png画像　圧縮
  imagemin.svgo() // svg画像　圧縮
];

// sass-to-css 変換・出力処理
gulp.task( 'sass', function() {
  return gulp
    .src('./sass/**/*.scss')
    // watchをエラーで中断させないようにする
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    // import時に setting/** のような記述ができる
    .pipe(sassGlob())
    // css変換処理と、出力フォーマット形式の指定
    .pipe(sass({ outputStyle: 'expanded' }))
    // ベンダープレフィックスを自動で付与してくれる
    .pipe(postcss([autoprefixer()]))
    // プロパティをソートし直してくれる, ここではアルファベット順
    .pipe(postcss([cssdeclsort({ order: 'alphabetically' })]))
    // バラバラに記載されているメディアクエリを1つにまとめてくれる
    .pipe(mmq())
    .pipe(gulp.dest('./css'));
});

// ファイル変更のたびに、タスクを実行してくれる
gulp.task('watch', function() {
  // 変更を監視するファイルのパスと、ファイルへ実行するタスク（ここではsass, ejsの変換）

  // gulp v3
  // gulp.watch('./ejs/**/*.ejs', ['ejs']);
  // gulp.watch('./sass/**/*.scss', ['sass']);

  // gulp v4
  gulp.watch('./ejs/**/*.ejs', gulp.task('ejs'));
  gulp.watch('./sass/**/*.scss', gulp.task('sass'));
});

// ファイル保存時のブラウザ自動更新
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});

// gulp v3
// gulp.task('default', ['browser-sync', 'watch'], function() {
//   gulp.watch('./*.html', ['bs-reload']);
//   gulp.watch('./css/*.css', ['bs-reload']);
//   gulp.watch('./js/*.js', ['bs-reload']);
// });

// gulp v4
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch'), function() {
  gulp.watch('./*.html', ['bs-reload']);
  gulp.watch('./css/*.css', ['bs-reload']);
  gulp.watch('./js/*.js', ['bs-reload']);
}));

// imagemin 画像圧縮処理
gulp.task('imagemin', function() {
  return gulp
    .src('./img/**/*') // タスクの対象となるファイル
    // 実行する処理をpipeで繋いでいく
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./img')); // 出力先
});


gulp.task('ejs', function() {
  return gulp
    // ! は参照を除外するファイル
    .src(['ejs/**/*.ejs', '!ejs/**/_*.ejs'])
    //ejsを使う
    .pipe(ejs())
    // .pipe(ejs({}, {}, { ext: '.html' }))
    // 通常はejsで出力されるところを、htmlで出力
    .pipe(rename({ extname: '.html' }))
    // <!DOCTYPEまでの空白を全部取り除く
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1'))
    .pipe(gulp.dest('./'));
});
