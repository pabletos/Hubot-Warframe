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
#
# Author:
#   nspacestd
#   aliasfalse
util = require('util')
md = require('node-md-config')

dsUtil = require('./lib/_utils.js')

module.exports = (robot) ->
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
    
  robot.respond /chart/, (res) ->
    res.send string = "#{md.codeMulti}#{md.linkBegin}Chart"+
          "#{md.linkMid}http://chart.morningstar-wf.com/"+
          "#{md.linkEnd}#{md.blockEnd}"
  robot.respond /damage/, (res) ->  
    damageURL = 'http://morningstar-wf.com/chart/Damage_2.0_Resistance_Flowchart.png'
    res.send "#{md.codeMulti}#{md.linkBegin}Damage 2.0#{md.linkMid}#{damageURL}#{md.linkEnd}#{md.blockEnd}"
  robot.respond /efficeincy\schart/, (res) ->
    efficienctChartURL = 'http://morningstar-wf.com/chart/efficiency.png'
    res.send res.send "#{md.codeMulti}#{md.linkBegin}Duration/Efficiency Balance Chart#{md.linkMid}#{efficienctChartURL}#{md.linkEnd}#{md.blockEnd}"
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
      shieldInstruct3 = 'shield (Base Shelds) (Base Level) (Current Level) calculate shields and stats.'
      shieldString = "#{md.codeMulti}Possible uses include:#{md.lineEnd}#{shieldInstruct3}#{md.blockEnd}"
    res.send shieldString