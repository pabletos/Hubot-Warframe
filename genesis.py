from datetime import datetime
import threading, time, shelve, argparse, os.path, dbm, requests, sqlite3

from pyDeathsnacks import pyDeathsnacks

class Genesis:

    TOKEN = 'your token here'
    API_URL = 'https://api.telegram.org/bot' + TOKEN + '/'
    DB_NAME = 'your db here'

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
        pass


    def start(self,chatid,chatname):
        """ Register new users """

        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        #checks if user exists already
        query = ("SELECT name FROM users WHERE chat_id = %s")
        cursor.execute(query,(chatid,))
        row = cursor.fetchone()

        if row == None:
            #create a record if doesn't exist

            create = ("INSERT INTO users (chat_id, name, alert_track, invasion_track, broadcast, photo) VALUES (%s, %s, %s, %s, %s, %s)")
            cursor.execute(create, (chatid, chatname, "1", "1", "1", "1"))
            db.commit()
            send_message(chatid,"Welcome operator!\n" + INSTRUCTIONS)

            db.close()

    def alert_track(self,chatid,chatname):
        """ Connects to database and change alert tracking value from 0 to 1 or 1 to 0 (tracking/not tracking) """

        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        query = ("SELECT name, alert_track FROM users WHERE chat_id = %s")
        cursor.execute(query,(chatid,))
        row = cursor.fetchone()

        if row != None:
            #if fetching was succesful it checks chat_id value

            if row[1] == "0":
                #starts

                update = ("UPDATE users SET alert_track = %s WHERE chat_id = %s ")
                cursor.execute(update,("1",chatid))
                db.commit()
                send_message(chatid,"Starting tracking alerts, here we go!\n")
            else:
                #stops

                update = ("UPDATE users SET track = %s WHERE chat_id = %s ")
                cursor.execute(update,("0",chatid))
                db.commit()
                send_message(chatid,"Stopping the tracking, use /startalerts if you want to start tracking again, operator\n")
            

    def invasion_track(self,chatid,chatname):
        """ Connects to database and change invasion tracking value from 0 to 1 or 1 to 0 (tracking/not tracking) """

        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        query = ("SELECT name, invasion_track FROM users WHERE chat_id = %s")
        cursor.execute(query,(chatid,))
        row = cursor.fetchone()

        if row != None:
            #if fetching was succesful it checks chat_id value
            
            if row[1] == "0":
                #starts

                update = ("UPDATE users SET track = %s WHERE chat_id = %s ")
                cursor.execute(update,("1",chatid))
                db.commit()
                send_message(chatid,"Starting tracking invasions, here we go!\n")
            else:
                #stops

                update = ("UPDATE users SET track = %s WHERE chat_id = %s ")
                cursor.execute(update,("0",chatid))
                db.commit()
                send_message(chatid,"Stopping the tracking, use /invasion if you want to start tracking again, operator\n")

    def public_broadcast(self,row):
        """ Broadcast a message checking if a row value is 1 (if users are tracking) """

        db = sqlite3.connect(DB_NAME)
        cursor = db.cursor()

        query = ("SELECT chat_id, %s FROM users")
        cursor.execute(query,(row,))
        rows = cursor.fetchall()

        for row in rows:

            #check tracking values and send alerts or invasions
            try:
                if row[1] == '1':
                    send_message(row[0],alert)
            except:
                continue

        db.close()

    if __name__ == '__main__':

        os.chdir(os.path.dirname(__file__))
        bot = Genesis()
        bot.run