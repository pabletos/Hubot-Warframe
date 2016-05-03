![Genesis Avatar](resources/images/cephalontransparent.png)

#Hubot-Warframe
A [Hubot](https://hubot.github.com/) module for tracking Warframe alerts, invasions and more.

[![Build Status](https://travis-ci.org/pabletos/Hubot-Warframe.svg)](https://travis-ci.org/pabletos/Hubot-Warframe)

[![Try hubot-warframe on Discord!](https://discordapp.com/api/servers/146691885363232769/widget.png?style=banner)](https://discord.gg/0onjYYKuUBE52UTL)  

[![Try hubot-warframe on Telegram!](https://img.shields.io/badge/Telegram-Beta%20War%20Bot-279DD8.svg)](https://telegram.me/betawarbot)

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
HUBOT_BLOCK_END | Configuragble string for ending blocks  | \```
HUBOT_DOUBLE_RET | Configurable string for double-line returns | `\n\n`
HUBOT_MD_LINK_BEGIN | Define the beginning string for a markdown link | `(`
HUBOT_MD_LINK_MID | Define the middle string for a markdown link | `)[`
HUBOT_MD_LINK_END | Define the end string for a markdown link | `]`
HUBOT_MD_BOLD | Define the string to use before and after a string to bold it | `**`
HUBOT_MD_ITALIC | Define the string to use before and after a string to italicize it | `*`
HUBOT_MD_UNDERLINE | Define the string to use before and after a string to underline it | `__`
HUBOT_MD_STRIKE | Define the string to use before and after a string to strike it out | `~~`
HUBOT_MD_CODE_SINGLE | Define the string to use before and after a string to define it as an inline block of code | \`
HUBOT_MD_CODE_BLOCK | Define the string to use before and after a string to define it as a multi-line block of code | ```` `
HUBOT_WARFRAME_LANG_PATH | Define the path to the languages.json in order to allow a custom string set to be defined. This will default to the included `languages.json` included with the module. | `./languages.json`

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
`hubot update` |  | Display current update
`hubot primeaccess` |  | Display current Prime Access news
`hubot damage` |  | Display link to Damage 2.0 infographic
`hubot armor`  |  | Display instructions for calculating armor
`hubot armor <current armor>` |  | Display current damage resistance and amount of corrosive procs required to strip it
`hubot armor <base armor> <base level> <current level>` | |  Display the current armor, damage resistance, and necessary corrosive procs to strip armor.
`hubot shield`  |  | Display instructions for calculating armor
`hubot shield <base shield> <base level> <current level>` | |  Display the current shields.
`hubot conclave` |  | Display usage for conclave command
`hubot conclave all` |  | Display all conclave challenges
`hubot conclave daily` |  | Display active daily conclave challenges
`hubot conclave weekly` |  | Display active weekly conclave challenges
`hubot enemies` |  | Display list of active persistent enemies where they were last found

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
