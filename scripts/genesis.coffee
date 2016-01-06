# Description:
#   Basic bot commands
#
# Dependencies:
#   None
#
# Configuration:
#   MONGODB_URL - MongoDB url
#
# Commands:
#   help - Get help
#   alerts - Display alerts
#   invasions - Display invasions
#   news - Display news
#   baro - Display current Baro status/inventory
#   darvo - Display daily deals
#   start - Add user to database and start tracking
#   stop - Turn off notifications
#
# Author:
#   nspacestd

Users = require('./lib/users.js')
ds = require('./lib/deathsnacks.js')

mongoURL = process.env.MONGODB_URL

module.exports = (robot) ->
  userDB = new Users(mongoURL)

  # The robot's own user id (telegram only)
  if robot.adapterName is 'telegram'
    token = process.env.TELEGRAM_TOKEN
    selfID = token.slice 0, token.indexOf(':')

  robot.respond /help/, (res) ->
    res.send '/help - Show this\n' + \
             '/alerts - Show alerts\n' + \
             '/invasions - Show invasions\n' + \
             '/darvo - Show daily deals\n' + \
             '/news - Show news\n' + \
             '/baro - Show Baro status\n' + \
             '/settings - Change bot settings\n' + \
             '/stop - Stop all tracking'

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

  robot.respond /start/, (res) ->
    userDB.add res.message.room, (err, result) ->
      if err
        robot.logger.error err
      else
        if result
          res.send 'Tracking started'
        else
          res.send 'Already tracking'

  robot.respond /stop/, (res) ->
    userDB.stopTrack res.message.room, (err, result) ->
      if err
        robot.logger.error err
      else
        res.send 'Tracking stopped'

  robot.leave (res) ->
    if selfID? and res.message.user.id is selfID
      userDB.remove res.message.room
