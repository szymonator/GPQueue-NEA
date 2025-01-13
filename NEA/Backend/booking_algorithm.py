import os
from dotenv import load_dotenv
import psycopg2
from datetime import datetime

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]

def fetch_appointments(priority, dates, times, id):

    # first we get valid doctor ids for the appointments

    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    cur.execute('''SELECT user_id, f_name, l_name
                FROM staff_view
                WHERE verified='Y' ''')
    staff_list = cur.fetchall()

    staff_dict = {}
    for member in staff_list:
        staff_dict[member[0]] = member[1]+ ' ' +member[2]

    priorities = [1,2,3]
    for i in range(1, 4):
        if priority > i:
            priorities.remove(i)
        if priority <= i:
            break

    # list of appts (where an appt is a dict) generator, based on user preferences
    generated_appts = []
    required_appts = []
    for day in dates:
        for timeslot in times:
            required_appts.append({'patient_id':id, 'timeslot':timeslot, 'timeslot':timeslot.zfill(5), 'date':day, 'priority':priority})
            for staff_id in staff_dict:
                    generated_appts.append({'patient_id':id, 'staff_id':staff_id, 'staff_name':staff_dict[staff_id], 'timeslot':timeslot.zfill(5), 'date':day, 'priority':priority})


    all_appts_final = []
    
    cur.execute('''SELECT appt_id, staff_id, appt_time, appt_date, priority, status, patient_id
                FROM appointments
                WHERE appt_time IN %s AND appt_date IN %s AND (status != 'completed')''', 
                (tuple([time.zfill(5) for time in times]), tuple(dates))) 
    result = cur.fetchall()
    existing_appts = []
    for entry in result:
        if entry[6] != id:
            existing_appts.append({'appt_id':entry[0], 'staff_id':entry[1], 'staff_name':staff_dict[entry[1]],'timeslot':entry[2], 'date':entry[3].strftime('%d/%m/%Y'), 'priority':entry[4], 'status':entry[5]})

    # MAKE COMPARISON BETWEEN generated_appts AND existing_appts, CHECKING TIME, STAFF, AND DATE. 
    # IF THERE IS A PERFECT MATCH, DO NOT ADD IT TO THE FINAL, ELSE ADD IT GIVEN THAT THE SAME TIME HASN'T ALREADY BEEN ADDED



    repeated_appts_list = []

    for appt in generated_appts:
        conflict = False
        for entry in existing_appts:
            if (entry['timeslot'] == appt['timeslot'] and entry['date'] == appt['date'] and entry['staff_id'] == appt['staff_id']):
                conflict = True
                break
        if not conflict and not ([appt['date'], appt['timeslot']] in repeated_appts_list):
            all_appts_final.append(appt)
            repeated_appts_list.append([appt['date'], appt['timeslot']])


    for appt in existing_appts:
        if [appt['date'], appt['timeslot']] not in repeated_appts_list:
            if appt['priority'] > priority and appt['status'] == 'scheduled':
                all_appts_final.append(entry)
                repeated_appts_list.append([entry['date'], entry['timeslot']])
            next

    insert = []
    update = []
    for appt in all_appts_final:
        try:
            appt_id = appt['appt_id']
            status = f'scheduled + reserved by {id}'
            update.append([status, appt_id])
        except KeyError:
            temp = list(appt.values())
            temp.append('reserved')
            temp.pop(2)
            insert.append(temp)

    cur.executemany('''INSERT INTO appointments (patient_id, staff_id, appt_time, appt_date, priority, status)
                     VALUES (%s, %s, %s, %s, %s, %s)''', insert)
    conn.commit()

    cur.executemany('''UPDATE appointments
                    SET status = %s
                    WHERE appt_id = %s''', update)
    conn.commit()


    cur.close()
    conn.close()

    return all_appts_final


fetch_appointments(2, ['13/01/2025', '14/01/2025'], ['9:30', '10:30'], 1)



def choose_appointment(staff_id, date, timeslot, priority, appt_id=False):
    pass