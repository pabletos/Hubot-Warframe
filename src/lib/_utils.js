var util = require('util');

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

    if (seconds >= 86400) { // Seconds in a day
        return util.format('%dd', Math.floor(seconds / 86400));
    } else if (seconds >= 3600) { // Seconds in an hour
        return util.format('%dh %dm', Math.floor(seconds / 3600)
            , Math.floor((seconds % 3600) / 60));
    } else {
        return util.format('%dm', Math.floor(seconds / 60));
    }
};

module.exports.damageReduction = function (currentArmor) {
  var damageRes = parseInt(currentArmor) / (parseInt(currentArmor) + 300) * 100;
  return util.format("%d% damage reduction", damageRes);
};

module.exports.armorFull = function (baseArmor, baseLevel, currentLevel) {
  var armor = parseInt(baseArmor) * (1 + (Math.pow((parseInt(currentLevel) - parseInt(baseLevel)),1.75) / 200));
  var armorString = util.format("At level %s your enemy would have %d Armor %s %s", 
                     currentLevel, armor, this.lineEnd, 
                     this.damageReduction(armor))

  return util.format('%s %s %s', armorString, this.lineEnd, this.armorStrip(armor))
};

module.exports.armorStrip = function (armor) {
  var armorStripValue = 8*Math.log(parseInt(armor));
  
  return util.format("You will need %d corrosive procs to strip your enemy of armor.", armorStripValue)
};

module.exports.shieldCalc = function(baseShields, baseLevel, currentLevel) {    
    return parseInt(baseShields) + (Math.pow(parseInt(currentLevel)-parseInt(baseLevel), 2) * 0.0075 * parseInt(baseShields));
};

module.exports.shieldString = function(shields, level) {
  return util.format("%sAt level %s, your enemy would have %d Shields.%s", this.codeMulti, level, shields, this.blockEnd)
}

module.exports.doubleReturn = process.env.HUBOT_DOUBLE_RET || '\n\n';
module.exports.lineEnd = process.env.HUBOT_LINE_END || '\n';
module.exports.blockEnd = process.env.HUBOT_BLOCK_END || ' ';
module.exports.linkBegin = process.env.HUBOT_MD_LINK_BEGIN || ' ';
module.exports.linkMid = process.env.HUBOT_MD_LINK_MID || ' ';
module.exports.linkEnd = process.env.HUBOT_MD_LINK_END || ' ';
module.exports.bold = process.env.HUBOT_MD_BOLD || ' ';
module.exports.italic = process.env.HUBOT_MD_ITALIC || ' ';
module.exports.underline = process.env.HUBOT_MD_UNDERLINE || ' ';
module.exports.strike = process.env.HUBOT_MD_STRIKE || ' ';
module.exports.codeLine = process.env.HUBOT_MD_CODE_SINGLE || ' ';
module.exports.codeMulti = process.env.HUBOT_MD_CODE_BLOCK || ' ';
module.exports.allowLewd = process.env.HUBOT_ALLOW_DIRTY_JOKES || false;