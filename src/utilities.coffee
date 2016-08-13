# Description:
#   Display utility info at the user's request
#
# Dependencies:
#   None
#
# Configuration:
#   MONGODB_URL - MongoDB url
#
# Commands:
#   hubot armor - Display instructions for calculating armor
#   hubot armor <current armor> - Display current damage resistance and amount of corrosive procs required to strip it
#   hubot armor <base armor> <base level> <current level> - Display the current armor, damage resistance, and necessary corrosive procs to strip armor.
#   hubot chart - Display link to Warframe progression chart
#   hubot damage - Display link to Damage 2.0 infographic
#   hubot efficiency chart - Display link to Duration/Efficienct chart
#   hubot shield - Display instructions for calculating shields
#   hubot shield <base shields> <base level> <current level> - Display the current shields.
#   hubot trial <in-game-name> - display link to search for stats for user
#
# Author:
#   nspacestd
#   aliasfalse
util = require('util')
md = require('node-md-config')

dsUtil = require('./lib/_utils.js')

module.exports = (robot) ->
  robot.respond /armor(?:\s+([\d\s]+))?/i, id:'hubot-warframe.armor', (res) ->
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
                                md.codeMulti, dsUtil.damageReduction(armor), 
                                md.lineEnd, dsUtil.armorStrip(armor), md.blockEnd)
      else
        robot.logger.debug 'Entered 3-param armor'
        armorString = util.format('%s%s%s', 
                                md.codeMulti, dsUtil.armorFull(armor, baseLevel, currentLevel), 
                                md.blockEnd)

            
    else
      robot.logger.debug 'Entered 0-param armor'
      armorInstruct3 = 'armor (Base Armor) (Base Level) (Current Level) calculate armor and stats.'
      armorInstruct1 = 'armor (Current Armor) Calculate damage resistance.'
      armorString = util.format('%sPossible uses include:%s%s%s%s%s', 
                                md.codeMulti, md.lineEnd, 
                                armorInstruct3, md.lineEnd, 
                                armorInstruct1, md.blockEnd)
    res.send armorString
    
  robot.respond /chart/i, id:'hubot-warframe.chart', (res) ->
    res.send string = "#{md.codeMulti}#{md.linkBegin}Chart"+
          "#{md.linkMid}http://chart.morningstar-wf.com/"+
          "#{md.linkEnd}#{md.blockEnd}"
  robot.respond /damage/i, id:'hubot-warframe.damage', (res) ->  
    damageURL = 'http://morningstar-wf.com/chart/Damage_2.0_Resistance_Flowchart.png'
    res.send "#{md.codeMulti}#{md.linkBegin}Damage 2.0#{md.linkMid}#{damageURL}#{md.linkEnd}#{md.blockEnd}"
  robot.respond /efficeincy\s?chart/, id:'hubot-warframe.efficiencychart', (res) ->
    efficienctChartURL = 'http://morningstar-wf.com/chart/efficiency.png'
    res.send res.send "#{md.codeMulti}#{md.linkBegin}Duration/Efficiency Balance Chart#{md.linkMid}#{efficienctChartURL}#{md.linkEnd}#{md.blockEnd}"
  robot.respond /shield(?:\s+([\d\s]+))?/, id:'hubot-warframe.shields', (res) ->
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
      shieldInstruct3 = 'shield (Base Shelds) (Base Level) (Current Level) calculate shields and stats.'
      shieldString = "#{md.codeMulti}Possible uses include:#{md.lineEnd}#{shieldInstruct3}#{md.blockEnd}"
    res.send shieldString
  robot.respond /trial(?:\s+([\w+\s]+))?(?:\s+([\w+\s]+))?/i, id:'hubot-warframe.trials', (res) ->
    params = res.match[1]
  
    lorRegExp = /(?:(?:lor)|(?:law of retribution))\s*?(?:([\w+\s]+))?/i
    jordasRegExp = /(?:jordas(?:\sverdict))(?:\s+([\w+\s]+))?/i
    
    baseURL = 'http://wf.christx.tw/'
    searchAppend = 'search.php?id='
    jordasSearchAppend = 'JordasSearch.php?id='
    jordasAppend = 'JordasRecords.php?type=all'
    
    messageToSend = 'Sorry, Operator, no functionality exists for that yet.'
    
    if(typeof params == 'undefined')
      messageToSend = baseURL
    else if lorRegExp.test params
      name = params.match(lorRegExp)[1]
      if(typeof name != 'undefined')
        messageToSend = baseURL + searchAppend + encodeURIComponent name.replace(/\s/,'')
      else
        messageToSend = baseURL
    else if jordasRegExp.test params
      name = params.match(jordasRegExp)[1]
      if(typeof name != 'undefined')
        messageToSend = baseURL + jordasSearchAppend + encodeURIComponent name.replace(/\s/,'')
      else
        messageToSend = baseURL + jordasAppend
    res.send messageToSend