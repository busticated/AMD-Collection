module.exports = function( grunt ) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        watch: {},
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://dev.local.com:3000/tests/index.html'
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname: null, // should be '*' once this drops: https://github.com/gruntjs/grunt-contrib-connect/issues/21
                    port: 3000,
                    base: '.'
                }
            }
        }
    });

    // Plugins
    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-qunit' );
    grunt.loadNpmTasks( 'grunt-volo' );

    // Tasks
    grunt.registerTask( 'default', [ 'connect', 'watch' ] );
    grunt.registerTask( 'test', [ 'connect', 'qunit' ] );
};
