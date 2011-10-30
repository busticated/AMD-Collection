define( function(){
    var funcs = [], //cache of functions to run each iteration
        loopDuration = 1000, //in ms
        isRunning = false,
        timerId = null,

        //reports looper state
        state = function(){ if( isRunning ){ return "running"; } return "stopped"; },
        //starts loop, adds funcion to funcs cache (opt) & set loopDuration (opt)
        start = function( func, spd ){
            if ( typeof func === 'function' ) {
                add( func );
            }

            if ( isRunning ) {
                return func;
            }

            isRunning = true;
            loopDuration = spd || loopDuration;
            setTimeout(
                function(){
                    _loop();
            }, loopDuration );

            return func;
        },

        //stops loop immediately
        stop = function(){ isRunning = false; clearTimeout( timerId ); },

        //gets & sets loopDuration, restarts loop after setting loopDuration
        rate = function( spd ){
            if ( typeof spd === 'undefined' ){
                return loopDuration;
            }

            loopDuration = spd;
            stop();
            start();
        },

        add = function( func ) { funcs.push( func ); return func; },
        remove = function( func ){
            for ( var i = -1, l = funcs.length; ++i < l; ) {
                if ( func === funcs[ i ] ){
                    console.log("remove func");
                    funcs.splice( i );
                }
            }
        },
        clear = function() { funcs = []; },
        _loop = function(){
            if ( ! isRunning ){
                return;
            }

            for ( var i = 0, l = funcs.length; i < l; i = i + 1 ) {
                if ( typeof funcs[ i ] === 'function' && funcs[ i ]() === false ){
                    funcs.splice( i );
                }
            }

            timerId = setTimeout( _loop, loopDuration );
        };

    // public api /////////////////////////////////////////////////////////////
    return {
        state : state,
        start : start,
        stop : stop,
        clear: clear,
        add : add,
        remove : remove,
        rate : rate
    }
});
