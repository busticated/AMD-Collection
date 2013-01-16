/*global define: false, require: false */
define(function () {
    'use strict';

    var Eventer = function () {
        if ( !( this instanceof Eventer ) ) {
            return new Eventer();
        }
        this.__handlers = {};
    };

    Eventer.prototype.on = function ( eventName, callback ) {
        var names = eventName.split( ' ' ),
            name;

        for ( var i = 0, l = names.length; i < l; i += 1){
            name = names[ i ];
            if ( !this.__handlers[ name ] ) {
                this.__handlers[ name ] = [];
            }
            this.__handlers[ name ].push( callback );
        }

        return [ eventName, callback ];
    };

    Eventer.prototype.off = function ( eventHandle ) {
        var names = eventHandle[ 0 ].split( ' ' ),
            callback = eventHandle[ 1 ],
            name;

        for ( var i = 0, l = names.length; i < l; i += 1){
            name = names[ i ];

            if ( !this.__handlers[ name ] ) { return; }

            for ( var j = 0, k = this.__handlers[ name ].length; j < k; j += 1 ) {
                if ( this.__handlers[ name ][ j ] === callback ) {
                    this.__handlers[ name ].splice( j, 1 );
                }
            }

            if ( this.__handlers[ name ].length === 0 ) {
                delete this.__handlers[ name ];
            }
        }
        return this;
    };

    Eventer.prototype.emit = function ( eventName, data ) {
        if ( !this.__handlers[ eventName ] ) {
            return;
        }

        for ( var i = 0, l = this.__handlers[ eventName ].length; i < l; i = i + 1 ) {
            this.__handlers[ eventName ][ i ].call( this, data );
        }
    };

    Eventer.prototype.getEventHandlers = function () {
        return this.__handlers;
    };

    return Eventer;
});
