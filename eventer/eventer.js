define( function(){
    //main event hash
    var eventCache = {},

    //add an event and callback
    on = function( eventName, callback ){
        if ( ! eventCache[ eventName ] ) {
            eventCache[ eventName ] = [];
        }

        eventCache[ eventName ].push( callback );

        //simple version - just return an event object
        //return [ eventName, callback ];

        //fancy version wrap 'off' in closure to enable
        //easier access, create 'do' method to trigger 
        //only this callback
        return {
            _handle : [ eventName, callback ],
            off : function(){
                off( [ eventName, callback ] );
            },
            do : function( data ){
                callback( data );
            }
        }
    },

    //remove callback and event if appropriate
    //todo: remove all handlers if argument is a string?
    off = function( eventHandle ){
        var eventName = eventHandle[ 0 ];

        if ( ! eventCache[ eventName ] ){
            return;
        }

        for ( var i = 0; i < eventCache[ eventName ].length; i = i + 1 ) {
            if ( eventCache[ eventName ][ i ] === eventHandle[ 1 ] ){
                eventCache[ eventName ].splice( i, 1 );
            }
        }
    },

    //fire event callbacks
    trigger = function( eventName, data ){
        if ( ! eventCache[ eventName ] ){
            return;
        }

        for ( var i = 0; i < eventCache[ eventName ].length; i = i + 1 ) {
            eventCache[ eventName ][ i ].call( this, data );
        }
    };

    // public api /////////////////////////////////////////////////////////////
    return {
        on: on,
        off: off,
        trigger: trigger
    }
});
