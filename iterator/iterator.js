define( function(){
    var It = function( collection ){
        if ( ! ( this instanceof It ) ){
            return new It( collection );
        }
        this.collection = collection || [];
        this.idx = 0;
        this.length = this.collection.length;
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
            throw new Error( 'idx must be available in collection' );
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
            throw new Error( 'idx must be available in collection' );
        }
        this.collection[ idx ] = item;
    };


    /*
     * filter arg is a func that runs against each collection item to determine whether or not to include
     * new instance is returned with only qualified items from original instance
     */
    It.prototype.filter = function( filter ){
        var newCollection = [];

        for ( var i = 0, l = this.length; i < l; i = i + 1 ){
            if ( filter( this.collection[ i ] ) ){
                newCollection.push( this.collection[ i ] );
            }
        }
        return new It( newCollection );
    };


    // public api /////////////////////////////////////////////////////////////
    return It;
});
