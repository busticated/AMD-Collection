module.exports = function( grunt ) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        watch: {},
        qunit: {
            index: [ 'http://dev.local.com:3000/tests/index.html' ]
        },
        server: {
            port: 3000,
            base: '.'
        }
    });

    // Plugins
    grunt.loadNpmTasks( 'grunt-volo' );

    // Tasks
    grunt.registerTask( 'default', 'server watch' );
    grunt.registerTask( 'test', 'server qunit' );
};
