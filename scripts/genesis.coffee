# Description:
#   Warframe bot
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   help - Get help
#   alerts - Display alerts
#   invasions - Display invasions
#   news - Display news
#   baro - Display current Baro status/inventory
#   darvo - Display daily deals
#
# Author:

ds = require('./lib/deathsnacks.js')

module.exports = (robot) ->
  robot.hear /help/i, (res) ->
    res.send '/help - Show this\n' + \
             '/alerts - Show alerts\n' + \
             '/invasions - Show invasions\n' + \
             '/darvo - Show daily deals\n' + \
             '/news - Show news\n' + \
             '/baro - Show Baro status'

  robot.hear /alerts/i, (res) ->
    ds.getAlerts ds.PLATFORM.PC, (data) ->
      message = (alert.toString() for alert in data when not alert.isExpired())
      res.send message.join('\n\n')

  robot.hear /invasions/i, (res) ->
    ds.getInvasions ds.PLATFORM.PC, (data) ->
      message = (invasion.toString() for invasion in data)
      res.send message.join('\n\n')

  robot.hear /darvo/i, (res) ->
    ds.getDeals ds.PLATFORM.PC, (data) ->
      message = (deal.toString() for deal in data)
      res.send message.join('\n\n')

  robot.hear /news/i, (res) ->
    ds.getNews ds.PLATFORM.PC, (data) ->
      if robot.adapterName == 'telegram'
        message = (news.toString(true, true) for news in data)
        robot.emit('telegram:invoke', 'sendMessage', {chat_id: res.message.room, \
        text: message.join('\n\n'), parse_mode: 'Markdown', \
        disable_web_page_preview : 1}, (error, response) ->)
      else
        message = (news.toString(true, false) for news in data)
        res.send message.join('\n\n')

  robot.hear /baro/i, (res) ->
    ds.getBaro ds.PLATFORM.PC, (data) ->
      res.send data.toString()
