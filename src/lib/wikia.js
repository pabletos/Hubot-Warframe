var request = require('request');

const WIKIA_URL = 'http://warframe.wikia.com/api/v1/';
const SEARCH = 'Search/List';

exports.wikiaSearch = function(query, callback) {
  var formData = {query: query, limit: 1};
  var url = WIKIA_URL + SEARCH;

  request.post(WIKIA_URL + SEARCH, {form: formData}, function(err, response, body) {
    if(err) {
      callback(err, null);
    } else if (response.statusCode === 404) {
      callback(null, null);
    } else if (response.statusCode !== 200) {
      var error;
      error = new Error(url + ' returned HTTP status ' + response.statusCode);
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
        callback(null, data.items[0]);
      }
    }
  });
}
