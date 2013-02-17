/*global define: false, require: false */

define(function(){
    'use strict';

    var __ = {
        objToString: Object.prototype.toString,
        arrSlice: Array.prototype.slice,
        toArray: function( args ){
            return __.arrSlice.call( args );
        },
        isArray: function( a ){
            return __.objToString.call( a ) === '[object Array]';
        },
        isObject: function( o ){
            return __.objToString.call( o ) === '[object Object]';
        },
        hasConfig: function( o ){
            return __.isObject( o ) && 'keyPrefix' in o && 'keyProp' in o;
        },
        setupCollection: function( args ){
            var a = __.toArray( args );

            if ( __.hasConfig( a[ 1 ] ) ){
                a.splice( 1, 1 );
            }

            if ( __.isArray( a[ 0 ] ) && a.length === 1 ){
                return a[ 0 ];
            }

            if ( a.length >= 1 ){
                return a;
            }

            return [];
        }
    };

    var It = function( collection ){
        if ( ! ( this instanceof It ) ){
            return It.apply( new It(), arguments );
        }
        this.collection = __.setupCollection( arguments );
        this.index = 0;
        this.length = this.collection.length;
        return this;
    };

    It.prototype = {
        // test methods - return bool
        has : function( index ){
            return this.hasIndex( index ) || this.hasKey( index );
        },
        hasIndex: function( index ){
            return index < this.length && index >= 0;
        },
        hasKey : function( key ){
            return key in this.collection;
        },
        hasNext : function(){
            return this.has( this.index + 1);
        },
        hasPrev : function(){
            return this.has( this.index - 1);
        },
        isFirst : function( index ){
            if ( typeof index === 'undefined' ){
                return this.isFirst( this.index );
            }
            return index === 0;
        },
        isLast : function( index ){
            if ( typeof index === 'undefined' ){
                return this.isLast( this.index );
            }
            return index === this.length - 1;
        },
        isEmpty : function(){
            return this.length === 0;
        },

        // iteration methods - return collection item(s)
        get : function( index ){
            return this.collection[ index ];
        },
        getNext : function(){
            var index = this.index + 1;

            if ( this.isLooping && ! this.hasNext() ){
                this.isLooping = false;
                index = 0;
            }

            return this.get( index );
        },
        getPrev : function(){
            var index = this.index - 1;

            if ( this.isLooping && ! this.hasPrev() ){
                this.isLooping = false;
                index = this.length - 1;
            }

            return this.get( index );
        },
        current : function(){
            return this.get( this.index );
        },
        next : function(){
            if ( this.hasNext() ){
                return this.setIndex( this.index + 1 ).current();
            }
            if ( this.isLooping ) {
                this.isLooping = false;
                return this.first();
            }
            return null;
        },
        prev : function(){
            if ( this.hasPrev() ){
                return this.setIndex( this.index - 1 ).current();
            }
            if ( this.isLooping ){
                this.isLooping = false;
                return this.last();
            }
            return null;
        },
        first : function(){
            return this.setIndex( 0 ).current();
        },
        last : function(){
            return this.setIndex( this.length - 1 ).current();
        },

        // utility methods
        indexOf: function( item, fromIdx ){
            fromIdx = fromIdx || 0;
            fromIdx = fromIdx < 0 ? Math.max( 0, this.length + fromIdx ) : fromIdx;

            if ( Array.prototype.indexOf ) {
                return this.collection.indexOf( item, fromIdx );
            }

            for ( var i = fromIdx, l = this.length; i < l; i += 1 ){
                if ( item === this.collection[ i ] ){
                    return i;
                }
            }

            return -1;
        },
        indexOfKey : function( key, fromIdx ){
            return this.indexOf( this.get( key ), fromIdx );
        },
        setIndex : function( index ){
            if ( ! this.has( index ) ){
                throw new Error( 'index out of bounds - collection does not include that index' );
            }
            this.index = index;
            return this;
        },
        loop : function(){
            this.isLooping = true;
            return this;
        },
        each : function( callback, context ){
            var ctx;

            if ( typeof callback !== 'function' ){
                throw new Error( 'callback is of type ' + typeof callback + ' expected a function' );
            }

            if ( context ){
                ctx = context;
            }

            for ( var i = 0, l = this.length; i < l; i += 1 ){
                callback.call( ctx, this.collection[ i ], i );
            }
            return this;
        },
        toJSON: function(){
            return this.collection;
        },

        // collection modification methods
        add : function( items, index ){
            if ( ! __.isArray( items ) ){
                items = [ items ];
            }

            if ( typeof index === 'undefined' || ! this.has( index ) ){
                index = this.length;
            }
            for ( var i = 0, l = items.length; i < l; i += 1 ){
                this.collection.splice( index + i, 0, items[ i ] );
            }
            this.length = this.collection.length;
            return this;
        },
        remove : function( index ){
            var key;

            if ( typeof index === 'number' ) {
                this.collection.splice( index, 1 );
            }

            if ( typeof index === 'string' ) {
                key = index;
                index = this.indexOfKey( key );
                if ( index >= 0 ){
                    delete this.collection[ key ];
                    return this.remove( index );
                }
            }

            this.length = this.collection.length;
            return this;
        },
        update : function( index, item ){
            if ( ! this.has( index ) ){
                throw new Error( 'index out of bounds - collection does not include that index' );
            }
            this.collection[ index ] = item;
            return this;
        },
        replace : function( fromIndex, items ){
            fromIndex = fromIndex || 0;
            for ( var i = 0, l = items.length; i < l; i += 1 ){
                this.update( fromIndex++, items[ i ] );
            }
            return this;
        },
        empty: function(){
            this.collection = [];
            this.length = this.collection.length;
            return this;
        },
        filter : function( filter ){
            var newCollection = [];
            for ( var i = 0, l = this.length; i < l; i += 1 ){
                if ( filter( this.collection[ i ], i ) ){
                    newCollection.push( this.collection[ i ] );
                }
            }
            return new It( newCollection );
        }
    };

    // public api /////////////////////////////////////////////////////////////
    return It;
});
