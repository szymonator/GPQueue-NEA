import psycopg2

id=3
conn_config = 'localhost', 'GPQueue', 'postgres', '@dm1n', '5432'

conn = psycopg2.connect(host='localhost', dbname='GPQueue', user='postgres', password='@dm1n', port='5432')
cur = conn.cursor()

cur.execute('''SELECT f_name, l_name FROM "Users" WHERE user_id=%s''', (id,))
names = cur.fetchone()
print(names)
name = names[0]+ ' ' +names[1]
    
cur.close()
conn.close()

