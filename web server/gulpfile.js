var gulp = require('gulp');
var runSequence =  require('run-sequence');
var nodemon = require('nodemon');

gulp.task('default', function (callback) {
    runSequence(
        'nodemon',
        callback)
});

/**
 * It runs the node.js server using nodemon helper.
 * It watches for changes and re-run the server everytime it changes.
 */
gulp.task('nodemon', function () {
    var node_env = 'local-dev';
    
    nodemon({
        script: 'index.js',
        env: {
            'NODE_ENV': node_env
        },
        ignore: ['/test/*']
    })
});