import os
from dotenv import load_dotenv
import psycopg2
import datetime
import yagmail

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]

def fetch_appointments(priority, dates, times, id):

    # converting times + dates to proper formats:
    
    times_list = times.split(', ')
    times_list.remove('')
    # this is a hardcoded fact
    times_dict = {'09:00-13:00':['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'],
                '13:00-17:00':['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
                '17:00-21:00':['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']}
    times = []
    for time in times_list:
        times += times_dict[time]

    dates_list = dates.split(', ')
    dates_list.remove('')
    dates = dates_list


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
    repeated_appts_list = []
    
    cur.execute('''SELECT appt_id, staff_id, TO_CHAR(appt_time, 'HH24:MI'), appt_date, priority, status, patient_id
                FROM appointments
                WHERE appt_time IN %s AND appt_date IN %s AND (status != 'completed')
                ORDER BY appt_date, appt_time''', 
                (tuple([time.zfill(5) for time in times]), tuple(dates))) 
    result = cur.fetchall()
    existing_appts = []
    for entry in result:
        if entry[6] != id:
            existing_appts.append({'appt_id':entry[0], 'staff_id':entry[1], 'staff_name':staff_dict[entry[1]],'timeslot':entry[2], 'date':entry[3].strftime('%d/%m/%Y'), 'priority':entry[4], 'status':entry[5]})
        else:
            repeated_appts_list.append([entry[3].strftime('%d/%m/%Y'), entry[2]])

    # MAKE COMPARISON BETWEEN generated_appts AND existing_appts, CHECKING TIME, STAFF, AND DATE. 
    # IF THERE IS A PERFECT MATCH, DO NOT ADD IT TO THE FINAL, ELSE ADD IT GIVEN THAT THE SAME TIME HASN'T ALREADY BEEN ADDED

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
                all_appts_final.append(appt)
                repeated_appts_list.append([appt['date'], appt['timeslot']])
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




def choose_appointment(appt, id):
    
    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    date = appt['date']
    time = appt['timeslot']
    priority = appt['priority']
    staff_id = appt['staff_id']
    appt_details = appt['appt_details']

    try:
        appt_id = appt['appt_id']
    except KeyError:
        appt_id = None

    if not appt_id:

        # not replacing an appt

        cur.execute('''UPDATE appointments
                    SET status = 'scheduled', appt_details = %s
                    WHERE appt_date = %s AND appt_time = %s AND priority = %s AND staff_id = %s AND patient_id = %s ''', 
                    (appt_details ,date, time, priority, staff_id, id))
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

        cur.execute('''SELECT patient_id, priority, appt_date, appt_details, email
                    FROM appointments a INNER JOIN patient_view v ON a.patient_id = v.user_id
                    WHERE appt_id = %s''', (appt_id, ))
        other_id, other_priority, appt_date, other_appt_details, other_email = cur.fetchone()
        other_priority -= 1

        cur.execute('''UPDATE appointments
                    SET patient_id = %s, priority = %s, status = 'scheduled', appt_details = %s
                    WHERE appt_id = %s''', (id, priority, appt_details, appt_id))
        conn.commit()
        
        cur.execute('''SELECT user_id
            FROM staff_view
            WHERE verified='Y' ''')
        staff = cur.fetchall()
        staff_list = [i[0] for i in staff]

        times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
        '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30']

        timechange = datetime.timedelta(days=1)

        flag = False
        while not flag:
            
            day_str = appt_date.strftime('%d/%m/%Y')
            
            cur.execute('''SELECT staff_id, TO_CHAR(appt_time, 'HH24:MI')
                        FROM appointments
                        WHERE appt_date = %s''', (day_str,))
            fetched_appts = cur.fetchall()
            print(fetched_appts)

            for timeslot in times:
                print(timeslot)
                for staff_id in staff_list:
                    print(staff_id)
                    if not ((staff_id, timeslot) in fetched_appts):
                        chosen_appt = (other_id, staff_id, timeslot, day_str, other_priority, 'scheduled', other_appt_details)
                        flag = True
                        break
                    else:
                        next
                
                if flag:
                    break

            appt_date += timechange
    
        cur.execute('''INSERT INTO appointments (patient_id, staff_id, appt_time, appt_date, priority, status, appt_details)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)''', chosen_appt)
        conn.commit()

        cur.execute('''UPDATE appointments
                    SET status = 'scheduled'
                    WHERE status = %s''', (f"scheduled + reserved by {id}",))
        conn.commit()

        yag = yagmail.SMTP("gpqueue.nea@gmail.com", os.getenv('APP_PWD'))
        yag.send(
                to=other_email,
                subject="Important Appointment Information",
                contents=f'''Your appointment has been rescheduled.
                Check the website for more details.'''
            )

    cur.close()
    conn.close()

    return 'success'



def end_booking_session(id):

    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    cur.execute('''DELETE FROM appointments
                WHERE patient_id = %s AND status = 'reserved' ''', (id, ))
    conn.commit()

    cur.execute('''UPDATE appointments
                SET status = 'scheduled'
                WHERE status = %s''', (f"scheduled + reserved by {id}",))
    conn.commit()

    return 'success'