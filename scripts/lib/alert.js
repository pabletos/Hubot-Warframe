var util = require('util');
var dsUtil = require('./_utils.js');

var Alert = function(data) {
  this.id = data.id;
  this.activation = new Date(1000 * data.Activation.sec);
  this.expiry = new Date(1000 * data.Expiry.sec);
  this.desctiption = data.MissionInfo.descText;
  this.location = data.MissionInfo.location;
  this.missionType = data.MissionInfo.missionType;
  this.faction = data.MissionInfo.faction;
  this.minLevel = data.MissionInfo.minEnemyLevel;
  this.maxLevel = data.MissionInfo.maxEnemyLevel;
  this.nightmare = data.MissionInfo.nightmare;
  this.archwing = data.MissionInfo.archwingRequired;

  this.items = data.MissionInfo.missionReward.items;
  this.countedItems = data.MissionInfo.missionReward.countedItems;
  this.credits = data.MissionInfo.missionReward.credits;
}

Alert.prototype.toString = function() {
  var rewardString = '';

  for(var i in this.items) {
    rewardString += this.items[i] + ' + ';
  }

  for(var i in this.countedItems) {
    rewardString += util.format('%d %s + ', this.countedItems[i].ItemCount,
				this.countedItems[i].ItemType);
  }

  rewardString += this.credits + 'cr';

  var alertString = util.format('%s\n' +
                                '%s (%s)\n' +
                                '%s\n' +
                                'level %d - %d\n' +
                                'Expires in %s',
                                this.location, this.missionType, this.faction,
                                rewardString, this.minLevel, this.maxLevel,
                                this.getETAString());

  return alertString;
}

Alert.prototype.getETAString = function() {
  return dsUtil.timeDeltaToString(this.expiry.getTime() - Date.now());
}

// Returns an array of String objects with all the rewards of this alert
Alert.prototype.getRewards = function() {
  var rewards = this.items;

  for(var i in this.countedItems) {
    rewards.push(this.countedItems[i].itemType);
  }

  return rewards;
}

Alert.prototype.isExpired = function() {
  return this.expiry.getTime() < Date.now();
}

module.exports = Alert;
