/*global define: false, require: false */

define(function(){
    'use strict';

    var Trie = function( word ){
        if ( ! ( this instanceof Trie ) ) {
            return new Trie( word );
        }
        this.__store = {};
        this.add( word );
    };

    Trie.prototype.__getSiblingNodes = (function(){
        var _nodes = [];

        return function( node ){
            var out;

            if ( typeof node !== 'object' ){ return []; }

            for ( var prop in node ){
                if ( node.hasOwnProperty( prop ) ){
                    _nodes.push( prop );
                }
            }

            out = _nodes;
            _nodes = [];
            return out;
        };
    }());

    Trie.prototype.__hasSiblingNode = function( node ){
        return !! this.__getSiblingNodes( node ).length;
    };

    Trie.prototype.add = function( word ){
        var letters = word.toLowerCase().split(''),
            store = this.__store,
            letter;

        for ( var i = 0, len = letters.length; i < len; i += 1 ){
            letter = letters[ i ];

            if ( ! store[ letter ] ){
                store[ letter ] = {};
            }

            store = store[ letter ];
        }

        store._ = 1;

        return this;
    };

    Trie.prototype.remove = function( word ){
        var store = this.__store,
            nodes = [],
            nodeAndLetter, letter, node;

        word = word.toLowerCase();

        for ( var i = 0, len = word.length; i < len; i += 1 ){
            if ( ! store ){
                return this;
            }

            letter = word.charAt( i );
            nodes.push( [ store, letter ] );
            store = store[ letter ];
        }

        while ( nodes.length ){
            nodeAndLetter = nodes.pop();
            node = nodeAndLetter[ 0 ];
            letter = nodeAndLetter[ 1 ];

            if ( !!(node[ letter ] && node[ letter ]._) ){
                delete node[ letter ]._;
            }

            if ( ! this.__hasSiblingNode( node[ letter ] ) ){
                delete node[ letter ];
            } else {
                break;
            }
        }

        return this;
    };

    Trie.prototype.has = function( word ){
        var store = this.__store,
            letter;

        word = word.toLowerCase();

        for ( var i = 0, len = word.length; i < len; i += 1 ){
            letter = word.charAt( i );
            store = store[ letter ];

            if ( ! store ){
                return false;
            }
        }

        if ( ! store._ ){
            return false;
        }

        return true;
    };

    Trie.prototype.like = function( word ){
        var out = [];

        if ( this.has( word ) ){
            out.push( word );
        }

        //... and?

        return out;
    };

    Trie.prototype.toJSON = function(){
        return this.__store;
    };

    Trie.prototype.clear = function(){
        this.__store = {};
        return this;
    };

    return Trie;
});
