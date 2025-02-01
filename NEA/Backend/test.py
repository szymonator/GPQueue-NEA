import os
from dotenv import load_dotenv
import psycopg2
from flask import jsonify
import datetime

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]


conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
cur = conn.cursor()


id = 1
type = 'patient'
if type == 'patient':


        cur.execute('''SELECT f_name, l_name, TO_CHAR(appt_time, 'HH24:MI'), TO_CHAR(appt_date, 'DD/MM/YYYY'), appt_details
                    FROM appointments a INNER JOIN staff_view v ON a.staff_id = v.user_id
                    WHERE patient_id = %s AND status='completed' ''', (id,))
        result = cur.fetchall()
        print(result)
        if result == []:
            print({'error':'no appts'})

        # ids = tuple([i[0] for i in result])
        # cur.execute('''SELECT user_id, f_name, l_name
        #             FROM staff_view
        #             WHERE verified='Y' AND user_id IN %s''', (ids,))
        # staff_list = cur.fetchall()

        # staff_dict = {}
        # for member in staff_list:
        #     staff_dict[member[0]] = member[1]+ ' ' +member[2]

        appts = [{'staff_name':i[0]+' '+i[1], 'appt_time':i[2], 'appt_date':i[3], 'appt_details':i[4]} for i in result]
        cur.close()
        conn.close()

        print({'appts':appts})