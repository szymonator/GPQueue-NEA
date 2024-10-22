import psycopg2

class User():

    def __init__(self):
        self.conn = self.connect()
        self.cur = self.cursor()
        self.role = None


    def connect(self):
        with open('/Users/szymonator1625/PythonPrograms/NEA_Prototyping/FullPrototype/hosp_config.txt', 'r') as f:
            config = []
            for i in f:
                config.append(i[:-1])

            try:
                conn = psycopg2.connect(host=config[0],
                                        dbname=config[1],
                                        user=config[2],
                                        password=config[3],
                                        port=config[4])
            except Exception as error:
                print(error)
            
        return conn
    
    def cursor(self):
        return self.conn.cursor()
    

    def register(self):
        forename = input('Enter your forename:\n').title()
        surname = input('Enter your surname:\n').title()
        password = input('Enter a password:\n')
        print('Are you a patient or a doctor? Type P for patient and D for doctor:\n')
        while True:
            role = input()
            if role == 'd' or role == 'D':
                role = 'Doctor'
                break
            elif role == 'p' or role == 'P':
                role = 'Patient'
                break
            else:
                print('Invalid entry, try again.\n')

        self.role = role
        try:
            self.cur.execute('SELECT id FROM logins')
            id = self.cur.fetchall()[-1][0] + 1
        except IndexError as error:
            id = 0
        self.cur.execute('''INSERT INTO logins(id, forename, surname, role, password) 
                         VALUES (%s,%s,%s,%s,%s)''', (id, forename, surname, role, password))
        self.conn.commit()


    def login(self):
        p_flag = False
        forename = input("Please enter your forename:\n").title()
        surname = input("Please enter your surname:\n").title()
        password = input("Please enter your password:\n")
        print('Do you work at the hospital as a medical professional? Y/N')
        while True:
            role = input()
            if role == 'Y' or role == 'y':
                role = 'Doctor'
                break
            elif role == 'N' or role == 'n':
                role = 'Patient'
                break
            else:
                print('Invalid entry, try again.\n')
                continue

        try:    
            self.cur.execute('''SELECT password FROM logins 
                             WHERE %s=forename AND %s=surname AND %s=role''',(forename, surname, role))
            p = self.cur.fetchall()[0]
            for i in p:
                if i == password:
                    p = password
                    p_flag = True
            if not p_flag:
                print('Invalid name, password, or role, please try again.')
                return False
        except IndexError as error:
            print('Invalid name, password, or role, please try again.')
            return False


        self.cur.execute('SELECT id FROM logins WHERE  %s=forename AND %s=surname AND %s=role AND %s=password',(forename, surname, role, p))
        id = self.cur.fetchall()[0][0]
        print("Welcome {} {}, you are now logged in. (ID {})".format(forename, surname, id))
        return True


    def rate(self):
        severity = input("What is the severity of your ailment?")

    def terminate(self):
        pass
    

user = User()
while True:
    q = input('To log in, press L, to register press R:\n')
    if q == 'l' or q =='L':
        if user.login() == True:
            break
    elif q == 'r' or q == 'R':
        user.register()
        if user.role == 'Patient':
            user.rate()
        break

q = input('Would you like to create an appointment? Y/N')
user.conn.close()