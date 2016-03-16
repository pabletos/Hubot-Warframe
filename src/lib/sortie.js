var util = require('util')
var dsUtil = require('./_utils.js')

var sortieData = require('./sortieData.json')

/**
 * Create a new sortie instance
 *
 * @constructor
 * @param {object} data Sorie data
 */
var Sortie = function (data) {
  this.expiry = new Date(1000 * data.Expiry.sec)
  this.variants = data.Variants.map(parseVariant)
  this.boss = sortieData.bosses[data.Variants[0].bossIndex]
}

/**
 * Returns a string representation of this sortie object
 * 
 * @return (string) The new string object
 */
Sortie.prototype.toString = function () {
  if(this.isExpired()){
    return 'None'
  }

  var sortieString = '| ' + this.boss + ' |\n\n'
  
  this.variants.forEach(function(variant, i) {
    sortieString += util.format('%d: %s - %s - %s\n\n', i, variant.planet,
                                variant.missionType, variant.modifier)
  })

  return sortieString
}

/**
 * Return a string containing the sortie's ETA
 *
 * @return {string} The new string object
 */
Sortie.prototype.getETAString = function() {
  return dsUtil.timeDeltaToString(this.expiry.getTime() - Date.now());
}

/** Returns true if the sortie has expired, false otherwise
 *
 * @return {boolean} Expired-ness of the sortie
 */
Sortie.prototype.isExpired = function() {
  return this.expiry.getTime() < Date.now()
}

/** Returns sortie boss
 *
 * @return {string} Name of sortie boss
 */
Sortie.prototype.getBoss = function() {
  return this.boss
}

function parseVariant(variant) {
  var parsed, region

  region = sortieData.regions[variant.regionIndex]
  parsed = {
    planet: region.name,
    missionType: region.missions[variant.missionIndex],
    modifier: sortieData.modifiers[variant.modifierIndex]
  }

  return parsed
}

module.exports = Sortie;
