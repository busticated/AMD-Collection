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
        if ( !this.__handlers[ eventName ] ) {
            this.__handlers[ eventName ] = [];
        }

        this.__handlers[ eventName ].push( callback );

        return [ eventName, callback ];
    };

    Eventer.prototype.off = function ( eventHandle ) {
        var eventName = eventHandle[ 0 ];

        if ( !this.__handlers[ eventName ] ) {
            return;
        }

        for ( var i = 0; i < this.__handlers[ eventName ].length; i = i + 1 ) {
            if ( this.__handlers[ eventName ][ i ] === eventHandle[ 1 ] ) {
                this.__handlers[ eventName ].splice( i, 1 );
            }
        }
    };

    Eventer.prototype.emit = function ( eventName, data ) {
        if ( !this.__handlers[ eventName ] ) {
            return;
        }

        for ( var i = 0; i < this.__handlers[ eventName ].length; i = i + 1 ) {
            this.__handlers[ eventName ][ i ].call( this, data );
        }
    };

    Eventer.prototype.getEventHandlers = function () {
        return this.__handlers;
    };

    return Eventer;
});
