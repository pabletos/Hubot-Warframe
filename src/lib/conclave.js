var util = require('util');
var dsUtil = require('./_utils.js');
var conclaveData = require('./conclaveData.json');

/**
 * Create a new ConclaveChallenge instance
 *
 * @constructor
 * @param {object} data Challenges data
 */
var Challenges = function (data) {
  this.challenges = [];
  for (var index = 0; index < data.length; index++){
    var challenge = new Challenge(data[index]);
    if(!challenge.isAnyParamUndefined())
      this.challenges.push(challenge);
  }
}

/**
* Get the daily challenges
*
* @return a string of daily challenges
*/
Challenges.prototype.getDailies = function(){
  var dailies = '';
  this.challenges.forEach(function(challenge){
    if(challenge.isDaily()){
      dailies += challenge.toString();
    }
  });
  return dailies;
}

/**
* Get the weekly challenges
*
* @return a string of weekly challenges
*/
Challenges.prototype.getWeeklies = function(){
  var weeklies = '';
  this.challenges.forEach(function(challenge){
    if(!challenge.isAnyParamUndefined() && challenge.isWeekly()){
      weeklies += challenge.toString();
    }
  });
  return weeklies;
}

/**
* Get all challenges
*
* @return a string of weekly challenges
*/
Challenges.prototype.getAll = function(){
  var allString = '';
  this.challenges.forEach(function(challenge){
    allString += challenge.toString();
  });
  return allString;
}

/**
 * Create a new Challenge instance
 *
 * @constructor
 * @param {object} data Challenge data
 */
var Challenge = function(data) {
  try{
    if(!data.challengeTypeRefID || data.subChallenges.length > 0)
    {
      return;
    }
    this.id = data._id.$id;
    this.challengeRef = conclaveData.challenges[data.challengeTypeRefID].value;
    this.expiry = dsUtil.timeDeltaToString(data.endDate.sec - Date.now());
    this.endDate = data.endDate.sec;
    this.amount = parseInt(data.params[0].v);
    this.category = conclaveData.categories[data.Category].value;
    this.mode = conclaveData.modes[data.PVPMode].value;
  } catch (err) {
    console.log(JSON.stringify(data));
  } finally {
    return;
  }
}

/**
 * Check whether or not a challenge instance is a daily challenge or not
 *
 * @return {boolean} truthy if challenge is daily
 */
Challenge.prototype.isDaily = function(){
  return this.category == 'day';
}

/**
 * Check whether or not a challenge instance is a weekly challenge or not
 *
 * @return {boolean} truthy if challenge is weekly
 */
Challenge.prototype.isWeekly = function(){
  return this.category == 'week';
}

/**
 * Returns a string representation of this sortie object
 * 
 * @return (string) The new string object
 */
Challenge.prototype.toString = function () {
  return util.format('%s on %s %s times in a %s%s', this.challengeRef, this.mode, this.amount, this.category, dsUtil.lineEnd);
}

/**
 * Check whether or not a challenge is expired
 *
 * @return {boolean} truthy if challenge is expired
 */
Challenge.prototype.isExpired = function(){
  return this.endDate - Date.now() < 0;
}

/**
 * Check whether or not a challenge instance has any undefined parameters, 
 *   in which case it is either a root, invalid, or corrupted
 *
 * @return {boolean} truthy if challenge has any undefined parameters
 */
Challenge.prototype.isAnyParamUndefined = function () {
  return typeof this.id === "undefined" || typeof this.challengeRef === "undefined" || typeof this.expiry === "undefined" || typeof this.amount === "undefined" || typeof this.category === "undefined" || typeof this.mode === "undefined"
}

module.exports = Challenges;
