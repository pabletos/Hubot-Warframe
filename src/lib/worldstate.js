var request = require('request')

var Sorties = require('./sortie.js')
var Challenges = require('./conclave.js')
var Enemies = require('./persistentEnemy.js');
var Events = require('./events.js');


const platformURL = {
  PC: 'http://content.warframe.com/dynamic/worldState.php',
  PS4: 'http://content.ps4.warframe.com/dynamic/worldState.php',
  X1: 'http://content.xb1.warframe.com/dynamic/worldState.php'
}


function getWorldState(platform, callback) {
  request.get(platformURL[platform], function(err, response, body) {
    if(err) {
      return callback(err, null);
    }
    if(response.statusCode !== 200) {
      var error
      error = new Error(url + ' returned HTTP status ' + response.statusCode)
      return callback(error, null);
    }
    var data

    try {
      data = JSON.parse(body);
    } catch(e) {
      data = null;
    }

    if(!data) {
      var error
      error = new Error('Invalid JSON from ' + url);
      return callback(error, null);
    }
    callback(null, data);
  })
}

exports.getSortie = function(platform, callback) {
  getWorldState(platform, function(err, data) {
    if(err) {
      return callback(err);
    }
    callback(null, new Sorties(data.Sorties[0]).toString());
  });
}

exports.getConclaveDailies = function(platform, callback){
    getWorldState(platform, function(err, data){
        if(err) {
            return callback(err);
        }
        callback(null, new Challenges(data.PVPChallengeInstances).getDailies());
    });
}

exports.getConclaveWeeklies = function(platform, callback) {
    getWorldState(platform, function(err, data){
        if(err) {
            return callback(err);
        }
        callback(null, new Challenges(data.PVPChallengeInstances).getWeeklies());
    });
}

exports.getConclaveAll = function(platform, callback) {
    getWorldState(platform, function(err, data){
        if(err) {
            return callback(err);
        }
        callback(null, new Challenges(data.PVPChallengeInstances).getAll());
    });
}

exports.getPersistentEnemies = function(platform, callback) {
  getWorldState(platform, function(err, data){
        if(err) {
            return callback(err);
        }
        callback(null, new Enemies(data.PersistentEnemies).getAll());
    });
}

exports.getEvent = function(platform, callback) {
  getWorldState(platform, function(err, data){
        if(err) {
            return callback(err);
        }
        callback(null, new Evemts(data.Goals).getAll());
    });
}