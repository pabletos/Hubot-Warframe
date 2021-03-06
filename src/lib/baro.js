var util = require('util');
var dsUtil = require('./_utils.js');

/**
 * Create a new baro instance
 *
 * @constructor
 * @param {object} data Void Trader data
 */
var Baro = function(data) {
  this.config = data.Config;
  this.start = new Date(1000 * data.Activation.sec);
  this.end = new Date(1000 * data.Expiry.sec);
  this.location = data.Node;
  this.manifest = data.Manifest;
}

/**
 * Return a string with info about the Void Trader
 *
 * @return {string} The new string object
 */
Baro.prototype.toString = function() {
  if(!this.isActive()) {
    return util.format('%sBaro is not here yet, he will arrive in %s at %s%s', dsUtil.codeMulti, this.getStartString(), this.location, dsUtil.blockEnd);
  }
  var baroString = util.format('%sVoid Trader at %s%s', dsUtil.codeMulti, this.location, dsUtil.doubleReturn);
  for(i in this.manifest) {
    baroString += util.format('%s - price: %d ducats + %dcr%s',
                              this.manifest[i].ItemType,
                              this.manifest[i].PrimePrice,
                              this.manifest[i].RegularPrice,
                              dsUtil.lineEnd);
  }
  baroString += util.format('Trader departing in %s%s', this.getEndString(), dsUtil.blockEnd);

  return baroString;
}

/**
 * Return how much time is left before the Void Trader arrives
 *
 * @return {string} The new string object
 */
Baro.prototype.getStartString = function() {
  return dsUtil.timeDeltaToString(this.start.getTime() - Date.now());
}

/**
 * Return how much time is left before the Void Trader departs
 *
 * @return {string} The new string object
 */
Baro.prototype.getEndString = function() {
  return dsUtil.timeDeltaToString(this.end.getTime() - Date.now());
}

/**
 * Returns true if the Void Trader is active, false otherwise
 *
 * @return {boolean} Void trader activity state
 */
Baro.prototype.isActive = function() {
  return (this.start.getTime() < Date.now() && this.end.getTime() > Date.now());
}

module.exports = Baro;