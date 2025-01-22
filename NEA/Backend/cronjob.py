# This will be the script that my cronjob runs
#first we change appt status, then we do reminders

import psycopg2
from dotenv import load_dotenv
import os
import datetime
import yagmail

load_dotenv()
conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]

now = datetime.datetime.now()
date = now.strftime('%Y-%m-%d')
time = now.strftime('%H:%M')
timechange_week = datetime.timedelta(days=7)
timechange_day = datetime.timedelta(days=1)
timechange_appt = datetime.timedelta(minutes=29)
week = (now + timechange_week).strftime('%d/%m/%Y')
day = (now + timechange_day).strftime('%d/%m/%Y')
next_appt = (now + timechange_appt).strftime('%H:%M')


conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
cur = conn.cursor()

print(date, time)

cur.execute('''UPDATE appointments
            SET status = 'completed'
            WHERE appt_date <= %s AND appt_time::TIME < %s::TIME ''', (date, time,))
yag = yagmail.SMTP("gpqueue.nea@gmail.com", os.getenv('APP_PWD'))


#week before reminder for patients
time = '09:01'
if time == '09:01':
    cur.execute('''SELECT patient_id 
                FROM appointments 
                WHERE appt_date = %s''', (week,))
    result = cur.fetchall()
    result = tuple([i[0] for i in result])

    if len(result) > 0:
        cur.execute('''SELECT email
                    FROM "Users"
                    WHERE user_id IN %s''', (result, ))
        emails = [i[0] for i in cur.fetchall()]
        for email in emails:
            yag.send(
                to=email,
                subject="Appointment Reminder",
                contents=f'''This is your reminder email! You have an appointment in a week on {week}.
                Check the website for more details.'''
            )

    #day before reminder for patients
    cur.execute('''SELECT patient_id 
                FROM appointments 
                WHERE appt_date = %s''', (day,))
    result = cur.fetchall()
    result = tuple([i[0] for i in result])

    if len(result) > 0:
        cur.execute('''SELECT email
                    FROM "Users"
                    WHERE user_id IN %s''', (result, ))
        emails = [i[0] for i in cur.fetchall()]
        for email in emails:
            yag.send(
                to=email,
                subject="Appointment Reminder",
                contents=f'''This is your reminder email! You have an appointment in a day on {day}.
                Check the website for more details.'''
            )


# 30min before reminder for staff
cur.execute('''SELECT staff_id
            FROM appointments 
            WHERE appt_date = %s AND appt_time = %s''', (date, next_appt))
result = cur.fetchall()
result = tuple([i[0] for i in result])

if len(result) > 0:
    cur.execute('''SELECT email
                    FROM "Users"
                    WHERE user_id IN %s''', (result, ))
    emails = [i[0] for i in cur.fetchall()]
    for email in emails:
            yag.send(
                to=email,
                subject="Appointment Reminder",
                contents=f'''This is your reminder email! You have an appointment with a patient in 30 minutes at {next_appt}.
                Check the website for more details.'''
            )


cur.close()
conn.close()






