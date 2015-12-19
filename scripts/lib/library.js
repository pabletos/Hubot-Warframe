util = require('util');

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

Library.prototype.toString = function() {
  if(!this.isActive()) {
    return 'No active target';
  }

  var libraryString = util.format('Target: %s\n' +
                                  'Scans needed: %d\n' +
                                  'Progress: %d', this.target, this.scans,
                                  Math.round(100 * this.progress) / 100);

  return libraryString;
}

Library.prototype.isActive = function() {
  return this.active;
}

module.exports = Library;
