define( function(){
    var funcs = [], //cache of functions to run each iteration
        loopDuration = 1000, //in ms
        isRunning = false,
        start = function( func, spd ){ add( func ); isRunning = true; loopDuration = spd || loopDuration; setTimeout( function(){ _loop(); }, loopDuration ); },
        stop = function(){ isRunning = false; },
        rate = function( spd ){ if ( typeof spd === 'undefined' ){ return loopDuration; } loopDuration = spd; },
        add = function( func ) { funcs.push( func ); },
        clear = function() { funcs = []; },
        _loop = function(){
            if ( ! isRunning ){
                return false;
            }

            for ( var i = 0, length = funcs.length; i < length; i = i + 1 ) {
                if ( typeof funcs[ i ] === 'function' && funcs[ i ]() === false ){
                    funcs.splice( i );
                }
            }

            setTimeout( _loop, loopDuration );
        };

    // public api /////////////////////////////////////////////////////////////
    return {
        start : start,
        stop : stop,
        clear: clear,
        add : add,
        rate : rate
    }
});
