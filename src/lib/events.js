var util = require('util');
var dsUtil = require('./_utils.js');
var eventsData = require('./eventsData.json');
var solNodes = require('./solNodes.json');
var factions = require('./factionsData.json').factions;
var strings = require(dsUtil.stringsPath);

/**
 * Create a new Events instance
 *
 * @constructor
 * @param {object} data Goals data
 */
var Events = function (data) {
  this.events = [];
  for (var index = 0; index < data.length; index++){
    var event = new Event(data[index]);
    if(!event.isAnyParamUndefined())
      this.events.push(event);
  }
}

/**
 * Returns a string representation of this Events object
 * 
 * @return (string) The new string object
 */
Events.prototype.toString = function(){
  var eventsString = dsUtil.codeMulti;
  for(var eventsInd = 0; eventsInd < this.events.length; eventsInd++){
    eventsString += events[0].toString();
  }
  eventsString += dsUtil.blockEnd;
  return eventsString;
}


/**
 * Create a new Enemy instance
 *
 * @constructor
 * @param {object} data Enemy data
 */
var Event = function(data) {
  try{
    if(!data)
    {
      return;
    }
    this.id = data._id.$id;
    this.expiry = new Date(1000 * data.Expiry.sec);
    this.tag = eventsData.tags[data.Tag].value;
    this.maximumScore = data.Goal;
    this.smallInterval = data.GoalInterim;
    this.largeInterval = data.GoalInterim2;
    this.faction = factions[data.Faction].value;
    this.description = strings[data.Desc].value;
    this.node = solNodes[data.Node].value;
    this.nodes = [];
    for(var indexNodes = 0; indexNodes<data.ConcurrentNodes.length; indexNodes++){
      this.nodes.push(solNodes[data.ConcurrentNodes[indexNodes]].value);
    }
    this.scoreVariable = eventsData.scoreVariables[data.ScoreVar].value;
    this.scoreMaximumTag = eventsData.scoreMaxTags[data.ScoreMaxTag].value;
    this.scoreLocTag = eventsData.scoreLogTags[data.ScoreLogTag].value;
    this.rewards = []
    
    for (var k in data) {
      if (k.indexOf('RewardInterim') !== -1) {
        this.rewards.push(new Reward(k.credits
          , k.xp
          , k.items
          , k.countedItems));
      }
    }

  } catch (err) {
    console.log(JSON.stringify(data));
    console.log(err);
  } finally {
    return;
  }
}

/**
 * Returns a string representation of this event object
 * 
 * @return (string) The new string object
 */
Event.prototype.toString = function () {
  return util.format('%s', dsUtil.lineEnd);
}

/** Returns true if the sortie has expired, false otherwise
 *
 * @return {boolean} Expired-ness of the sortie
 */
Event.prototype.isExpired = function() {
  return this.expiry.getTime() < Date.now()
}

/**
 * Check whether or not a Event instance has any undefined parameters, 
 *   in which case it is either a root, invalid, or corrupted
 *
 * @return {boolean} truthy if challenge has any undefined parameters
 */
Event.prototype.isAnyParamUndefined = function () {
  return typeof this.id === "undefined" 
    || typeof this.tag === "undefined"
    || typeof this.maximumScore === "undefined"
    || typeof this.smallInterval === "undefined"
    || typeof this.largeInterval === "undefined"
    || typeof this.faction === "undefined"
    || typeof this.description === "undefined"
    || typeof this.node === "undefined"
    || typeof this.nodes === "undefined"
    || typeof this.scoreVariable === "undefined"
    || typeof this.scoreMaximumTag === "undefined"
    || typeof this.scoreLocTag === "undefined"
    || this.rewards.length < 1
  
}


var Reward = function(credits, xp, itemStrings, countedItemStrings) {
  this.credits = credits;
  this.xp = xp;
  this.items = [];
  for (var indexItems = 0; indexItems < itemStrings.length; indexItems++) {
    this.items.push(strings[itemStrings[indexItems].toLowerCase()].name);
  }
  this.countedItems = [];
  for (var indexCountedItems = 0; indexCountedItems < countedItemStrings.length; indexCountedItems++) {
    this.countedItems.push(strings[countedItemStrings[indexItems].toLowerCase()].name);
  }
}

Reward.prototype.toString = function() {
  var rewardString = '';
  if (this.credits) {
    rewardString += '#{this.credits}cr ';
  }
  if(this.xp) {
    rewardString += '#{this.xp} affinity ';
  }
  if(this.items.length > 0){
    this.items.forEach(function(item){
      rewardString += '#{item} ';
    });
  }
  if(this.countedItems.length > 0){
    this.countedItems.forEach(function(countedItem){
      rewardString += '#{countedItem} ';
    });
  }
}

module.exports = Events;
