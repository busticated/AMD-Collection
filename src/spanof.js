define(function(){
    'use strict';

    var spanOf = function( span ){

        var milliseconds = function(){ return span; },
            ms = milliseconds,
            seconds = function(){ return span * 1000; },
            sec = seconds,
            minutes = function(){ return this.seconds() * 60; },
            min = minutes,
            hours = function(){ return this.minutes() * 60; },
            hr = hours,
            days = function(){ return this.hours() * 24; },
            weeks = function(){ return this.days() * 7; },
            wk = weeks,
            years = function(){ return +( this.days() * 365.24219878125 ).toFixed(); },
            yr = years;

        return {
            milliseconds: milliseconds,
            ms: ms,
            seconds: seconds,
            sec: sec,
            minutes: minutes,
            min: min,
            hours: hours,
            hr: hr,
            days: days,
            weeks: weeks,
            wk: wk,
            years: years,
            yr: yr
        };
    };

    return spanOf;
});
