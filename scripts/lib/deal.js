var util = require('util');
var dsUtil = require('./_utils.js');

var Deal = function(data) {
  this.id = data._id;
  this.item = data.StoreItem;
  this.expiry = new Date(1000 * data.Expiry.sec);
  this.originalPrice = data.OriginalPrice;
  this.salePrice = data.SalePrice;
  this.total = data.AmountTotal;
  this.sold = data.AmountSold;
}

Deal.prototype.toString = function() {
  var dealString = util.format('Daily Deal: %s\n' +
                               '%dp (original %dp)\n' +
                               '%d / %d sold\n' +
                               'Expires in %s',
                               this.item, this.salePrice, this.originalPrice,
                               this.sold, this.total, this.getETAString());
  return dealString;
}

Deal.prototype.getETAString = function() {
  return dsUtil.timeDeltaToString(this.expiry.getTime() - Date.now());
}

module.exports = Deal;
