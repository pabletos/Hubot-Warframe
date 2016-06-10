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
#   hubot alerts - Display alerts
#   hubot baro - Display current Baro status/inventory
#   hubot conclave - Display usage for conclave command
#   hubot conclave all - Display all conclave challenges
#   hubot conclave daily - Display active daily conclave challenges
#   hubot conclave weekly - Display active weekly conclave challenges
#   hubot darvo - Display daily deals
#   hubot enemies - Display list of active persistent enemies where they were last found
#   hubot event - Display information about current event
#   hubot invasions - Display invasions
#   hubot news - Display news
#   hubot primeaccess - Display current Prime Access news
#   hubot update - Display current update
#   hubot rewards - Display link to VoiD_Glitch's rewards table
#   hubot simaris - Display current Synthesis target
#   hubot sortie - Display current sortie missions
#
# Author:
#   nspacestd
#   aliasfalse

util = require('util')
md = require('hubot-markdown')

Users = require('./lib/users.js')
ds = require('./lib/deathsnacks.js')
Worldstate = require('warframe-worldstate-parser')
dsUtil = require('./lib/_utils.js')
#Parser = require('warframe-worldstate-parser')

mongoURL = process.env.MONGODB_URL

module.exports = (robot) ->
  userDB = new Users(mongoURL)
  
  worldStates = 
    PC: null
    PS4: null
    X1:  null
  
  checkWorldstate = (platform) ->
    if worldStates[platform] == null
      worldStates[platform] = new Worldstate(platform)
  
  robot.respond /alerts/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getAlerts platform, (err, data) ->
          if err
            robot.logger.error err
          else
            message =
              if data.length then (alert.toString() for alert in data).join('\n\n')
              else "#{md.codeMulti}Operator, there are no alerts at the moment#{md.blockEnd}"
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
            if data?
              res.send data.toString()
            else
              res.send util.format('%sNo info about Baro%s', md.codeMulti, md.blockEnd)  
  robot.respond /conclave(?:\s+([\w+\s]+))?/, (res) ->
    robot.logger.debug util.format('matched conclave command. matching string: %s', res.match[1])
    params = res.match[1]
    challengeFormat = '%s%s%s'
    noChallengeString = util.format('%sNo Challenges%s',  md.codeMulti, md.blockEnd)
    allRegExp = new RegExp(/^(all)$/)
    dailyRegExp = new RegExp(/^(daily)$/)
    weeklyRegExp = new RegExp(/^(weekly)$/)
    
    if allRegExp.test(params)
      robot.logger.debug 'Entered all challenge'
      userDB.getPlatform res.message.room, (err, platform) ->
        if err
          return robot.logger.error err
        checkWorldstate platform
        setTimeout (-> res.send worldStates[platform].getConclaveAllString()), 300
    else if dailyRegExp.test(params)
      robot.logger.debug 'Entered daily challenge'
      userDB.getPlatform res.message.room, (err, platform) ->
        if err
          return robot.logger.error err
        checkWorldstate platform
        setTimeout (-> res.send worldStates[platform].getConclaveDailiesString()), 300   
    else if weeklyRegExp.test(params)
      robot.logger.debug 'Entered weekly challenge'
      userDB.getPlatform res.message.room, (err, platform) ->
        if err
          return robot.logger.error err
        checkWorldstate platform
        setTimeout (-> res.send worldStates[platform].getConclaveWeekliesString()), 300

    else
      robot.logger.debug 'Entered null challenge'
      conclaveInstructAll = 'conclave all - print all conclave challenges.'
      conclaveInstructWeekly = 'conclave weekly - print weekly conclave challenges.'
      conclaveInstructDaily = 'conclave daily - print conclave daily challenges.'
      res.send util.format('%sPossible uses include:%s%s%s%s%s%s', 
                                    md.codeMulti, md.lineEnd, 
                                    conclaveInstructAll, md.lineEnd, 
                                    conclaveInstructWeekly, md.lineEnd, 
                                    conclaveInstructDaily, md.blockEnd)
  robot.respond /darvo/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getDeals platform, (err, data) ->
          if err
            robot.logger.error err
          else
            message =
              if data.length then(deal.toString() for deal in data).join('\n\n')
              else "#{md.codeMulti}Operator, there is no daily deal at the moment#{md.blockEnd}"

            res.send message

  robot.respond /enemies/, (res) ->
    robot.logger.debug 'Entered persistent enemies command'
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      checkWorldstate platform
      setTimeout (-> res.send worldStates[platform].getAllPersistentEnemiesString()), 300
            
  
  robot.respond /event/, (res) ->
    robot.logger.debug 'Entered events command'
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      checkWorldstate platform
      setTimeout (-> res.send worldStates[platform].getEventsString()), 300
  
  robot.respond /invasions/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getInvasions platform, (err, data) ->
          if err
            robot.logger.error err
          else
            message =
              if data.length then (invasion.toString() for invasion in data).join('\n\n')
              else "#{md.codeMulti}Operator, there are no invasions at the moment#{md.blockEnd}"
            res.send message  
  robot.respond /news/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      checkWorldstate platform
      setTimeout (-> res.send worldStates[platform].getNewsString()), 300
      
  robot.respond /primeaccess/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      checkWorldstate platform
      setTimeout (-> res.send worldStates[platform].getPrimeAccessString()), 300
  
  robot.respond /update/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      checkWorldstate platform
      setTimeout (-> res.send worldStates[platform].getUpdatesString()), 300

  robot.respond /rewards/, (res) ->
    res.send "#{md.codeMulti}#{md.linkBegin}Mission rewards#{md.linkMid}http://rewards.morningstar-wf.com#{md.linkEnd}#{md.blockEnd}"
    
  robot.respond /simaris/, (res) ->
    res.send "#{md.codeMulti}No info about Synthesis Targets, Simaris has left us alone#{md.blockEnd}"    
  robot.respond /sortie/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      checkWorldstate platform
      setTimeout (-> res.send worldStates[platform].getSortieString()), 300
