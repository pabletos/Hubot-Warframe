var util = require('util');
var dsUtil = require('./_utils.js');

var Baro = function(data) {
  this.config = data.Config;
  this.start = new Date(1000 * data.Activation.sec);
  this.end = new Date(1000 * data.Expiry.sec);
  this.location = data.Node;
  this.manifest = data.Manifest;
}

Baro.prototype.toString = function() {
  if(!this.isActive()) {
    return 'Baro is not here yet, he will arrive in ' + this.getStartString() +
    ' at ' + this.location;
  }

  var baroString = '';
  for(i in this.manifest) {
    baroString += util.format('== %s ==\n' +
                              '- price: %d ducats + %dcr -\n\n',
                              this.manifest[i].ItemType,
                              this.manifest[i].PrimePrice,
                              this.manifest[i].RegularPrice);
  }

  baroString += 'Trader departing in ' + this.getEndString();

  return baroString;
}

Baro.prototype.getStartString = function() {
  return dsUtil.timeDeltaToString(this.start.getTime() - Date.now());
}

Baro.prototype.getEndString = function() {
  return dsUtil.timeDeltaToString(this.end.getTime() - Date.now());
}

Baro.prototype.isActive = function() {
  return (this.start.getTime() < Date.now() && this.end.getTime() > Date.now());
}

module.exports = Baro;
