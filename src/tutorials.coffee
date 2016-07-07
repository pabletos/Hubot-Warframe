# Description:
#   Display tutorial and profile info at the user's request
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot tutorial <topic> - Display link to the topic's tutorial video
#   hubot profile <warframe> - Display link to profile video for specified warframe
#
# Author:
#   nspacestd
#   aliasfalse
util = require('util')
md = require('hubot-markdown')

dsUtil = require('./lib/_utils.js')

profiles = require('../resources/data/profiles.json')
tutorials = require('../resources/data/tutorials.json')

module.exports = (robot) ->
  robot.respond /tutorial\s?(.+)?/, (res) ->
    tutorialReg = res.match[1]      
    if(tutorialReg)
      tutorialFormat = "#{md.codeMulti}#{md.linkBegin}Warframe Tutorial | %s#{md.linkMid}%s#{md.linkEnd}#{md.blockEnd}"

      for tutorial of tutorials
        robot.logger.debug tutorials[tutorial].regex
        robot.logger.debug tutorials[tutorial].name
        robot.logger.debug tutorials[tutorial].url
        if new RegExp(tutorials[tutorial].regex, "i").test(tutorialReg)
          res.send util.format tutorialFormat, tutorials[tutorial].name, tutorials[tutorial].url
          return;
      res.send "#{md.codeMulti}Apologies, Operator, there is no such tutorial registered in my system.#{md.blockEnd}"
    else
      availableTutorials = "#{md.codeMulti}Available tutorials:#{md.lineEnd}"
      for tutorial of tutorials
        availableTutorials += "  \u2022 #{tutorial}#{md.lineEnd}"
      res.send availableTutorials+"#{md.blockEnd}"
    
  robot.respond /profile\s?(.+)?/, (res) ->
    warframe = res.match[1]
    if(warframe)
      profileFormat = "#{md.codeMulti}#{md.linkBegin}Warframe Profile | %s#{md.linkMid}%s#{md.linkEnd}#{md.blockEnd}"
      for profile of profiles
        robot.logger.debug profiles[profile].regex
        robot.logger.debug profiles[profile].name
        robot.logger.debug profiles[profile].url
        if new RegExp(profiles[profile].regex, "i").test(warframe)
          res.send util.format profileFormat, profiles[profile].name, profiles[profile].url
          return;
      res.send "#{md.codeMulti}Apologies, Operator, there is no such Warframe profile registered in my system.#{md.blockEnd}"
    else
      availableProfiles = "#{md.codeMulti}Available profiles:#{md.lineEnd}"
      for profile of profiles
        availableProfiles += "  \u2022 #{profile}#{md.lineEnd}"
      res.send availableProfiles+"#{md.blockEnd}"