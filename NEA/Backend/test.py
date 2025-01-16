import os
from dotenv import load_dotenv
import psycopg2
from datetime import datetime 
import datetime as datetime2

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]

appt = {'date':'16/01/2025', 'timeslot':'09:30', 'priority':1, 'staff_id':7}


conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
cur = conn.cursor()

date = appt['date']
time = appt['timeslot']
priority = appt['priority']
staff_id = appt['staff_id']

id = 1

try:
    appt_id = appt['appt_id']
except KeyError:
    appt_id = None

print(appt)

if not appt_id:

    # not replacing an appt

    cur.execute('''UPDATE appointments
                SET status = 'scheduled'
                WHERE appt_date = %s AND appt_time = %s AND priority = %s AND staff_id = %s AND patient_id = %s ''', 
                (date, time, priority, staff_id, id))
    conn.commit()

    cur.execute('''DELETE FROM appointments
                WHERE patient_id = %s AND status = 'reserved' ''', (id, ))
    conn.commit()

    cur.execute('''UPDATE appointments
                SET status = 'scheduled'
                WHERE status = %s''', (f"scheduled + reserved by {id}",))
    conn.commit()

else:
    
    # replacing and rescheduling an appt

    cur.execute('''DELETE FROM appointments
                WHERE patient_id = %s AND status = 'reserved' ''', (id, ))
    conn.commit()

    cur.execute('''SELECT patient_id, priority, appt_date
                FROM appointments
                WHERE appt_id = %s''', (appt_id, ))
    other_id, other_priority, appt_date = cur.fetchone()
    other_priority -= 1

    cur.execute('''UPDATE appointments
                SET patient_id = %s, priority = %s, status = 'scheduled' 
                WHERE appt_id = %s''', (id, priority, appt_id))
    conn.commit()
    
    cur.execute('''SELECT user_id
        FROM staff_view
        WHERE verified='Y' ''')
    staff = cur.fetchall()
    staff_list = [i[0] for i in staff]

    times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

    date = datetime.strptime(appt_date, '%d/%m/%Y')
    timechange = datetime2.timedelta(days=1)

    flag = False
    while not flag:
        
        day_str = date.strftime('%d/%m/%Y')
        print(day_str)
        
        cur.execute('''SELECT staff_id, appt_time
                    FROM appointments
                    WHERE appt_date = %s AND status != 'completed' ''', (day_str,))
        fetched_appts = cur.fetchall()
        print(fetched_appts)

        for timeslot in times:
            print(timeslot)
            for staff_id in staff_list:
                print(staff_id)
                if not ((staff_id, timeslot) in fetched_appts):
                    chosen_appt = (other_id, staff_id, timeslot, day_str, other_priority, 'scheduled')
                    flag = True
                    break
                else:
                    next
            
            if flag:
                break

        date += timechange

    cur.execute('''INSERT INTO appointments (patient_id, staff_id, appt_time, appt_date, priority, status)
                VALUES (%s, %s, %s, %s, %s, %s)''', chosen_appt)
    conn.commit()

cur.close()
conn.close()