/*global define:false, require:false */
/*jshint eqnull:true */
define(function () {
    'use strict';

    var asrt = {},
        not = {};

    asrt.is = {
        bool: function( b ){
            return typeof b === 'boolean';
        },
        string: function( s ){
            return typeof s === 'string';
        },
        emptyString: function( s ){
            return typeof s === 'string' && s.length === 0;
        },
        number: function( n ){
            return typeof n === 'number' && asrt.is.not.NaN( n );
        },
        object: function( o ){
            return typeof o === 'object' && !asrt.is.array( o ) && o != null;
        },
        array: function( a ){
            return Object.prototype.toString.call( a ) === '[object Array]';
        },
        fn: function( f ){
            return typeof f === 'function';
        },
        method: function( m ){
            return asrt.is.fn( m );
        },
        property: function( p ){
            return !asrt.is.method( p );
        },
        undefined: function( u ){
            return typeof u === 'undefined';
        },
        null: function( n ){
            return n === null;
        },
        nullOrUndefined: function( n ){
            return n == null;
        },
        NaN: function( _ ){
            return asrt.is.null( _ ) || asrt.is.array( _ ) || asrt.is.bool( _ ) || asrt.is.emptyString( _ ) || isNaN( _ );
        }
    };

    for ( var prop in asrt.is ){
        if ( asrt.is.hasOwnProperty( prop )){
            not[ prop ] = (function( p ) {
                return function( x ){
                    return ! asrt.is[ p ].call( asrt.is, x );
                };
            }( prop ));
        }
    }

    asrt.is.not = not;

    return asrt;
});
