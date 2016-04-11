#Hubot-Warframe
A [Hubot](https://hubot.github.com/) module for tracking Warframe alerts, invasions and more.

[![Build Status](https://travis-ci.org/pabletos/Hubot-Warframe.svg)](https://travis-ci.org/pabletos/Hubot-Warframe)


## Installation via NPM --- not currently functioning

1. Install the __Hubot-Warframe__ module as a Hubot dependency by running:

    ```
    npm install --save hubot-warframe
    ```

2. Add this to your `external-scripts.json` file:

    ```json
    [
        "hubot-warframe"
    ]
    ```

3. Run your bot and see below for available config / commands

## Configuration

hubot-warframe requires a MongoDB server. It uses the **MONGODB_URL** environment variable for determining where to connect to

Environment Variable | Description | Example
--- | --- | ---
MONGODB_URL | connection url for mongodb | `mongodb://<host>:<port>/<database>`
HUBOT_LINE_END | Configuragble line-return character | `\n`
HUBOT_BLOCK_END | Configuragble string for ending blocks  | `-------`
HUBOT_DOUBLE_RET | Configurable string for double-line returns | `\n\n`
HUBOT_MD_LINK_BEGIN | Configurable string for double-line returns | ` `
HUBOT_MD_LINK_MID | Configurable string for double-line returns | ` `
HUBOT_MD_LINK_END | Configurable string for double-line returns | ` `
HUBOT_MD_BOLD | Configurable string for double-line returns | ` `
HUBOT_MD_ITALIC | Configurable string for double-line returns | ` `
HUBOT_MD_UNDERLINE | Configurable string for double-line returns | ` `
HUBOT_MD_STRIKE | Configurable string for double-line returns | ` `
HUBOT_MD_CODE_SINGLE | Configurable string for double-line returns | ` `
HUBOT_MD_CODE_BLOCK | Configurable string for double-line returns | ` `

## Commands

Command | Listener ID | Description
--- | --- | ---
`hubot start` |  | Adds user to DB and starts tracking
`hubot settings` |  | Returns settings
`hubot alerts` |  | Displays active alerts
`hubot baro` |  | Displays current Baro Ki'Teer status/inventory
`hubot darvo` |  | Displays current Darvo Daily Deal
`hubot end` |  | Hide custom keyboard (telegram only)
`hubot invasions` |  | Displays current Invasions
`hubot news` |   | Displays news
`hubot platform <platform>` |  | Changes the platform
`hubot platform` |  | Displays menu
`hubot settings` |  | Display settings menu
`hubot stop` |  | Turn off notifications
`hubot track <reward or event>` |  | Start tracking reward or event
`hubot track` |  | Tracking menu
`hubot untrack <reward or event>` |  | Stop tracking reward or event
`hubot simaris` |  | Get Synthesis target tracking

## Sample Interaction

```
user1>> /start

hubot>> Tracking started

user1>> /settings

hubot>> 
Your platform is PC
Alerts are OFF
Invasions are OFF
News are OFF

Tracked rewards:
Alternative helmets
ClanTech resources
Nightmare Mods
Auras
Resources
Nitain Extract
Void Keys
Weapon skins
Weapons
Other rewards

user1>> /end

hubot>> Done

```
