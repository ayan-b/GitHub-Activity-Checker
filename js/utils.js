// utility functions used by the code

/**
 * 
 * @param {string} str - A string
 * @param {integer} len - Truncates the `str` to length of `len`
 * @return {string} Truncated string
 */
function truncate (str, len){

    if (str.length > len){
        return (str.substring(0, len-1) + "...");
    }
    return str;
}

/**
 *
 * @param {integer} number - A number
 * @return {string} Pluralize a number by adding an `s` if `number` is greater
 * than `1`
 */
function numberEnding(number) {
    return (number > 1) ? 's ago' : ' ago';
}

/**
 * 
 * @param {integer} milliseconds - Time in milliseconds
 * @return {string} A string denoting time difference in `day(s)`, `month(s)`,
 * `year(s)` or `just now`
 */
function getDifference(milliseconds){
    'use strict';
    
    let temp = Math.floor(milliseconds / 1000);
    
    let years = Math.floor(temp / 31536000);
    if (years) return years + ' year' + numberEnding(years);
    
    let months = Math.floor((temp %= 31536000) / 2592000);
    if (months) return months + ' month' + numberEnding(months);
    
    let days = Math.floor((temp %= 2592000) / 86400);
    if (days) return days + ' day' + numberEnding(days);
    
    let hours = Math.floor((temp %= 86400) / 3600);
    if (hours) return 'about ' + hours + ' hour' + numberEnding(hours);
    
    let minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) return minutes + ' minute' + numberEnding(minutes);
    
    let seconds = temp % 60;
    if (seconds) return seconds + ' second' + numberEnding(seconds);
    
    return 'just now';
}
