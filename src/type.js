/*global define:false, require:false */
/*jshint eqnull:true */
define(function () {
    'use strict';

    var objToString = Object.prototype.toString,
        type = {},
        not = {};

    type.is = {
        bool: function( b ){
            return typeof b === 'boolean';
        },
        string: function( s ){
            return typeof s === 'string';
        },
        emptyString: function( s ){
            return type.is.string( s ) && s.length === 0;
        },
        alpha: function( s ){
            return type.is.string( s ) && type.is.not.emptyString( s ) && /[a-z]/gi.test( s );
        },
        alphaNumeric: function( s ){
            return type.is.string( s ) && type.is.not.emptyString( s ) && /\w/gi.test( s );
        },
        number: function( n ){
            return typeof n === 'number' && type.is.not.NaN( n );
        },
        even: function( n ){
            return type.is.number( n ) && n % 2 === 0;
        },
        odd: function( n ){
            return type.is.number( n ) && n % 2 !== 0;
        },
        positive: function( n ){
            return type.is.number( n ) && n > 0;
        },
        negative: function( n ){
            return type.is.number( n ) && n < 0;
        },
        regex: function( r ){
            return objToString.call( r ) === '[object RegExp]';
        },
        object: function( o ){
            return objToString.call( o ) === '[object Object]';
        },
        array: function( a ){
            return objToString.call( a ) === '[object Array]';
        },
        emptyArray: function( a ){
            return type.is.array( a ) && a.length === 0;
        },
        fn: function( f ){
            return typeof f === 'function';
        },
        method: function( obj, key ){
            return type.is.fn( obj[ key ] );
        },
        property: function( obj, key ){
            return !type.is.method( obj, key ) && key in obj;
        },
        error: function( err ){
            return objToString.call( err ) === '[object Error]';
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
