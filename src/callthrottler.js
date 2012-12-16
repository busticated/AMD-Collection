define(function(){
    'use strict';

    var CallThrottler = function( interval ){
        if ( !( this instanceof CallThrottler ) ) {
            return new CallThrottler();
        }
        this.interval = interval || 1000;
        this.commands = [];
        this.isRunning = false;
        this._timerId = null;
    };

    CallThrottler.prototype.add = function(){
        var fn = arguments[ 0 ],
            args = Array.prototype.slice.call( arguments ).slice( 1 );

        this.commands.push({ fn: fn, args: args });
        if ( !this.isRunning ){ this.start(); }
        return this;
    };

    CallThrottler.prototype.start = function(){
        this._timerId = setTimeout( this.bind( this.run ), this.interval );
        this.isRunning = true;
        return this;
    };

    CallThrottler.prototype.run = function(){
        var cmd = this.commands.shift();
        cmd && cmd.fn.apply( null, cmd.args );
        if ( this.commands.length ){
            this.start();
        } else {
            this.isRunning = false;
        }
    };

    CallThrottler.prototype.bind = function( method ){
        var ctx = this;
        return function(){
            method.call( ctx, arguments );
        };
    };

    return CallThrottler;
});
