var https = require('https');

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

function getJSON(url, onResult) {
  https.get(url, function(res) {
    res.setEncoding('utf-8');
    var out = '';

    res.on('data', function(chunk) {
      out += chunk;
    });

    res.on('end', function() {
      data = JSON.parse(out);
      onResult(res.statusCode, data);
    });
  });
};

function getRaw(url, onResult) {
  https.get(url, function(res) {
    res.setEncoding('utf-8');
    var out = '';

    res.on('data', function(chunk) {
      out += chunk;
    });

    res.on('end', function() {
      data = out.split('\n');
      onResult(res.statusCode, data);
    });
  });
}

exports.getAlerts = function(platform, onResult) {
  getJSON(API_URL + platform + ALERT, function(statusCode, data) {
    var alerts = [];
    for(var i in data) {
        alerts.push(new Alert(data[i]))
    }
    onResult(alerts);
  });
}

exports.getInvasions = function(platform, onResult) {
  getJSON(API_URL + platform + INVASION, function(statusCode, data) {
    var invasions = [];
    for(var i in data) {
        invasions.push(new Invasion(data[i]))
    }
    onResult(invasions);
  });
}

exports.getDeals = function(platform, onResult) {
  getJSON(API_URL + platform + DEAL, function(statusCode, data) {
    var deals = [];
    for(var i in data) {
        deals.push(new Deal(data[i]))
    }
    onResult(deals);
  });
}

exports.getBaro = function(platform, onResult) {
  getJSON(API_URL + platform + BARO, function(statusCode, data) {
    onResult(new Baro(data[0]));
  });
}

exports.getNews = function(platform, onResult) {
  getRaw(API_URL + platform + NEWS, function(statusCode, data) {
    var news = [];
    data.pop();
    for(var i in data) {
        news.push(new News(data[i]))
    }
    onResult(news);
  });
}
