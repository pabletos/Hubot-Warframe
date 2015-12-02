class Library:
    """This class represents a simaris target and is initialized with
    data in JSON format

    """

    def __init__(self, data):
        if 'CurrentTarget' in data:
            self.target          = data['CurrentTarget']['EnemyType']
            self.scans           = data['CurrentTarget']['PersonalScansRequired']
            self.progress        = data['CurrentTarget']['ProgressPercent']
            self.active = True
        else:
            self.active = False

    def __str__(self):
        """Returns a string with all the information about this alert

        """
        if not self.is_active():
            return None

        library_string = ('Target: {0}\n'
                       'Scans needed: {1}\n'
                       'Progress: {2:.2f}%'
                       )

        return library_string.format(self.target, self.scans,
                                  self.progress)

    def is_active(self):
        """ Returns True if there is a currently active target, False otherwise

        """
        return self.active
