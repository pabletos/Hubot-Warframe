var util = require('util');
var dsUtil = require('./_utils.js');

var News = function(data) {
  info = data.split('|');
  
  this.id = info[0];
  this.link = info[1];
  this.time = new Date(1000 * parseInt(info[2]));
  this.text = info[3];
}

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
    text = text.replace(/\[/, '\\[');

    formatString = '%s[%s](%s)'
  }

  return util.format(formatString, elapsedTime, text, this.link);
}

News.prototype.getElapsedTime = function() {
  return dsUtil.timeDeltaToString(Date.now() - this.time.getTime());
}

module.exports = News;
