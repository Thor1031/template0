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

  imagemin.gifsicle({ // gif　圧縮
    interlaced: false,
    optimizationLevel: 1,
    colors: 256
  }),
  imagemin.jpegtran(), // jpeg　圧縮
  imagemin.optipng(), // png　圧縮
  imagemin.svgo() // svg　圧縮
];

// sassコンパイルタスク
gulp.task( 'sass', function() {
  return gulp
    .src('./sass/**/*.scss') // watchをエラーで中断させないようにする
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })) // import時に setting/** のような記述ができる
    .pipe(sassGlob()) // css変換処理と、出力フォーマット形式の指定
    .pipe(sass({ outputStyle: 'expanded' })) // ベンダープレフィックスを自動で付与してくれる
    .pipe(postcss([autoprefixer()])) // プロパティをソートし直してくれる, ここではアルファベット順
    .pipe(postcss([cssdeclsort({ order: 'alphabetically' })])) // バラバラに記載されているメディアクエリを1つにまとめてくれる
    .pipe(mmq())
    .pipe(gulp.dest('./css'));
});

// Browser sync
// サーバーの立ち上げ
gulp.task('build-server', function (done) {
  browserSync.init({
    server: {
      baseDir: "./",
      index: 'index.html'
    }
  });
  done();
});

//　監視ファイルを指定
gulp.task('watch-files', function (done) {
  // gulp.watch('./ejs/**/*.ejs', gulp.task('ejs'));
  gulp.watch('./sass/**/*.scss', gulp.task('sass'));
  gulp.watch("./*.html", gulp.task('browser-reload'));
  gulp.watch("./css/*.css", gulp.task('browser-reload'));
  gulp.watch("./js/*.js", gulp.task('browser-reload'));
  done();
});

// ブラウザのリロード
gulp.task('browser-reload', function (done) {
  browserSync.reload();
  done();
  console.log('Browser reload completed');
});

// タスクの実行
gulp.task('default', gulp.series('build-server', 'watch-files', function (done) {
  done();
}));


// imagemin 画像圧縮処理
gulp.task('imagemin', function() {
  return gulp
    .src('./img/**/*') // タスクの対象となるファイル
    .pipe(imagemin(imageminOption))
    .pipe(gulp.dest('./img')); // 出力先
});


gulp.task('ejs', function() {
  return gulp
    .src(['ejs/**/*.ejs', '!ejs/**/_*.ejs']) // ! は参照を除外するファイル
    .pipe(ejs()) //ejsを使う
    // .pipe(ejs({}, {}, { ext: '.html' }))
    .pipe(rename({ extname: '.html' })) // 通常はejsで出力されるところを、htmlで出力
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, '$1')) // <!DOCTYPEまでの空白を全部取り除く
    .pipe(gulp.dest('./'));
});
