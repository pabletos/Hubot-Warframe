# Description:
#   Display mission info at the user's request
#
# Dependencies:
#   None
#
# Configuration:
#   MONGODB_URL - MongoDB url
#
# Commands:
#   alerts - Display alerts
#   invasions - Display invasions
#   darvo - Display daily deals
#   news - Display news
#   baro - Display current Baro status/inventory
#
# Author:
#   nspacestd

Users = require('./lib/users.js')
ds = require('./lib/deathsnacks.js')

mongoURL = process.env.MONGODB_URL

module.exports = (robot) ->
  userDB = new Users(mongoURL)

  robot.respond /alerts/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getAlerts platform, (err, data) ->
          if err
            robot.logger.error err
          else
            message = (alert.toString() for alert in data).join('\n\n')
            res.send message

  robot.respond /invasions/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getInvasions platform, (err, data) ->
          if err
            robot.logger.error err
          else
            message = (invasion.toString() for invasion in data).join('\n\n')
            res.send message

  robot.respond /darvo/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getDeals platform, (err, data) ->
          if err
            robot.logger.error err
          else
            message = (deal.toString() for deal in data).join('\n\n')
            res.send message

  robot.respond /news/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getNews platform, (err, data) ->
          if err
            robot.logger.error err
          else
            if robot.adapterName is 'telegram'
              # Send with Markdown
              message = (news.toString(true, true) for news in data).join('\n\n')
              robot.emit 'telegram:invoke', 'sendMessage',
                chat_id: res.message.room
                text: message
                parse_mode: 'Markdown'
                disable_web_page_preview: true
              , (err, response) ->
                if err
                  robot.logger.error err

            # No Telegram
            else
              message = (news.toString(true, false) for news in data).join('\n\n')
              res.send message

  robot.respond /baro/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getBaro platform, (err, data) ->
          if err
            robot.logger.error err
          else
            res.send data.toString()

