# Description:
#   Miscellaneous commands
#
# Dependencies:
#   None
#
# Configuration:
#   MONGODB_URL - MongoDB url
#
# Commands:
#   hubot start - Add user to database and start tracking
#   hubot stop - Turn off notifications
#
# Author:
#   nspacestd

Users = require('./lib/users.js')

mongoURL = process.env.MONGODB_URL

module.exports = (robot) ->
  userDB = new Users(mongoURL)

#  robot.respond /help/, (res) ->
#    res.send '/help - Show this\n' + \
#             '/alerts - Show alerts\n' + \
#             '/invasions - Show invasions\n' + \
#             '/darvo - Show daily deals\n' + \
#             '/news - Show news\n' + \
#             '/baro - Show Baro status\n' + \
#             '/settings - Change bot settings\n' + \
#             '/stop - Stop all tracking'

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
    userDB.stopTrack res.message.room, (err) ->
      if err
        robot.logger.error err
      else
        res.send 'Tracking stopped'

  if robot.adapterName is 'telegram'
    # Remove chat from the database when the bot is kicked, Telegram only
    robot.leave (res) ->
      if res.message.user.id is robot.adapter.bot_id
        userDB.remove res.message.room, (err) ->
          robot.logger.error err if err

    robot.enter (res) ->
      if res.message.user.id is robot.adapter.bot_id
        res.send 'Hello, Operator! Please type /start to begin tracking.'