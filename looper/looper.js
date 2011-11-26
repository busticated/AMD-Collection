define( function(){
    var _funcs = [], //cache of functions to run each iteration
        _loopDuration = 1000, //in ms
        _isRunning = false,
        _timerId = null,

        //report looper state
        isRunning = function(){ return _isRunning; },

        state = function(){ if ( isRunning() ){ return "running"; } return "stopped"; },

        //start loop, add funcion to _funcs cache (opt) & set _loopDuration (opt)
        start = function( func, spd ){
            if ( typeof func === 'function' ) {
                add( func );
            }

            if ( isRunning() ) {
                return func;
            }

            _isRunning = true;
            _loopDuration = spd || _loopDuration;
            setTimeout( function(){
                _loop();
            }, _loopDuration );

            return func;
        },

        //stops loop immediately
        stop = function(){ _isRunning = false; clearTimeout( _timerId ); },

        //gets & sets _loopDuration, restarts loop after setting _loopDuration
        rate = function( spd ){
            if ( typeof spd === 'undefined' ){
                return _loopDuration;
            }

            _loopDuration = spd;
            stop();
            start();
        },

        add = function( func ) { _funcs.push( func ); return func; },

        remove = function( func ){
            for ( var i = -1, l = _funcs.length; ++i < l; ) {
                if ( func === _funcs[ i ] ){
                    console.log("remove func");
                    _funcs.splice( i );
                }
            }
        },

        clear = function() { _funcs = []; },

        //todo - set and pass in current time to 'func' callback
        _loop = function(){
            if ( ! isRunning() ){
                return;
            }

            for ( var i = 0, l = _funcs.length; i < l; i = i + 1 ) {
                if ( typeof _funcs[ i ] === 'function' && _funcs[ i ]() === false ){
                    _funcs.splice( i );
                }
            }

            _timerId = setTimeout( _loop, _loopDuration );
        };

    // public api /////////////////////////////////////////////////////////////
    return {
        isRunning : isRunning,
        state : state,
        start : start,
        stop : stop,
        clear: clear,
        add : add,
        remove : remove,
        rate : rate
    }
});
