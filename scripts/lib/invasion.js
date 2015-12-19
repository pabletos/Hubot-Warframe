var util = require('util');
var dsUtil = require('./_utils.js');

var Invasion = function(data) {
  this.id = data.Id;
  this.node = data.Node;

  this.planet = data.Region; 
  this.faction1 = data.InvaderInfo.Faction;
  this.type1 = data.InvaderInfo.MissionType;
  this.reward1 = data.InvaderInfo.Reward;
  this.minLevel1 = data.InvaderInfo.MinLevel;
  this.maxLevel1 = data.InvaderInfo.MaxLevel;

  this.faction2 = data.DefenderInfo.Faction;
  this.type2 = data.DefenderInfo.MissionType;
  this.reward2 = data.DefenderInfo.Reward;
  this.minLevel2 = data.DefenderInfo.MinLevel;
  this.maxLevel2 = data.DefenderInfo.MaxLevel;

  this.completion = data.Percentage;
  this.ETA = data.Eta;
  this.desc = data.Description;
}

Invasion.prototype.toString = function() {
  if(this.faction1 === 'Infestation') {
    return util.format('%s (%s)\n' +
                       '%s (%s)\n' +
                       '%s\n' +
                       '%d% - %s',
                       this.node, this.planet, this.desc, this.type2,
                       this.reward2, Math.round(this.completion * 100) / 100,
                       this.ETA);
  }

  return util.format('%s (%s) - %s\n' +
                     '%s (%s, %s) vs.\n' +
                     '%s (%s, %s)\n' +
                     '%d% - %s',
                     this.node, this.planet, this.desc, this.faction1,
                     this.type1, this.reward1, this.faction2, this.type2,
                     this.reward2, Math.round(this.completion * 100) / 100, 
                     this.ETA);
}

// Only returns rewards that are not credits
Invasion.prototype.getRewards = function() {
  return [this.reward1, this.reward2].filter(function noCredits(reward) {
    return reward.indexOf('cr') !== -1
      ? true
      : false;
  });
}

module.exports = Invasion;
