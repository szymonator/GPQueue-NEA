import os
from dotenv import load_dotenv
import psycopg2
from flask import jsonify
import datetime

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]


conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
cur = conn.cursor()

now = datetime.datetime.now()
date = now.strftime('%Y-%m-%d')
time = now.strftime('%H:%M')
cur.execute('''UPDATE appointments
            SET status = 'completed'
            WHERE appt_date <= %s AND appt_time::TIME < %s::TIME AND appt_id = 480''', (date, time,))
conn.commit()