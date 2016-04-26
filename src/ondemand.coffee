# Description:
#   Display mission info at the user's request
#
# Dependencies:
#   None
#
# Configuration:
#   MONGODB_URL - MongoDB url
#   HUBOT_LINE_END - Configuragble line-return character
#   HUBOT_BLOCK_END - Configuragble string for ending blocks
#   HUBOT_DOUBLE_RET - Configurable string for double-line returns
#   HUBOT_MD_LINK_BEGIN - Configurable string for double-line returns
#   HUBOT_MD_LINK_MID - Configurable string for double-line returns
#   HUBOT_MD_LINK_END - Configurable string for double-line returns
#   HUBOT_MD_BOLD - Configurable string for double-line returns
#   HUBOT_MD_ITALIC - Configurable string for double-line returns
#   HUBOT_MD_UNDERLINE - Configurable string for double-line returns
#   HUBOT_MD_STRIKE - Configurable string for double-line returns
#   HUBOT_MD_CODE_SINGLE - Configurable string for double-line returns
#   HUBOT_MD_CODE_BLOCK - Configurable string for double-line returns
#
# Commands:
#   hubot alerts - Display alerts
#   hubot invasions - Display invasions
#   hubot darvo - Display daily deals
#   hubot news - Display news
#   hubot baro - Display current Baro status/inventory
#   hubot sortie - Display current sortie missions
#   hubot simaris - Display current Synthesis target
#   hubot update - Display current update
#   hubot primeaccess - Display current Prime Access news
#   hubot chart - Display link to Warframe progression chart
#   hubot damage - Display link to Damage 2.0 infographic
#   hubot armor - Display instructions for calculating armor
#   hubot armor <current armor> - Display current damage resistance and amount of corrosive procs required to strip it
#   hubot armor <base armor> <base level> <current level> - Display the current armor, damage resistance, and necessary corrosive procs to strip armor.
#   hubot shield - Display instructions for calculating shields
#   hubot shield <base shields> <base level> <current level> - Display the current shields.
#   hubot conclave - Display usage for conclave command
#   hubot conclave all - Display all conclave challenges
#   hubot conclave daily - Display active daily conclave challenges
#   hubot conclave weekly - Display active weekly conclave challenges
#   hubot enemies - Display list of active persistent enemies where they were last found
#   hubot rewards - Display link to VoiD_Glitch's rewards table
#
# Author:
#   nspacestd
#   aliasfalse

util = require('util')

Users = require('./lib/users.js')
ds = require('./lib/deathsnacks.js')
ws = require('./lib/worldstate.js')
wikia = require('./lib/wikia.js')
dsUtil = require('./lib/_utils.js')

mongoURL = process.env.MONGODB_URL

