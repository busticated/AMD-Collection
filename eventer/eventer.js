define( function(){
    var Eventer = function(){
        if ( ! ( this instanceof Eventer ) ){
            return new Eventer();
        }

        //main event hash
        this._eventCache = {};
    };

    //add an event and callback
    Eventer.prototype.on = function( eventName, callback ){
        var self = this;
        if ( ! this._eventCache[ eventName ] ) {
            this._eventCache[ eventName ] = [];
        }

        this._eventCache[ eventName ].push( callback );

        //simple version - just return an event object
        //return [ eventName, callback ];

        //fancy version wrap 'off' in closure to enable
        //easier access, create 'do' method to trigger 
        //only this callback
        return {
            _handle : [ eventName, callback ],
            off : function(){
                self.off( [ eventName, callback ] );
            },
            do : function( data ){
                callback( data );
            }
        }
    };

    //remove callback and event if appropriate
    //todo: remove all handlers if argument is a string?
    Eventer.prototype.off = function( eventHandle ){
        var eventName = eventHandle[ 0 ];

        if ( ! this._eventCache[ eventName ] ){
            return;
        }

        for ( var i = 0; i < this._eventCache[ eventName ].length; i = i + 1 ) {
            if ( this._eventCache[ eventName ][ i ] === eventHandle[ 1 ] ){
                this._eventCache[ eventName ].splice( i, 1 );
            }
        }
    };

    //fire event callbacks
    Eventer.prototype.emit = function( eventName, data ){
        if ( ! this._eventCache[ eventName ] ){
            return;
        }

        for ( var i = 0; i < this._eventCache[ eventName ].length; i = i + 1 ) {
            this._eventCache[ eventName ][ i ].call( this, data );
        }
    };

    // public api /////////////////////////////////////////////////////////////
    return Eventer;
});
