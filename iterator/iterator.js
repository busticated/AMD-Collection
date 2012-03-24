/*global define: false, require: false */

define( function(){
    'use strict';

    var _isArray = function( arg ){
        return Object.prototype.toString.call( arguments[ 0 ] ) === '[object Array]';
    };

    var It = function( collection ){
        if ( ! ( this instanceof It ) ){
            return It.apply( new It(), arguments );
        }

        if ( _isArray( arguments[ 0 ] ) ){
            this.collection = Array.prototype.slice.call( arguments[ 0 ] );
        } else {
            this.collection = Array.prototype.slice.call( arguments );
        }

        this.idx = 0;
        this.length = this.collection.length;
        return this;
    };


    // test methods - return bool
    It.prototype.has = function( idx ){
        return this.collection[ idx ] ? true : false;
    };

    It.prototype.hasNext = function(){
        return ! this.isLast();
    };

    It.prototype.hasPrev = function(){
        return ! this.isFirst();
    };

    It.prototype.isFirst = function( idx ){
        if ( typeof idx === 'undefined' ){
            return this.isFirst( this.idx );
        }
        return idx === 0;
    };

    It.prototype.isLast = function( idx ){
        if ( typeof idx === 'undefined' ){
            return this.isLast( this.idx );
        }
        return idx === this.length - 1;
    };


    // iteration methods - return collection item(s)
    It.prototype.get = function( idx ){
        return this.collection[ idx ];
    };

    It.prototype.current = function(){
        return this.get( this.idx );
    };

    It.prototype.next = function(){
        if ( this.hasNext() ){
            return this.setIdx( this.idx + 1 ).current();
        } else if  ( this.isLooping ) {
            this.isLooping = false;
            return this.first();
        } else {
            return null;
        }
    };

    It.prototype.prev = function(){
        if ( this.hasPrev() ){
            return this.setIdx( this.idx - 1 ).current();
        } else if ( this.isLooping ){
            this.isLooping = false;
            return this.last();
        } else {
            return null;
        }
    };

    It.prototype.first = function(){
        this.setIdx( 0 );
        return this.current();
    };

    It.prototype.last = function(){
        this.setIdx( this.length - 1 );
        return this.current();
    };


    // chainable methods
    It.prototype.setIdx = function( idx ){
        if ( ! this.has( idx ) ){
            throw new Error( 'idx out of bounds - collection does not include that index' );
        }
        this.idx = idx;
        return this;
    };

    It.prototype.loop = function(){
        this.isLooping = true;
        return this;
    };


    // collection modification methods
    It.prototype.add = function( items, idx ){
        if ( ! _isArray( items ) ){
            items = [ items ];
        }

        if ( typeof idx === 'undefined' || ! this.has( idx ) ){
            idx = this.length;
        }
        for ( var i = 0, l = items.length; i < l; i = i + 1 ){
            this.collection.splice( idx + i, 0, items[ i ] );
        }
        this.length = this.collection.length;
    };

    It.prototype.remove = function( idx ){
        if ( typeof idx === 'number' ) {
            this.collection.splice( idx, 1 );
        }
        this.length = this.collection.length;
    };

    It.prototype.update = function( item, idx ){
        if ( ! this.has( idx ) ){
            throw new Error( 'idx out of bounds - collection does not include that index' );
        }
        this.collection[ idx ] = item;
    };

    It.prototype.filter = function( filter ){
        var newCollection = [];

        for ( var i = 0, l = this.length; i < l; i = i + 1 ){
            if ( filter( this.collection[ i ] ) ){
                newCollection.push( this.collection[ i ] );
            }
        }
        return new It( newCollection );
    };

    It.prototype.each = function( callback, context ){
        var ctx;

        if ( typeof callback != 'function' ){
            throw new Error( 'callback is of type ' + typeof callback + ' expected a function' );
        }

        if ( context ){
            ctx = context;
        }

        for ( var i = 0, l = this.length; i < l; i = i + 1 ){
            callback.call( ctx, this.collection[ i ], i );
        }
        return this;
    };


    // public api /////////////////////////////////////////////////////////////
    return It;
});
