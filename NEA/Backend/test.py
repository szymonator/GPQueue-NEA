import os
from dotenv import load_dotenv
import psycopg2
from flask import jsonify

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]


conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
cur = conn.cursor()
id = 1
cur.execute('''SELECT staff_id, appt_time, TO_CHAR(appt_date, 'DD/MM/YYYY'), appt_details
            FROM appointments
            WHERE patient_id = %s AND status='scheduled' ''', (id,))
result = cur.fetchall()
print(result)

ids = tuple(result)
print(ids)


cur.execute('''SELECT email
                    FROM "Users"
                    WHERE user_id = %s''', (1, ))
email = cur.fetchone()[0]

print(email)