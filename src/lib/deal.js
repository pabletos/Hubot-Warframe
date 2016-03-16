var util = require('util');
var dsUtil = require('./_utils.js');

/**
 * Create a new deal instance
 *
 * @constructor
 * @param {object} data Deal data
 */
var Deal = function(data) {
  this.id = data._id;
  this.item = data.StoreItem;
  this.expiry = new Date(1000 * data.Expiry.sec);
  this.originalPrice = data.OriginalPrice;
  this.salePrice = data.SalePrice;
  this.total = data.AmountTotal;
  this.sold = data.AmountSold;
}

/** Return a string representation of the deal
 *
 * @return {string} The new string
 */
Deal.prototype.toString = function() {
  var dealString = util.format('Daily Deal: %s%s' +
                               '%dp (original %dp)%s' +
                               '%d / %d sold%s' +
                               'Expires in %s',
                               this.item, dsUtil.lineEnd,
                               this.salePrice, this.originalPrice, dsUtil.lineEnd,
                               this.sold, this.total, dsUtil.lineEnd,
                               this.getETAString(), dsUtil.blockEnd);
  return dealString;
}

/**
 * Return how much time is left before the deal expires
 *
 * @return {string} Deal ETA
 */
Deal.prototype.getETAString = function() {
  return dsUtil.timeDeltaToString(this.expiry.getTime() - Date.now());
}

module.exports = Deal;
