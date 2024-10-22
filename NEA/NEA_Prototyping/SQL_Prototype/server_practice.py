import psycopg2

hostname = 'localhost'
database = 'hosp_server'
username = 'postgres'
pwd = '@dm1n'
port_id = 5432
conn = None
cur = None


try:
    conn = psycopg2.connect(host=hostname,
                            dbname=database,
                            user=username,
                            password=pwd,
                            port=port_id)
    cur = conn.cursor()

    cur.execute('TRUNCATE logins')

    create_script = '''CREATE TABLE IF NOT EXISTS test (
                        id int PRIMARY KEY,
                        forename varchar(40),
                        surname varchar(40),
                        role varchar(10) )'''
    
    cur.execute(create_script)
    conn.commit()

    insert_script = '''INSERT INTO logins(id, forename, surname, role) VALUES (%s,%s,%s,%s)'''
    insert_val = (1, 'Sadiq', 'Ali', 'doctor')
    cur.execute(insert_script,insert_val)
    conn.commit()

except Exception as error:
    print(error)
finally:
    if cur is not None:
        cur.close()
    if conn is not None:
        conn.close()

class User():

    def __init__(self):
        self.conn = self.connect()
        self.cur = self.cursor()


    def connect(self):
        with open('hosp_config.txt, r') as f:
            r = f.readlines()
            config = []
            for i in r:
                config.append(i)

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
    


            