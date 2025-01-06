import datetime
import calendar
import psycopg2





conn_config = ['localhost', 'GPQueue', 'postgres', '@dm1n', '5432']


def fetch_dates():
    priority = 2

    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    
    # 24 available appointments a day PER verified doctor (staff)
    cur.execute('''SELECT staff_id FROM Staff_Details WHERE verified='Y' ''')
    amount = len(cur.fetchall())
    daily_amount = 24*amount
        
    now = datetime.datetime.now()
    current_month = int(now.strftime('%m'))
    current_year = int(now.strftime('%Y'))

    days_list = []
    for i in range(current_month, current_month+3):
            if i > 12:
                j = i - 12
                y = current_year+1
            else:
                j = i
                y = current_year
            days_list.append(
                [str(d).zfill(2)+'/'+str(j).zfill(2)+'/'+str(y) for d in range(1,calendar.monthrange(y, j)[-1]+1)]
            )

    dates = {'dates':[dict.fromkeys(days_list[i], False) for i in range(3)]}
    between = [now.strftime('%d/%m/%Y'), days_list[0][-1], days_list[1][0], days_list[1][-1], days_list[2][0], days_list[2][-1]]

    for i in range(3):
        cur.execute('''SELECT TO_CHAR(appt_date, 'DD/MM/YYYY') FROM Appointments WHERE status = 'scheduled' AND appt_date BETWEEN %s AND %s''', (between[2*i], between[2*i + 1]))
        appts = cur.fetchall()

        for key in dates['dates'][i]:
            count = appts.count((key, ))
            if count < daily_amount:
                dates['dates'][i][key] = True  
            else:
                dates['dates'][i][key] = False

    for key in dates['dates'][0]:
        if key == now.strftime('%d/%m/%Y'):
              dates['dates'][0][key] = False
              break
        else:
            dates['dates'][0][key] = False
              
    
    return dates

for i in []:
     print('hi')