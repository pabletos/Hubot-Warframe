var util = require('util');
var md = require('node-md-config');

/**
 * Converts the difference between two Date object to a String.
 * Convenience function
 *
 * @param {integer} millis  Difference in milliseconds between the two dates
 *
 * @return {string}
 */
module.exports.timeDeltaToString = function (millis) {
  var seconds = millis / 1000;
  var timePieces = [];

  if (seconds >= 86400) { // Seconds in a day
    timePieces.push(util.format('%dd', Math.floor(seconds / 86400)));
    seconds = Math.floor(seconds) % 86400;
  }
  if (seconds >= 3600) { // Seconds in an hour
    timePieces.push(util.format('%dh', Math.floor(seconds / 3600)));
    seconds = Math.floor(seconds) % 3600;
  }
  if(seconds > 60){
    timePieces.push(util.format('%dm', Math.floor(seconds/60)));
    seconds = Math.floor(seconds) % 60;
  }
  if(seconds > 0)
  {
    timePieces.push(util.format('%ds', Math.floor(seconds)));
  }
  return timePieces.join(' ');
};

module.exports.damageReduction = function (currentArmor) {
  var damageRes = parseInt(currentArmor) / (parseInt(currentArmor) + 300) * 100;
  return util.format("%d% damage reduction", damageRes);
};

module.exports.armorFull = function (baseArmor, baseLevel, currentLevel) {
  var armor = parseInt(baseArmor) * (1 + (Math.pow((parseInt(currentLevel) - parseInt(baseLevel)),1.75) / 200));
  var armorString = util.format("At level %s your enemy would have %d Armor %s %s", 
                     currentLevel, armor, md.lineEnd, 
                     this.damageReduction(armor))

  return util.format('%s %s %s', armorString, md.lineEnd, this.armorStrip(armor))
};

module.exports.armorStrip = function (armor) {
  var armorStripValue = 8*Math.log(parseInt(armor));
  
  return util.format("You will need %d corrosive procs to strip your enemy of armor.", armorStripValue)
};

module.exports.shieldCalc = function(baseShields, baseLevel, currentLevel) {    
    return parseInt(baseShields) + (Math.pow(parseInt(currentLevel)-parseInt(baseLevel), 2) * 0.0075 * parseInt(baseShields));
};

module.exports.shieldString = function(shields, level) {
  return util.format("%sAt level %s, your enemy would have %d Shields.%s", md.codeMulti, level, shields, md.blockEnd)
}

module.exports.stringsPath = process.env.HUBOT_WARFRAME_LANG_PATH || '../../resources/dataFiles/languages.json';