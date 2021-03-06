
import gulp             from 'gulp'
import gutil            from 'gulp-util'
import through2         from 'through2'
import { readFileSync } from 'fs'
import { resolve }      from 'path'

import jshint           from 'gulp-jshint'

import Checker          from 'jscs'
import * as configFile  from 'jscs/lib/cli-config'
import ConsoleReporter  from 'jscs/lib/reporters/console'

let paths = {
  scripts: [
    __dirname + '/../www/src/**/*.js',
    __dirname + '/../tasks/**/*.js',
  ]
}

gulp.task('lint', ['lint:jshint', 'lint:jscs'])

gulp.task('lint:jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
})

function collectFiles(src) {
  return new Promise(function(resolve, reject) {
    var files = []
    src.on('data',  item => files.push(item))
    src.on('end',     () => resolve(files))
    src.on('error'   , e => reject(error))
  })
}

gulp.task('lint:jscs', function() {
  let checker = new Checker({ esnext: true })
  checker.getConfiguration().registerDefaultRules()
  checker.configure(configFile.load())
  return collectFiles(gulp.src(paths.scripts))
    .then(files    => files.map(file => checker.checkFile(file.path)))
    .then(promises => Promise.all(promises))
    .then(function(result) {
      ConsoleReporter(result)
      if (result.some(fileErrors => !fileErrors.isEmpty())) {
        throw new gutil.PluginError('jscs', 'Coding style error!')
      }
    })
})
