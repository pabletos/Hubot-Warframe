var request = require('request');

var Alert = require('./alert.js');
var Invasion = require('./invasion.js');
var Deal = require('./deal.js');
var Baro = require('./baro.js');
var News = require('./news.js');

const API_URL = 'https://deathsnacks.com/wf/data/'
const INVASION  = 'invasion.json';
const ALERT  = 'last15alerts_localized.json';
const DEAL  = 'daily_deals.json';
const NEWS  = 'news_raw.txt';
const LIBRARY  = 'library_target.json';
const BARO  = 'voidtraders.json';

exports.PLATFORM = {
  PC : '',
  PS4 : 'ps4/',
  X1 : 'xbox/'
}

/**
 * Return object parsed from JSON at url. Convenience function
 *
 * @param {string}   url      The request url
 * @param {function} callback Callback function
 */
function getJSON(url, callback) {
  request.get(url, function(err, response, body) {
    if(err) {
      callback(err, null);
    } else if(response.statusCode !== 200) {
      var error;
      error = new Error(url + ' returned HTTP status ' + responde.statusCode);
      callback(error, null);
    } else {
      var data;

      try {
        data = JSON.parse(body);
      } catch(e) {
        data = null;
      }

      if(!data) {
        var error;
        error = new Error('Invalid JSON from ' + url);
        callback(error, null);
      } else {
        callback(null, data);
      }
    }
  });
};

/**
 * Return text at url as an array of strings, one per line. Convenience function
 *
 * @param {string}   url      The request url
 * @param {function} callback Callback function
 */
function getRaw(url, callback) {
  request.get(url, function(err, response, body) {
    if(err) {
      callback(err, null);
    } else if(response.statusCode !== 200) {
      var error;
      error = new Error(url + ' returned HTTP status' + response.statusCode);
      callback(err, null);
    } else {
      var data;
      data = body.split('\n');
      callback(null, data);
    }
  });
}

/**
 * Return an array of Alert objects representing currently active alerts
 * on a given platform.
 *
 * @param {string}   platform   The platform, must be an element of PLATFORMS
 * @param {function} callback   Callback function
 */
exports.getAlerts = function(platform, callback) {
  getJSON(API_URL + platform + ALERT, function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      var alerts = [], newAlert;
      for(var i in data) {
        newAlert = new Alert(data[i]);
        if(!newAlert.isExpired()) {
          alerts.push(newAlert)
        }
      }
      callback(null, alerts);
    }
  });
}

/**
 * Return an array of Invasion objects representing currently active invasions
 * on a given platform.
 *
 * @param {string}   platform   The platform, must be an element of PLATFORMS
 * @param {function} callback   Callback function
 */
exports.getInvasions = function(platform, callback) {
  getJSON(API_URL + platform + INVASION, function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      var invasions = [];
      for(var i in data) {
          invasions.push(new Invasion(data[i]))
      }
      callback(null, invasions);
    }
  });
}

/**
 * Return an array of Deal objects representing currently active deals
 * on a given platform.
 *
 * @param {string}   platform   The platform, must be an element of PLATFORMS
 * @param {function} callback   Callback function
 */
exports.getDeals = function(platform, callback) {
  getJSON(API_URL + platform + DEAL, function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      var deals = [];
      for(var i in data) {
          deals.push(new Deal(data[i]))
      }
      callback(null, deals);
    }
  });
}

/**
 * Return a Baro object containting info about the Void Trader
 * on a given platform.
 *
 * @param {string}   platform   The platform, must be an element of PLATFORMS
 * @param {function} callback   Callback function
 */
exports.getBaro = function(platform, callback) {
  getJSON(API_URL + platform + BARO, function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, new Baro(data[0]));
    }
  });
}

/**
 * Return an array of News objects representing currently active news
 * on a given platform.
 *
 * @param {string}   platform   The platform, must be an element of PLATFORMS
 * @param {function} callback   Callback function
 */
exports.getNews = function(platform, callback) {
  getRaw(API_URL + platform + NEWS, function(err, data) {
    if(err) {
      callback(err, null);
    } else {
      var news = [];
      // Discard last (empty) line
      data.pop();
      for(var i in data) {
          news.push(new News(data[i]))
      }
      callback(null, news);
    }
  });
}
