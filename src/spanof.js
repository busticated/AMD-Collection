/*global define: false, require: false */

define(function(){
    'use strict';

    var spanOf = function( span ){

        var milliseconds = function(){ return span; },
            seconds = function(){ return span * 1000; },
            minutes = function(){ return this.seconds() * 60; },
            hours = function(){ return this.minutes() * 60; },
            days = function(){ return this.hours() * 24; },
            weeks = function(){ return this.days() * 7; },
            years = function(){ return +( this.days() * 365.24219878125 ).toFixed(); };

        return {
            milliseconds: milliseconds,
            ms: milliseconds,
            seconds: seconds,
            second: seconds,
            sec: seconds,
            minutes: minutes,
            minute: minutes,
            min: minutes,
            hours: hours,
            hour: hours,
            hr: hours,
            day: days,
            days: days,
            weeks: weeks,
            week: weeks,
            wk: weeks,
            years: years,
            year: years,
            yr: years
        };
    };

    return spanOf;
});
