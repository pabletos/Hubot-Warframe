#Cephalon Genesis
A Warframe tracking bot, built on the hubot framework

[![Build Status](https://travis-ci.org/pabletos/Genesis-project.svg)](https://travis-ci.org/pabletos/Genesis-project)


## Installation via NPM --- not currently functioning

1. Install the __Genesis-project__ module as a Hubot dependency by running:

    ```
    npm install --save Genesis-project
    ```

2. Enable the module by adding the __hubot-wikia__ entry to your `external-scripts.json` file:

    ```json
    [
        "Genesis-project"
    ]
    ```

3. Run your bot and see below for available config / commands


## Commands

Command | Listener ID | Description
--- | --- | ---
hubot start |  | Adds user to DB and starts tracking
hubot settings |  | Returns settings
hubot alerts |  | Displays active alerts
hubot baro |  | Displays current Baro Ki'Teer status/inventory
hubot darvo |  | Displays current Darvo Daily Deal
hubot end |  | Hide custom keyboard (telegram only)
hubot invasions |  | Displays current Invasions
hubot news |   | Displays news
hubot platform \<platform> |  | Changes the platform
hubot platform |  | Displays menu
hubot settings |  | Display settings menu
hubot stop |  | Turn off notifications
hubot track <reward or event> |  | Start tracking reward or event
hubot track |  | Tracking menu
hubot untrack <reward or event> |  | Stop tracking reward or event


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
