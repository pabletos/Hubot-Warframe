# Description:
#   Allows each user to customize their platform and tracked events/rewards
#
# Dependencies:
#   None
#
# Configuration:
#   MONGODB_URL - MongoDB url
#   HUBOT_LINE_END - Configuragble line-return character
#   HUBOT_BLOCK_END - Configuragble string for ending blocks
#   HUBOT_DOUBLE_RET - Configurable string for double-line returns
# 
# Commands:
#   hubot settings - Display settings menu
#   hubot platform <platform> - Change platform or display menu if no argument
#   hubot track <reward or event> - Start tracking reward or event, menu if no argument
#   hubot untrack <reward or event> - Stop tracking reward or event
#   hubot end (telegram only) - Hide custom keyboard
#   hubot notify <reward or event> <message> - notify reward or event with a message added on the beginning
#
# Author:
#   nspacestd

platforms = require('./lib/platforms.json')
Reward = require('./lib/reward.js')
Users = require('./lib/users.js')

mongoURL = process.env.MONGODB_URL
trackingUpdated = 'Tracking settings updated\n\nChoose one' 

TRACKABLE = (v for k, v of Reward.TYPES).concat ['alerts', 'invasions', 'news', 'sorties', 'fissures', 'baro', 'darvo', 'all']

module.exports = (robot) ->
  userDB = new Users(mongoURL)

  robot.respond /settings/i, (res) ->
    userDB.getSettings res.message.room, {}, true, (err, settings) ->
      if err
        robot.logger.error err
      else
        text = settingsToString settings
        keys = ['platform', 'track']
        replyWithKeyboard robot, res, text, keys

  robot.respond /platform\s*(\w+)?/, (res) ->
    platform = res.match[1]
    if not platform
      text = 'Choose your platform'
      keys = ('platform ' + k for k in platforms)
      replyWithKeyboard robot, res, text, keys
    else if platform in platforms
      userDB.setPlatform res.message.room, platform, (err) ->
        if err
          robot.logger.error err
        else
          res.reply 'Platform changed to ' + platform
    else
      res.reply 'Invalid platform'

  robot.respond /track\s*(\w+)?/, (res) ->
    type = res.match[1]
    if not type
      replyWithTrackSettingsKeyboard robot, res, 'Choose one', userDB
    else if type in TRACKABLE
      userDB.setItemTrack res.message.room, type, true, (err) ->
        if err
          robot.logger.error err
        else
          replyWithTrackSettingsKeyboard robot, res, trackingUpdated, userDB
    else
      res.reply 'Invalid argument'
          
  robot.respond /untrack\s+(\w+)/, (res) ->
    type = res.match[1]
    if type in TRACKABLE
      userDB.setItemTrack res.message.room, type, false, (err) ->
        if err
          robot.logger.error err
        else
          replyWithTrackSettingsKeyboard robot, res, trackingUpdated, userDB
    else
      res.reply 'Invalid argument'

  # Telegram only
  if robot.adapterName is 'telegram'
    robot.respond /end/, (res) ->
      opts =
        chat_id: res.message.room
        text: 'Done'
        reply_markup:
          hide_keyboard: true
          selective: true
        reply_to_message_id: res.message.id

      robot.emit 'telegram:invoke', 'sendMessage', opts, (err, response) ->
        robot.logger.error err if err

replyWithKeyboard = (robot, res, text, keys) ->
  ###
  # Reply to res.message with a custom keyboard. Text is the text of the message,
  # keys is an array of strings, each one being a key
  #
  # @param object robot
  # @param object res
  # @param string text
  # @param array keys
  ###
  
  # Add robot name or alias at the beginning of each key
  name = robot.alias or (robot.name + ' ')
  keys = (name + k for k in keys)

  if robot.adapterName is 'telegram'
    keys.push('/end')

    # Divide keys in rows of 3 or less
    keyboard = while keys.length > 4
      keys.splice(0, 3)
    keyboard.push keys

    opts =
      chat_id: res.message.room
      text: text
      reply_markup: 
        keyboard: keyboard
        one_time_keyboard: true
        selective: true
      reply_to_message_id: res.message.id

    robot.emit 'telegram:invoke', 'sendMessage', opts, (err, response) ->
      robot.logger.error err if err
  else
    # Non-telegram adapter, send a list of commands
    res.reply text + '\n\n' + keys.join('\n')

settingsToString = (settings) ->
  ###
  # Return a string representation of an user's current settings
  #
  # @param object settings
  #
  # @return string
  ###
  
  lines = []

  lines.push 'Your platform is ' + settings.platform.replace('X1', 'Xbox One')

  lines.push 'Alerts are ' + if 'alerts' in settings.items then 'ON' else 'OFF'
  lines.push 'Invasions are ' + if 'invasions' in settings.items then 'ON' else 'OFF'
  lines.push 'News are ' + if 'news' in settings.items then 'ON' else 'OFF'
  lines.push 'Sorties are ' + if 'sorties' in settings.items then 'ON' else 'OFF'
  lines.push 'Fissures are ' + if 'fissures' in settings.items then 'ON' else 'OFF'
  lines.push 'Baro Ki\'Teer tracking is ' + if 'baro' in settings.items then 'ON' else 'OFF'
  lines.push 'Darvo tracking is ' + if 'darvo' in settings.items then 'ON' else 'OFF'
  
  lines.push '\nTracked rewards:'

  trackedRewards = for i in settings.items when i not in \
    ['alerts', 'invasions', 'news', 'sorties', 'fissures', 'baro', 'darvo']
      Reward.typeToString(i)

  return lines.concat(trackedRewards).join('\n')

replyWithTrackSettingsKeyboard = (robot, res, text, userDB) ->
  ###
  # Send a track/untrack keyboard to the sender of res.message, based on his
  # current settings. Convenience function
  #
  # @param object robot
  # @param object res
  # @param string text
  # @param object userDB
  ###
  userDB.getTrackedItems res.message.room, (err, tracked) ->
    if err
      robot.logger.error err
    else
      keys = for t in TRACKABLE
              if t in tracked then 'untrack ' + t
              else 'track ' + t
      
      replyWithKeyboard robot, res, text, keys
