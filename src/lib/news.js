var util = require('util');
var dsUtil = require('./_utils.js');

/**
 * Create a new News instance
 *
 * @constructor
 * @param {string} data Data about this news, with fields separated by the | character
 */
var News = function(data) {
  info = data.split('|');
  
  this.id = info[0];
  this.link = info[1];
  this.time = new Date(1000 * parseInt(info[2]));
  this.text = info[3];
}

/**
 * Return a string representation of the news object, with optional
 * Markdown formatting
 *
 * @param {boolean} showElapsedTime Show/hide elapsed time
 * @param {boolean} markdown Enable/disable Markdown formatting
 *
 * @return {string} This object in string format
 */
News.prototype.toString = function(showElapsedTime, markdown) {
  // Default value = true
  showElapsedTime = typeof showElapsedTime !== 'undefined'
    ? showElapsedTime
    : true;

  // Default value = false
  markdown = typeof markdown !== 'undefined'
    ? markdown
    : false;

  var formatString = '%s%s (%s)';
  var text = this.text ;

  var elapsedTime = showElapsedTime
    ? '[' + this.getElapsedTime() + ' ago]: '
    : '';

  if(markdown) {
    // Escape square brackets
    elapsedTime = elapsedTime.replace(/\[/, '\\[');
    text = text.replace(/\[/, '(');
    text = text.replace(/\]/, ')'); 
  }

  this.link = this.link.replace(/\s/, '');
  formatString = '%s%s%s%s%s%s%s%s';
  return util.format(formatString, dsUtil.codeMulti, elapsedTime, dsUtil.linkBegin, text, dsUtil.linkMid, this.link, dsUtil.linkEnd, dsUtil.blockEnd);
}

/**
 * Return how much time has passed since this news was published
 * @return {string} The new string object
 */
News.prototype.getElapsedTime = function() {
  return dsUtil.timeDeltaToString(Date.now() - this.time.getTime());
}

module.exports = News;