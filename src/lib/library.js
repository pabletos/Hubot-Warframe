util = require('util');
var lineEnd = process.env.GENESIS_LINE_END || '\n';
var blockEnd = process.env.GENESIS_BLOCK_END || ' ';
var doubleReturn = process.env.GENESIS_DOUBLE_RET || '\n\n';

/**
 * Create a new Library target instance
 *
 * @constructor
 * @param {object} data Library target data
 */
var Library = function(data) {
  if(data.CurrentTarget) {
    this.active = true;
    this.target = data.CurrentTarget.EnemyType;
    this.scans = data.CurrentTarget.PersonalScansRequired;
    this.progress = data.CurrentTarget.ProgressPercent;
  }
  else {
    this.active = false;
  }
}

/**
 * Return a string representation of this library target
 *
 * @return {string} Target in string format
 */
Library.prototype.toString = function() {
  if(!this.isActive()) {
    return 'No active target';
  }

  var libraryString = util.format('Target: %s%s' +
                                  'Scans needed: %d%s' +
                                  'Progress: %d',
                                  this.target, lineEnd,
                                  this.scans, lineEnd,
                                  Math.round(100 * this.progress) / 100, blockEnd);

  return libraryString;
}

/**
 * Return true if the target is active, false otherwise
 *
 * @return {boolean} Whether the target is active
 */
Library.prototype.isActive = function() {
  return this.active;
}

module.exports = Library;