module.exports = (robot) ->
  armorTriggered = false
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
            message =
              if data.length then (alert.toString() for alert in data).join('\n\n')
              else util.format('%sThere are no alerts at the moment%s', dsUtil.codeMulti, dsUtil.blockEnd)
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
            message =
              if data.length then (invasion.toString() for invasion in data).join('\n\n')
              else util.format('%sThere are no invasions at the moment%s', dsUtil.codeMulti, dsUtil.blockEnd)
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
            message =
              if data.length then(deal.toString() for deal in data).join('\n\n')
              else util.format('%sThere is no daily deal at the moment%s', dsUtil.codeMulti, dsUtil.blockEnd)
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
            if data.length
              if robot.adapterName is 'telegram'
                # Send with Markdown
                message = (news.toString(true, true) for news in data).join('\n\n')
                robot.emit 'telegram:invoke', 'sendMessage',
                  chat_id: res.message.room
                  text: message
                  parse_mode: 'Markdown'
                  disable_web_page_preview: 1
                , (err, response) ->
                  if err
                    robot.logger.error err

              # No Telegram
              else
                message = (news.toString(true, false) for news in data).join('\n\n')
                res.send message
            # No news
            else
              res.send util.format('%sThere is no news at the moment%s', dsUtil.codeMulti, dsUtil.blockEnd)
              
  robot.respond /update/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getUpdate platform, (err, data) ->
          if err
            robot.logger.error err
          else
            if data.length
              message = (update.toString(true, false) for update in data).join('\n\n')
              res.send message
            # No updates
            else
              res.send util.format('%sThere are no updates at the moment%s', dsUtil.codeMulti, dsUtil.blockEnd)
  
  robot.respond /primeaccess/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        robot.logger.error err
      else
        ds.getPrimeAccess platform, (err, data) ->
          if err
            robot.logger.error err
          else
            if data.length
              message = (access.toString(true, false) for access in data).join('\n\n')
              res.send message
            # No prime access news
            else
              res.send util.format('%sThere there is no information pertaining to Prime Access at the moment%s', dsUtil.codeMulti, dsUtil.blockEnd)

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
              res.send util.format('%sNo info about Baro%s', dsUtil.codeMulti, dsUtil.blockEnd)

  robot.respond /wiki\s*([\w\s-]+)?/, (res) ->
    query = res.match[1]
    if not query
      res.reply 'Please specify a search term'
    else
      wikia.wikiaSearch query, (err, data) ->
        if err
          robot.logger.error err
        else if not data
          res.reply util.format('%sNot found%s', dsUtil.codeMulti, dsUtil.blockEnd)
        else 
          res.send util.format('%s%s%s%s%s%s%s', dsUtil.codeMulti, dsUtil.linkBegin, data.title, dsUtil.linkMid, 
            data.url.replace('\\', ''), dsUtil.linkEnd, dsUtil.blockEnd)
  
  robot.respond /sortie/, (res) ->
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
        return robot.logger.error err
      ws.getSortie platform, (err, sortie) ->
        if err 
          return robot.logger.error err
        res.send sortie
      
  robot.respond /simaris/, (res) ->
    res.send util.format('%sNo info about Synthesis Targets, Simaris has left us alone%s', dsUtil.codeMulti, dsUtil.blockEnd)
        
  robot.respond /chart/, (res) ->
    res.send util.format('%s%s%s%s%s%s%s', dsUtil.codeMulti, dsUtil.linkBegin, 'Chart', dsUtil.linkMid, 'http://morningstar-wf.com/chart/chart-6.png', dsUtil.linkEnd, dsUtil.blockEnd)

  robot.respond /damage/, (res) ->
    courtesy = util.format('courtesy %s Telkhines %shttps://forums.warframe.com/profile/713011-telkhines/%s', 
                                     dsUtil.linkBegin, dsUtil.linkMid, dsUtil.linkEnd)
    
    res.send util.format('%s%s%s%s%s%s%s%s%s', dsUtil.codeMulti, dsUtil.linkBegin, 'Damage 2.0', 
                         dsUtil.linkMid, 'http://morningstar-wf.com/chart/Damage_2.0_Resistance_Flowchart.png', 
                         dsUtil.linkEnd, dsUtil.lineEnd, 
                         courtesy, dsUtil.blockEnd)
  
   robot.respond /armor(?:\s+([\d\s]+))?/, (res) ->
    pattern3Params = new RegExp(/^(\d+)(?:\s+(\d+)\s+(\d+))?$/)
    pattern1Param = new RegExp(/^(\d+)$/)
    robot.logger.debug util.format('matched armor command. matching string: %s', res.match[1])
    params = res.match[1]
    
    if pattern3Params.test(params)
      armor = params.match(pattern3Params)[1]
      baseLevel = params.match(pattern3Params)[2]
      currentLevel = params.match(pattern3Params)[3]
      
      if(typeof baseLevel == 'undefined')
        robot.logger.debug 'Entered 1-param armor'
        armorString = util.format('%s%s%s %s %s',
                                dsUtil.codeMulti, dsUtil.damageReduction(armor), 
                                dsUtil.lineEnd, dsUtil.armorStrip(armor), dsUtil.blockEnd)
      else
        robot.logger.debug 'Entered 3-param armor'
        armorString = util.format('%s%s%s', 
                                dsUtil.codeMulti, dsUtil.armorFull(armor, baseLevel, currentLevel), 
                                dsUtil.blockEnd)

            
    else
      robot.logger.debug 'Entered 0-param armor'
      armorInstruct3 = 'armor (Base Armor) (Base Level) (Current Level) calculate armor and stats.'
      armorInstruct1 = 'armor (Current Armor) Calculate damage resistance.'
      armorString = util.format('%sPossible uses include:%s%s%s%s%s', 
                                dsUtil.codeMulti, dsUtil.lineEnd, 
                                armorInstruct3, dsUtil.lineEnd, 
                                armorInstruct1, dsUtil.blockEnd)
    res.send armorString
   
  robot.respond /shield(?:\s+([\d\s]+))?/, (res) ->
    pattern3Params = new RegExp(/^(\d+)(?:\s+(\d+)\s+(\d+))?$/)
    robot.logger.debug util.format('matched shield command. matching string: %s', res.match[1])
    params = res.match[1]
    
    if pattern3Params.test(params)
      shields = params.match(pattern3Params)[1]
      baseLevel = params.match(pattern3Params)[2]
      currentLevel = params.match(pattern3Params)[3]
      
      robot.logger.debug 'Entered 3-param shield'
      shieldString = dsUtil.shieldString dsUtil.shieldCalc(shields, baseLevel, currentLevel), currentLevel    
    else
      robot.logger.debug 'Entered 0-param shield'
      shieldInstruct3 = 'shields (Base Shelds) (Base Level) (Current Level) calculate shields and stats.'
      shieldString = util.format('%sPossible uses include:%s%s%s', 
                                dsUtil.codeMulti, dsUtil.lineEnd, 
                                shieldInstruct3, dsUtil.blockEnd)
    res.send shieldString
    
  robot.respond /conclave(?:\s+([\w+\s]+))?/, (res) ->
    robot.logger.debug util.format('matched conclave command. matching string: %s', res.match[1])
    params = res.match[1]
    challengeFormat = '%s%s%s'
    noChallengeString = util.format('%sNo Challenges%s',  dsUtil.codeMulti, dsUtil.blockEnd)
    allRegExp = new RegExp(/^(all)$/)
    dailyRegExp = new RegExp(/^(daily)$/)
    weeklyRegExp = new RegExp(/^(weekly)$/)
    
    
    if allRegExp.test(params)
      robot.logger.debug 'Entered all challenge'
      userDB.getPlatform res.message.room, (err, platform) ->
        if err
          return robot.logger.error err
        ws.getConclaveAll platform, (err, challenge) ->
          if err 
            res.send
            return robot.logger.error err
          if challenge != ''
            res.send util.format(challengeFormat, dsUtil.codeMulti, challenge, dsUtil.blockEnd)
          else
            res.send noChallengeString
    
    else if dailyRegExp.test(params)
      robot.logger.debug 'Entered daily challenge'
      userDB.getPlatform res.message.room, (err, platform) ->
        if err
          return robot.logger.error err
        ws.getConclaveDailies platform, (err, challenge) ->
          if err 
            return robot.logger.error err
          if challenge != ''
            res.send util.format(challengeFormat, dsUtil.codeMulti, challenge, dsUtil.blockEnd)
          else
            res.send noChallengeString
    
    else if weeklyRegExp.test(params)
      robot.logger.debug 'Entered weekly challenge'
      userDB.getPlatform res.message.room, (err, platform) ->
        if err
          return robot.logger.error err
        ws.getConclaveWeeklies platform, (err, challenge) ->
          if err
            return robot.logger.error err
          if challenge != ''
            res.send util.format(challengeFormat, dsUtil.codeMulti, challenge, dsUtil.blockEnd)
          else
            res.send noChallengeString
    else
      robot.logger.debug 'Entered null challenge'
      conclaveInstructAll = 'conclave all - print all conclave challenges.'
      conclaveInstructWeekly = 'conclave weekly - print weekly conclave challenges.'
      conclaveInstructDaily = 'conclave daily - print conclave daily challenges.'
      res.send util.format('%sPossible uses include:%s%s%s%s%s%s', 
                                    dsUtil.codeMulti, dsUtil.lineEnd, 
                                    conclaveInstructAll, dsUtil.lineEnd, 
                                    conclaveInstructWeekly, dsUtil.lineEnd, 
                                    conclaveInstructDaily, dsUtil.blockEnd)
  robot.respond /enemies/, (res) ->
    robot.logger.debug 'Entered persistent enemies command'
    noEnemiesString = util.format '%sOperator, there is no sign of enemies, stay alert.%s', 
                        dsUtil.codeMulti, dsUtil.blockEnd
    userDB.getPlatform res.message.room, (err, platform) ->
      if err
          return robot.logger.error err
        ws.getPersistentEnemies platform, (err, enemies) ->
          if err 
            res.send noEnemiesString
            return robot.logger.error err
          if enemies != ''
            res.send util.format '%s%s%s', dsUtil.codeMulti, enemies, dsUtil.blockEnd
          else
            res.send noEnemiesString
  robot.respond /rewards/, (res) ->
    res.send util.format('%sMission rewards: http://rewards.morningstar-wf.com%s', 
                           dsUtil.codeMulti, dsUtil.blockEnd)