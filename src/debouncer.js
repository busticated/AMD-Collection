define(function(){
    'use strict';

    var d = function( fn, delay ){
        var timer;

        return function(){
            var ctx = this,
                args = arguments,
                delayedFn = function(){
                    fn.apply( ctx, args );
                };

            timer && clearTimeout( timer );
            timer = setTimeout( delayedFn, delay || 100 );
        };
    };

    return d;
});
