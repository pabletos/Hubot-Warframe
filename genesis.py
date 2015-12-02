import threading, argparse, configparser, logging, sys
from datetime import datetime

import mysql.connector
import telegram

from pyDeathsnacks import pyDeathsnacks


class Genesis:

    CONFIG_PATH = 'config.ini'

    INSTRUCTIONS = (
                'I am allowed to answer to any of these commands:\n\n'
                '/start - Start tracking alerts and invasions (all but credits or resource alerts).\n'
                '/stop - Stop tracking alerts and invasions.\n'
                '/alerts - Get all active alerts.\n'
                '/invasions - Get all active invasions and ETA.\n'
                '/craft weapon - Shows weapon manufacturing info. \n'
                '/darvo - Get current daily deals.\n'
                '/simaris - Show current Simaris target and completion.\n'
                '/baro - Shows baro deals or ETA.\n'
                '/startbd - Allows receiving Cephalon\'s broadcasts.\n'
                '/stopbd - Stops Cephalon\'s broadcasts.\n'
                '/help - Show this info.\n'
                '/donate - Link to contribute to Cephalon development (thanks!).\n'
                '/changelog - Version changes log.\n'
                '/about - Info about tenno creators and contributors.\n\n'
                'And maybe some commands more, I\'m not sure, my calibrator is still broken!'
            )
    
    def __init__(self):
        
        self.read_config()

        self.updater = telegram.Updater(self.token)
        dp = self.updater.dispatcher
        dp.addTelegramCommandHandler('help', self.help)
        dp.addTelegramCommandHandler('alerts', self.alerts)
        dp.addTelegramCommandHandler('invasions', self.invasions)
        dp.addTelegramCommandHandler('darvo', self.darvo)
        dp.addTelegramCommandHandler('simaris', self.simaris)
        dp.addTelegramCommandHandler('baro', self.baro)
        dp.addUnknownTelegramCommandHandler(self.unknown_command)

        db = mysql.connector.connect(user= self.db_user, password= self.db_pass,host= self.db_host,database= self.db_name)
        cursor = db.cursor()

        query = ('CREATE TABLE IF NOT EXISTS users '
                 '(chat_id INTEGER PRIMARY KEY, platform TINYINT,'
                 'alert_track TINYINT, invasion_track TINYINT,'
                 'broadcast TINYINT, photo TINYINT,'
                 'helmet_track TINYINT, clantech_track TINYINT,'
                 'nightmare_track TINYINT, aura_track TINYINT,'
                 'resource_track TINYINT, nitain_track TINYINT)')

        cursor.execute(query)
        db.commit()
        db.close()


    def read_config(self):
        """ Read the bot config from the file specified in CONFIG_PATH """

        config = configparser.ConfigParser()
        config.read(Genesis.CONFIG_PATH)

        server = config['SERVER']
        database = config['DATABASE']

        self.token = server['Token']
        self.port = int(server['Port'])
        self.cert_path = server['Certificate']
        self.key_path = server['Key']
        self.hostname = server['Host name']
        self.db_name = database['Name']
        self.db_user = database['User']
        self.db_pass = database['Password']
        self.db_host = database['Host']


    def start(self, chatid):
        """ Register new users """

        db = mysql.connector.connect(user= self.db_user, password= self.db_pass,host= self.db_host,database= self.db_name)
        cursor = db.cursor()

        #checks if user exists already
        query = "SELECT name FROM users WHERE chat_id = %s"
        cursor.execute(query, (chatid,))
        row = cursor.fetchone()

        if row == None:
            #create a record if doesn't exist

            create = ('INSERT INTO user VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)')
            cursor.execute(create, (chatid, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1))
            db.commit()
            db.close()

            wrapper.sendMessage(chat_id = chatid, text = "Welcome operator!\n" + INSTRUCTIONS)


    def alert_track(self,chatid,chatname):
        """ Connects to database and change alert tracking value from 0 to 1 or 1 to 0 (tracking/not tracking) """

        db = mysql.connector.connect(user= self.db_user, password= self.db_pass,host= self.db_host,database= self.db_name)
        cursor = db.cursor()

        query = "SELECT alert_track FROM users WHERE chat_id = %s"
        cursor.execute(query, (chatid,))
        row = cursor.fetchone()

        if row != None:
            #if fetching was succesful it checks chat_id value
            update = "UPDATE users SET alert_track = %s WHERE chat_id = %s"

            if row[0] == 0:
                #starts
                cursor.execute(update, (1, chatid))
                wrapper.sendMessage(chat_id = chatid, text = "Starting tracking alerts, here we go!\n")
            else:
                #stops
                cursor.execute(update, (0, chatid))
                wrapper.sendMessage(chat_id = chatid, text = "Stopping the tracking, use /startalerts if you want to start tracking again, operator\n")

            db.commit()
        db.close()
            

    def invasion_track(self,chatid):
        """ Connects to database and change invasion tracking value from 0 to 1 or 1 to 0 (tracking/not tracking) """

        db = mysql.connector.connect(user= self.db_user, password= self.db_pass,host= self.db_host,database= self.db_name)
        cursor = db.cursor()

        query = "SELECT invasion_track FROM users WHERE chat_id = %s"
        cursor.execute(query, (chatid,))
        row = cursor.fetchone()

        if row != None:
            #if fetching was succesful it checks chat_id value
            update = "UPDATE users SET invasion_track = %s WHERE chat_id = %s"
            
            if row[0] == 0:
                #starts
                cursor.execute(update, (1, chatid))
                wrapper.sendMessage(chat_id = chatid, text = "Starting tracking invasions, here we go!\n")
            else:
                #stops
                cursor.execute(update, (0, chatid))
                wrapper.sendMessage(chat_id = chatid, text = "Stopping the tracking, use /invasion if you want to start tracking again, operator\n")

            db.commit()
        db.close()

    def broadcast(self,field,message):
        """ Broadcast a message checking if a row value is 1 (if users are tracking) """

        db = mysql.connector.connect(user= self.db_user, password= self.db_pass,host= self.db_host,database= self.db_name)
        cursor = db.cursor()

        query = "SELECT chat_id FROM users WHERE %s = 1"
        cursor.execute(query, (field,))
        rows = cursor.fetchall()

        for row in rows:
            send_message(row[0], message)

        db.close()

    def remove_chat(self, chatid):
        db = mysql.connector.connect(user= self.db_user, password= self.db_pass,host= self.db_host,database= self.db_name)
        cursor = db.cursor()

        cursor.execute('DELETE FROM users WHERE chat_id = %s', (chatid,))

        db.commit()
        db.close()

    def help(self, bot, update):
        """ Send help message to a telegram chat

        """
        bot.sendMessage(update.message.chat_id, Genesis.INSTRUCTIONS)

    def alerts(self, bot, update, args):
        """ Send the current alerts to a telegram chat

        """
        alerts = [a for a in pyDeathsnacks.get_alerts() if not a.is_expired()]

        if alerts:
            text = '\n\n'.join([str(a) for a in alerts])
        else:
            text = 'There are no alerts, operator.'
        bot.sendMessage(update.message.chat_id, text)

    def invasions(self, bot, update, args):
        """ Send the current invasions to a telegram chat

        """
        invasions = pyDeathsnacks.get_invasions()

        if invasions:
            text = '\n\n'.join([str(i) for i in invasions])
        else:
            text = 'There are no invasions, operator.'

        bot.sendMessage(update.message.chat_id, text)

    def darvo(self, bot, update):
        deals = pyDeathsnacks.get_deals()

        if deals:
            text = '\n\n'.join([str(d) for d in deals])
        else:
            text = 'There are no daily deals, operator.'

        bot.sendMessage(update.message.chat_id, text)

    def simaris(self, bot, update):
        simaris = pyDeathsnacks.get_library()

        if simaris.is_active():
            text = str(simaris)
        else:
            text = 'There is no active target, operator.'

        bot.sendMessage(update.message.chat_id, text)

    def baro(self, bot, update):
        baro = pyDeathsnacks.get_baro()[0]

        if baro.is_active():
            text = str(baro)
        else:
            text = 'Baro is not here yet, he will arrive in '\
                    + baro.get_start_string()

        bot.sendMessage(update.message.chat_id, text)

    def unknown_command(self, bot, update):
        bot.sendMessage(update.message.chat_id,
                "I'm afraid my language calibrator is severely damaged, "
                "please operator try again or use /help.")

    def run(self):
        """ Set up the WebHook and handle user input

        """
        url = 'https://{}:{}/{}'.format(self.hostname, self.port, self.token)
        self.updater.bot.setWebhook(webhook_url=url,
                certificate=open(self.cert_path, 'rb'))
        self.update_queue = self.updater.start_webhook(url_path=self.token,
                listen='0.0.0.0', port=self.port, cert=self.cert_path,
                key=self.key_path)

        print('The bot is running, Q to exit')

        while True:
            try:
                text = raw_input()
            except NameError:
                text = input()

            if text.lower() == 'q':
                print('Stopping the bot...')
                self.updater.stop()
                break

def main():
    parser = argparse.ArgumentParser(description='A Warframe alert bot')
    parser.add_argument('-v', help='Enable verbose output', dest='verbose',
            action='store_true')
    parser.add_argument('-vv', help='Enable very verbose output',
            dest='very_verbose', action='store_true')
    parser.add_argument('-l', '--logfile', help='Path to log file',
            dest='logfile', default='genesis.log')
    args = parser.parse_args()

    logger = logging.getLogger()
    formatter = \
                logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    fh = logging.FileHandler(args.logfile)
    fh.setLevel(logging.WARNING)
    fh.setFormatter(formatter)
    logger.addHandler(fh)

    if args.verbose or args.very_verbose:
        sh = logging.StreamHandler(sys.stdout)

        if args.verbose:
            sh.setLevel(logging.INFO)
            logger.setLevel(logging.INFO)
        else:
            sh.setLevel(logging.DEBUG)
            logger.setLevel(logging.DEBUG)

        sh.setFormatter(formatter)
        logger.addHandler(sh)

    bot = Genesis()
    bot.run()

if __name__ == '__main__':
    main()
