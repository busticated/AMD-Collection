define( function(){
    var It = function( collection ){
        if ( ! ( this instanceof It ) ){
            return new It( collection );
        }
        this.collection = collection || [];
        this.idx = 0;
        this.length = this.collection.length;
    };

    //test if arbitrary item is available
    It.prototype.has = function( idx ){
        return this.collection[ idx ] ? true : false;
    };

    //test if next item is available
    It.prototype.hasNext = function(){
        return this.idx < this.length;
    };

    /*
     * iteration methods - get next / prev item from collection
     *
     * @todo - provide a filter argument to use arbitrary criteria
     * to establish 'next' or 'prev' item.
     *
     * @todo - provide an inc argument to enable skipping ahead / back mutliple indexes
     *
     */

    //return current item from collection
    It.prototype.current = function(){
        return this.collection[ this.idx ];
    };

    It.prototype.next = function(){
        this.idx = this.idx + 1;
        if ( ! this.hasNext() ){
            return null;
        }
        return this.current();
    };

    It.prototype.prev = function(){
        this.idx = this.idx - 1;
        if ( ! this.hasNext() ){
            return null;
        }
        return this.current();
    };

    It.prototype.first = function(){
        this.idx = 0;
        return this.current();
    };

    It.prototype.last = function(){
        this.idx = this.length - 1;
        return this.current();
    };


    /*
     * update methods - add / remove / replace items from collection
     *
     */

    //add an item to the collection
    It.prototype.add = function( items, idx ){
        if ( typeof idx === 'undefined' || ! this.has( idx ) ){
            idx = this.length;
        }
        for ( var i = 0, l = items.length; i < l; i = i + 1 ){
            this.collection.splice( idx + i, 0, items[ i ] );
        }
        this.length = this.collection.length;
    };

    //remove an item from the collection
    It.prototype.remove = function( idx ){
        if ( typeof idx === 'number' ) {
            this.collection.splice( idx, 1 );
        }
        if ( typeof idx === 'object' ) {
            // this.collection.splice( idx[ 0 ], idx.length );
        }
        this.length = this.collection.length;
    };

    //replace one or more items in collection
    //idx can be either an int or an array. if init, single item is replaced. otherwise, multiple
    It.prototype.replace = function(){};
    It.prototype.filter = function( filter ){};






    // public api /////////////////////////////////////////////////////////////
    return It;
});
