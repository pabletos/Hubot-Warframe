var util = require('util');
var dsUtil = require('./_utils.js');
var Reward = require('./reward.js');
var lineEnd = process.env.GENESIS_LINE_END || '\n';
var blockEnd = process.env.GENESIS_BLOCK_END  || ' ';

/**
 * Create a new invasion instance
 *
 * @constructor
 * @param {object} data Invasion data
 */
var Invasion = function(data) {
  this.id = data.Id;
  this.node = data.Node;

  this.planet = data.Region; 
  this.faction1 = data.InvaderInfo.Faction;
  this.type1 = data.InvaderInfo.MissionType;
  this.reward1 = rewardFromString(data.InvaderInfo.Reward);
  this.minLevel1 = data.InvaderInfo.MinLevel;
  this.maxLevel1 = data.InvaderInfo.MaxLevel;

  this.faction2 = data.DefenderInfo.Faction;
  this.type2 = data.DefenderInfo.MissionType;
  this.reward2 = rewardFromString(data.DefenderInfo.Reward);
  this.minLevel2 = data.DefenderInfo.MinLevel;
  this.maxLevel2 = data.DefenderInfo.MaxLevel;

  this.completion = data.Percentage;
  this.ETA = data.Eta;
  this.desc = data.Description;
}

/**
 * Returns a string representation of this invasion
 *
 * @return {string} This invasion in string format
 */
Invasion.prototype.toString = function() {
  if(this.faction1 === 'Infestation') {
    return util.format('%s (%s)%s' +
                       '%s (%s)%s' +
                       '%s%s' +
                       '%d% - %s%s',
                       this.node, this.planet, lineEnd, this.desc, this.type2, lineEnd,
                       this.reward2.toString(), lineEnd,
                       Math.round(this.completion * 100) / 100,
                       this.ETA, blockEnd);
  }

  return util.format('%s (%s) - %s%s' +
                     '%s (%s, %s) vs.%s' +
                     '%s (%s, %s)%s' +
                     '%d% - %s%s',
                     this.node, this.planet, this.desc, lineEnd,
					 this.faction1, this.type1, this.reward1.toString(), lineEnd,
					 this.faction2, this.type2, this.reward2.toString(),lineEnd,
                     Math.round(this.completion * 100) / 100, this.ETA, blockEnd);
}

/**
 * Return an array of strings each representing a reward type
 * Empty for credit only invasions
 *
 * @return {array} This invasion's reward types
 */
Invasion.prototype.getRewardTypes = function() {
  return this.reward1.getTypes().concat(this.reward2.getTypes());
}

/**
 * Parse a reward object from a string
 *
 * @param {string} text String to parse
 *
 * @return {object} Reward object
 */
function rewardFromString(text) {
  var credits, items, countedItems;
  credits = text.match(/(^[1-9][0-9,]+)cr/);
  if(credits) {
    credits = parseInt(credits[1].replace(',',''), 10);
  }

  items = text.match(/^(?:([1-9]+\d*)\s+)?([A-Za-z\s]+)/) || [];
  if(items[1]) {
    countedItems = [{ItemCount: items[1], ItemType: items[2]}];
    items = [];
  }
  else if(items[2]) {
    countedItems = [];
    items = [items[2]]
  }
  else {
    countedItems = [];
    items = [];
  }

  return new Reward({credits: credits, items: items,
                    countedItems: countedItems});
}

module.exports = Invasion;
