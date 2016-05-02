var util = require('util');
var dsUtil = require('./_utils.js');
var persistentEnemyData = require('./persistentEnemyData.json');
var solNodes = require('./solNodes.json');
var strings = require(dsUtil.stringsPath);

/**
 * Create a new Enemies instance
 *
 * @constructor
 * @param {object} data PersistentEnemies data
 */
var Enemies = function (data) {
  this.enemies = [];
  for (var index = 0; index < data.length; index++){
    var enemy = new Enemy(data[index]);
    if(!enemy.isAnyParamUndefined())
      this.enemies.push(enemy);
  }
}

/**
* Get the daily challenges
*
* @return a string of daily challenges
*/
Enemies.prototype.getHidden = function(){
  var hidden = '';
  this.enemies.forEach(function(enemy){
    if(!enemy.isDiscovered){
      hidden += enemy.toString();
    }
  });
  return hidden;
}

/**
* Get the weekly challenges
*
* @return a string of weekly challenges
*/
Enemies.prototype.getDiscovered = function(){
  var discovered = '';
  this.enemies.forEach(function(enemy){
    if(enemy.isDiscovered){
      discovered += enemy.toString();
    }
  });
  return discovered;
}

Enemies.prototype.getAll = function(){
  var allString = '';
  this.enemies.forEach(function(enemy){
    allString += enemy.toString();
  });
  return allString;
}

/**
 * Create a new Enemy instance
 *
 * @constructor
 * @param {object} data Enemy data
 */
var Enemy = function(data) {
  try{
    if(!data)
    {
      return;
    }
    this.id = data._id.$id;
    this.agentType = strings[data.AgentType].name;
    this.locationTag = strings[data.LocTag].name;
    this.rank = data.Rank;
    this.healthPercent = parseFloat(data.HealthPercent);
    this.fleeDamage = parseFloat(data.FleeDamage);
    this.region = persistentEnemyData.regions[data.Region];
    this.lastDiscoveredAt = solNodes.nodes[data.LastDiscoveredLocation].value;
    this.isDiscovered = data.Discovered;
    this.isUsingTicketing = data.UseTicketing;
  } catch (err) {
    console.log(JSON.stringify(data));
    console.log(err);
  } finally {
    return;
  }
}

/**
 * Returns a string representation of this sortie object
 * 
 * @return (string) The new string object
 */
Enemy.prototype.toString = function () {
  return util.format('%s last discovered at %s (%s). %sIt has %d% health remaining and is currently %s%s', this.agentType, this.lastDiscoveredAt, this.region, dsUtil.lineEnd, this.healthPercent, this.isDiscovered ? 'discovered' : 'not discovered', dsUtil.lineEnd);
}

/**
 * Check whether or not a challenge instance has any undefined parameters, 
 *   in which case it is either a root, invalid, or corrupted
 *
 * @return {boolean} truthy if challenge has any undefined parameters
 */
Enemy.prototype.isAnyParamUndefined = function () {
  return typeof this.id === "undefined" 
    || typeof this.agentType === "undefined" 
    || typeof this.locationTag === "undefined" 
    || typeof this.rank === "undefined" 
    || typeof this.healthPercent === "undefined" 
    || typeof this.fleeDamage === "undefined"
    || typeof this.region === "undefined"
    || typeof this.lastDiscoveredAt === "undefined"
    || typeof this.isDiscovered === "undefined"
    || typeof this.isUsingTicketing === "undefined"
}

module.exports = Enemies;
