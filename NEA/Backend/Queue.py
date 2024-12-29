# FIFO DATA STRUCTURE - IN MY CASE, VALUES ARE APPENDED AND REMOVED FROM THE FRONT
# Lock has to be used to make sure race conditions do not occur, where my 2 threads try to access this queue at the same time

from threading import Lock, Condition


class Queue():

    def __init__(self):
        self.items = []
        self.lock = Lock()
        self.condition = Condition(self.lock)

    def put(self, val):
        with self.condition:
            self.items.append(val)
            self.condition.notify()

    def get(self):
        with self.condition:
            while len(self.items) == 0:
                    self.condition.wait() #this is so that the processor thread waits until it is notified
            return self.items.pop(0)      # the notification comes from the put function
    

    
