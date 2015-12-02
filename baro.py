from datetime import datetime

import utils

class Baro:
    """This class contains info about the Void Trader and is initialized with
    data in JSON format

    """

    def __init__(self, data):
        self.config            = data['Config']
        self.start             = datetime.fromtimestamp(data['Activation']['sec'])
        self.end               = datetime.fromtimestamp(data['Expiry']['sec'])
        self.location          = data['Node']
        self.manifest          = data['Manifest']

    def __str__(self):
        """Returns a string with all the information about Baro's offers

        """
        baroItemString = ""
        if datetime.now() < self.start:
            return "None"

        else:

            for item in self.manifest:
                baroItemString += ('== '+ str(item["ItemType"]) +' ==\n'
                                    '- price: '+ str(item["PrimePrice"]) +' ducats + '+ str(item["RegularPrice"]) +'cr -\n\n' )

            return baroItemString

    def get_end_string(self):
        """Returns a string containing Baro's departure time

        """
        return timedelta_to_string(self.end - datetime.now())

    def get_start_string(self):
        """Returns a string containing Baro's arrival time

        """
        return timedelta_to_string(self.start - datetime.now())
