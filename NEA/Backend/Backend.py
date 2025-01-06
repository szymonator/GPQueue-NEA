from threading import Thread, Lock
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import psycopg2
import datetime
import calendar

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'W00dh0uśęC0llęgę2024!'
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)
CORS(app, supports_credentials=True, origins=['http://localhost:3000'], expose_headers=["Content-Type", "Authorization"])

conn_config = ['localhost', 'GPQueue', 'postgres', '@dm1n', '5432']

def Hash(value):
    return value


@app.route('/get_token', methods=['POST'])
def get_token():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    #find email and corresponding pwd hash in db, hash pwd before checking, then return id

    password_hash = password # IMPLEMENT HASHING ALGORITHM

    try:
        conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
        cur = conn.cursor()
    except Exception as error:
        return jsonify({'error':error})
    
    cur.execute('''SELECT user_id
            FROM "Users"
            WHERE email=%s AND password_hash=%s''', (email, str(password_hash)))
    fetched = cur.fetchone()
    cur.close()
    conn.close()

    if fetched == None:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    id = fetched[0]
    token = create_access_token(identity=id)
    response = jsonify({'message': 'Login successful'})
    response.set_data(value=token)
    return response
    


@app.route('/get_name', methods=['GET'])
@jwt_required()
def get_name():
    id = get_jwt_identity()

    try:
        conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
        cur = conn.cursor()
    except Exception as error:
        return jsonify({'error':error})

    cur.execute('''SELECT f_name, l_name, user_type FROM "Users" WHERE user_id=%s''', (id,))
    names = cur.fetchone()
    name = names[0]+ ' ' +names[1]  

    cur.close()
    conn.close()

    return jsonify({'name':name})


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    password_hash = Hash(data.get('password'))
    
    try:
        conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
        cur = conn.cursor()
    except Exception as error:
        return jsonify({'error':error})
    
    cur.execute('''SELECT email FROM "Users" WHERE email=%s''', (data.get('email'),))
    email_check = cur.fetchone()
    if email_check != None:
        return jsonify({"error": "Email in use"})

    cur.execute('''INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash) 
                VALUES (%s, %s, %s, %s, %s)''', (data.get('fname'), data.get('sname'), data.get('email'), data.get('type'),str(password_hash),))
    print('inserted users', data.get('fname'))
    conn.commit()
    cur.execute('''SELECT user_id FROM "Users"
                WHERE email=%s AND password_hash=%s''', (data.get('email'), str(password_hash)))
    id = cur.fetchone()[0]
    print('got id')

    if data.get('type') == 'patient':
        prev_date = data.get('dob')
        new_date = prev_date[6:10] +'-'+ prev_date[3:5] +'-'+ prev_date[0:2]
        cur.execute('''INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
                    VALUES (%s, %s, '', '')''', (id, new_date))
    else:
        cur.execute('''INSERT INTO Staff_Details (staff_id, verified)
                    VALUES (%s, 'Y')''', (id, ))
    conn.commit()
    print('finished insertion')

    cur.close()
    conn.close()

    token = create_access_token(identity=id)
    response = jsonify({'message': 'registration successful'})
    response.set_data(value=token)
    return response


@app.route('/fetchDates', methods=['GET'])
@jwt_required()
def fetch_dates():
    priority = request.args.get('priority')
    print(priority)
    try:
        conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
        cur = conn.cursor()
    except Exception as error:
        return jsonify({'error':error})
    
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

    dates = {'dates':[dict.fromkeys(days_list[i], '') for i in range(3)]}

    for i in range(3):
        cur.execute('''SELECT TO_CHAR(appt_date, 'DD/MM/YYYY') FROM Appointments WHERE status = 'scheduled' AND appt_date BETWEEN %s AND %s''', (days_list[i][0], days_list[i][-1]))
        appts = cur.fetchall()

        for key in dates['dates'][i]:
            count = appts.count((key, ))
            if count < daily_amount:
                dates['dates'][i][key] = True  
            else:
                dates['dates'][i][key] = False

    for i in range(3): # -------> -------> -------> -------> -------> -------> -------> -------> -------> -------> -------> if appt in table priority is greater than user priority, it should mark as true
        cur.execute('''SELECT TO_CHAR(appt_date, 'DD/MM/YYYY') FROM Appointments WHERE status = 'scheduled' AND (appt_date BETWEEN %s AND %s) AND priority>%s''', (days_list[i][0], days_list[i][-1], priority))
        appts = cur.fetchall()

        if len(appts) == 0:
            break

        for key in dates['dates'][i]:
            if (key, ) in appts and not dates['dates'][i][key]:
                dates['dates'][i][key] = True



    for key in dates['dates'][0]:
        if key == now.strftime('%d/%m/%Y'):
              dates['dates'][0][key] = False
              break
        else:
            dates['dates'][0][key] = False
    

    return jsonify(dates)


# starts the backend
if __name__ == '__main__':
    app.run(debug=True)