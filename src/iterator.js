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
            return o != null && __.objToString.call( o ) === '[object Object]';
        },
        hasConfig: function( o ){
            return __.isObject( o ) && 'useLookupKey' in o;
        },
        getParams: function( args ){
            var a = __.toArray( args ),
                lastArg = a[ a.length - 1 ],
                params = {};

            if ( __.hasConfig( lastArg ) ){
                params.key = a.splice( a.length - 1, 1 )[ 0 ].useLookupKey;
            }

            if ( __.isArray( a[ 0 ] ) && a.length === 1 ){
                params.collection = a[ 0 ];
                return params;
            }

            if ( a.length >= 1 ){
                params.collection = a;
                return params;
            }

            params.collection = [];
            return params;
        }
    };

    var It = function(){
        if ( ! ( this instanceof It ) ){
            return It.apply( new It(), arguments );
        }
        var p = __.getParams( arguments );
        this.index = 0;
        this.length = 0;
        this.collection = [];
        this.key = p.key;
        this.add( p.collection );
        return this;
    };

    It.prototype = {
        isLooping : false,
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
            return this.hasIndex( this.index + 1);
        },
        hasPrev : function(){
            return this.hasIndex( this.index - 1);
        },
        isFirst : function( index ){
            if ( typeof index === 'undefined' ){
                return this.isFirst( this.index );
            }
            if ( typeof index === 'string' ){
                index = this.indexOfKey( index );
            }
            return index === 0;
        },
        isLast : function( index ){
            if ( typeof index === 'undefined' ){
                return this.isLast( this.index );
            }
            if ( typeof index === 'string' ){
                index = this.indexOfKey( index );
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
                index = 0;
            }

            return this.get( index );
        },
        getPrev : function(){
            var index = this.index - 1;

            if ( this.isLooping && ! this.hasPrev() ){
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
                return this.first();
            }
            return null;
        },
        prev : function(){
            if ( this.hasPrev() ){
                return this.setIndex( this.index - 1 ).current();
            }
            if ( this.isLooping ){
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
                if ( item === this.get( i ) ){
                    return i;
                }
            }

            return -1;
        },
        indexOfKey : function( key, fromIdx ){
            return this.indexOf( this.get( key ), fromIdx );
        },
        getKeyForIndex : function( index ){
            var key;

            if ( this.key && this.collection[ index ][ this.key ] ){
                key = this.key + this.collection[ index ][ this.key ];
            }

            return key;
        },
        getKeyForItem : function( item ){
            var undef;

            if ( ! __.isObject( item ) ){
                throw new Error( 'item must be an object in order to get key' );
            }

            return item[ this.key ] ? this.key + item[ this.key ] : undef;
        },
        setIndex : function( index ){
            if ( ! this.has( index ) ){
                throw new Error( 'index out of bounds - collection does not include that index' );
            }
            this.index = index;
            return this;
        },
        each : function( callback, context ){
            var item;

            if ( typeof callback !== 'function' ){
                throw new Error( 'callback is of type ' + typeof callback + ' expected a function' );
            }

            for ( var i = 0, l = this.length; i < l; i += 1 ){
                item = this.get( i );
                callback.call( context || item, item, i );
            }
            return this;
        },
        toJSON: function(){
            return this.collection;
        },

        // collection modification methods
        add : function( items, atIndex ){
            var item;

            if ( ! __.isArray( items ) ){
                items = [ items ];
            }

            if ( typeof atIndex === 'string' ){
                atIndex = this.indexOfKey( atIndex );
            }

            if ( typeof atIndex === 'undefined' || ! this.has( atIndex ) ){
                atIndex = this.length;
            }

            for ( var i = 0, l = items.length; i < l; i += 1 ){
                item =  items[ i ];
                this.collection.splice( atIndex + i, 0, item );
                // TODO - enforce uniqueness, split out into more readable helper?
                if ( this.key && item[ this.key ] ){
                    this.collection[ this.getKeyForItem( item ) ] = this.collection[ atIndex + i ];
                }
            }

            this.length = this.collection.length;
            return this;
        },
        remove : function( index ){
            var key, removedItem;

            if ( typeof index === 'number' ) {
                removedItem = this.collection.splice( index, 1 )[ 0 ];
                if ( this.key && removedItem ){
                    key = this.getKeyForItem( removedItem );
                    delete this.collection[ key ];
                }
            }

            if ( typeof index === 'string' ) {
                key = index;
                index = this.indexOfKey( key );
                if ( index >= 0 ){
                    return this.remove( index );
                }
            }

            this.length = this.collection.length;
            return this;
        },
        update : function( index, item ){
            var key;

            if ( typeof index === 'string' ) {
                key = index;
                index = this.indexOfKey( key );
            }

            if ( ! this.has( index ) ){
                throw new Error( 'index out of bounds - collection does not include that index' );
            }

            this.collection[ index ] = item;
            if ( this.key && this.hasKey( key ) ){
                delete this.collection[ key ];
                key = this.getKeyForIndex( index );
                this.collection[ key ] = this.collection[ index ];
            }

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
        filter : function( filteringFn, ctx ){
            var newCollection = [], item;
            for ( var i = 0, l = this.length; i < l; i += 1 ){
                item = this.get( i );
                if ( filteringFn.call( ctx, item, i ) ){
                    newCollection.push( item );
                }
            }
            return new It( newCollection );
        },
        map : function( fn, ctx ){
            var out = [],
                item;

            if ( Array.prototype.map ){
                return this.collection.map( fn, ctx );
            }

            for ( var i = 0, l = this.length; i < l; i += 1 ){
                item = this.get( i );
                out.push( fn.call( ctx, item, i, this.collection ) );
            }

            return out;
        },
        take : function( count ){
            var items = this.collection.slice( 0, count );

            if ( this.key ){
                return new It( items,  { useLookupKey: this.key } );
            }

            return new It( items );
        }
    };

    // public api /////////////////////////////////////////////////////////////
    return It;
});
