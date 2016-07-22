var MongoClient = require('mongodb').MongoClient;
var platforms = require('./deathsnacks.js').PLATFORM;
var rewardTypes = require('./reward.js').TYPES;

var USERS_COLLECTION = 'users';

/**
 * Create a new user database instance
 *
 * @constructor
 * @param {string} mongoURL MongoDB url
 */
var Users = function(mongoURL) {
  this.mongoURL = mongoURL;
}

// Array of reward types
var rewardTypeArray = Object.keys(rewardTypes).map(function(k){
	return rewardTypes[k]});

// Default settings for new users
Users.DEFAULT_SETTINGS = {
  platform: 'PC',
  items: [
    'alerts',
    'invasions',
    'news',
    'sorties',
    'fissures',
  ].concat(rewardTypeArray)
};

/**
 * Add new user to the database
 * If the user didn't exist before, true is passed to the callback
 *
 * @param {string} chatID ID of the user
 * @param {function} callback Callback function
 */
Users.prototype.add = function(chatID, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err, null);
    } else {
      var filter, update, options, c;

      c = db.collection(USERS_COLLECTION);

      filter = {
        chatID: chatID
      };

      update = {
        $setOnInsert: Users.DEFAULT_SETTINGS
      };

      options = {
        upsert: true
      };

      c.findOneAndUpdate(filter, update, options, function (err, r) {
        db.close();
        if(err) {
          callback(err, null);
        } else {
          if(!r.value) {
            // New user was added
            callback(null, true);
          } else {
            // Existing user
            callback(null, false);
          }
        }
      });
    }
  });
}

/**
 * Remove user from database
 *
 * @param {string} chatID ID of the user
 * @param {function} callback Callback function
 */
Users.prototype.remove = function(chatID, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err);
    } else {
      var query, c;

      c = db.collection(USERS_COLLECTION);

      query = {
        chatID: chatID
      };

      c.deleteOne(query, function(err, result) {
        db.close();
        callback(err);
      });
    }
  });
}

/**
 * Returns an user's settings, adds the user to the database
 * if it doesn't exist when insert is true
 *
 * @param {string} chatID ID of the user
 * @param {object} projection Query projection
 * @param {boolean} insert True to insert a non-existent user
 * @param {function} callback Callback function
 */
Users.prototype.getSettings = function(chatID, projection, insert, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err, null);
    } else {
      var filter, update, options, c;

      c = db.collection(USERS_COLLECTION);
      projection._id = false;

      filter = {
        chatID: chatID
      };

      if(insert) {
        update = {
          $setOnInsert: Users.DEFAULT_SETTINGS
        };

        options = {
          upsert: true,
          projection: projection,
          returnOriginal: false
        }

        c.findOneAndUpdate(filter, update, options, function(err, r) {
          db.close();
          if(err) {
            callback(err, null);
          } else {
            callback(null, r.value);
          }
        });
      } else {
        c.find(filter).limit(1).project(projection).next(function(err, doc) {
          db.close();
          if(err) {
            callback(err, null);
          } else {
            callback(null, doc);
          }
        });
      }
    }
  });
}

/**
 * Returns an user's platform, or the default if the user is not in the database.
 * Convenience method
 *
 * @param {string} chatID ID of the user
 * @param {function} callback Callback function
 */
Users.prototype.getPlatform = function(chatID, callback) {
  this.getSettings(chatID, {platform: true}, false, function(err, res) {
    if(err) {
      callback(err, null);
    } else {
      if(res) {
        callback(null, res.platform);
      } else {
        callback(null, Users.DEFAULT_SETTINGS.platform);
      }
    }
  });
}

/**
 * Returns an user's tracked items, creating a new entry if needed.
 * Convenience method
 *
 * @param {string} chatID ID of the user
 * @param {function} callback Callback function
 */
Users.prototype.getTrackedItems = function(chatID, callback) {
  this.getSettings(chatID, {items: true}, true, function(err, res) {
    if(err) {
      callback(err, null);
    } else {
      callback(null, res.items);
    }
  });
}

/**
 * Change an user's platform
 *
 * @param {string} ChatID ID of the user
 * @param {string} platform New platform
 * @param {function} callback Callback function
 */
Users.prototype.setPlatform = function(chatID, platform, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err, null);
    } else {
      var query, update, c;

      c = db.collection(USERS_COLLECTION);

      query = {
        chatID: chatID
      };

      update = {
        $set: {
          platform: platform
        }
      };

      c.updateOne(query, update, function(err, r) {
        db.close();
        callback(err);
      });
    }
  });
}

/**
 * Track/untrack an item for an user
 *
 * @param {string} ChatID ID of the user
 * @param {string} item Item to track/untrack
 * @param {boolean} value True to track, false to untrack
 * @param {function} callback Callback function
 */
Users.prototype.setItemTrack = function(chatID, item, value, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err, null);
    } else {
      var query, update, c;

      c = db.collection(USERS_COLLECTION);

      query = {
        chatID: chatID
      };
      
      if(value) {
      // Add a new tracked item
        if (item === 'all') {
          update = {
            $set: {
              items: Users.DEFAULT_SETTINGS.items
            }
          };
        } else {
          update = {
            $addToSet: {
              items: item
            }
          };
        }
      } else {
      // Remove a tracked item
        if (item === 'all') {
          update = {
            $set: {items: []}
          };
        } else {
          update = {
            $pull: {
              items: item
            }
          };
        }
      }

      c.updateOne(query, update, function(err, r) {
        db.close();
        callback(err);
      });
    }
  });
}

/**
 * Stop tracking everything for an user
 * Equivalent to untracking alerts, invasions and news
 *
 * @param {string} ChatID ID of the user
 * @param {function} callback Callback function
 */
Users.prototype.stopTrack = function(chatID, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err);
    } else {
      var query, update, c;

      c = db.collection(USERS_COLLECTION);

      query = {
        chatID: chatID
      };
      
      update = {
        $pullAll: {
          items: ['alerts', 'invasions', 'news']
        }
      };

      c.updateOne(query, update, function(err, r) {
        db.close();
        callback(err);
      });
    }
  });
}

/**
 * Broadcast a message to all the users matching a query
 * The callback is passed a different chat ID every time
 *
 * @param {object} query Query
 * @param {function} callback Callback function
 */
Users.prototype.broadcast = function(query, callback) {
  MongoClient.connect(this.mongoURL, function(err, db) {
    if(err) {
      callback(err, null);
    } else {
      var projection, c;

      projection = {
        chatID: true,
        _id: false
      };

      c = db.collection(USERS_COLLECTION);

      cursor = c.find(query).project(projection);

      cursor.each(function(err, user) {
        if(err) {
          callback(err, null);
        } else if(user !== null) {
          callback(null, user.chatID);
        } else {
          db.close();
        }
      });
    }
  });
}

module.exports = Users;
