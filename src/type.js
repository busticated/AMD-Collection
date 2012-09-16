/*global define:false, require:false */
/*jshint eqnull:true */
define(function () {
    'use strict';

    var type = {},
        not = {};

    type.is = {
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
            return typeof n === 'number' && type.is.not.NaN( n );
        },
        object: function( o ){
            return typeof o === 'object' && !type.is.array( o ) && o != null;
        },
        array: function( a ){
            return Object.prototype.toString.call( a ) === '[object Array]';
        },
        fn: function( f ){
            return typeof f === 'function';
        },
        method: function( obj, key ){
            return type.is.fn( obj[ key ] );
        },
        property: function( obj, key ){
            return !type.is.method( obj, key ) && !type.is.undefined( obj[ key ] );
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
            return type.is.null( _ ) || type.is.array( _ ) || type.is.bool( _ ) || type.is.emptyString( _ ) || isNaN( _ );
        }
    };

    for ( var prop in type.is ){
        if ( type.is.hasOwnProperty( prop )){
            not[ prop ] = (function( p ) {
                return function(){
                    return ! type.is[ p ].apply( type.is, arguments );
                };
            }( prop ));
        }
    }

    type.is.not = not;

    return type;
});
