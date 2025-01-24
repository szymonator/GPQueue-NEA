from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from flask_cors import CORS
import psycopg2
import os
from dotenv import load_dotenv
import datetime
from datetime import timedelta

from MyHash import custom_hash
from fetch_dates import processing_dates
from booking_algorithm import fetch_appointments, choose_appointment, end_booking_session

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)
CORS(app, supports_credentials=True, origins=['http://localhost:3000'], expose_headers=["Content-Type", "Authorization"])

conn_config = [os.getenv("HOST"), os.getenv("DBNAME"), os.getenv("USER"), os.getenv("PASSWORD"), os.getenv("PORT")]


@app.route('/get_token', methods=['POST'])
def get_token():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    #find email and corresponding pwd hash in db, hash pwd before checking, then return id

    try:
        conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
        cur = conn.cursor()
    except Exception as error:
        return jsonify({'error':error})
    
    cur.execute('''SELECT salt
                FROM "Users"
                WHERE email = %s''', 
                (email, ))
    
    salt = cur.fetchone()[0]
    password_hash, salt = custom_hash(password=password, salt=salt)

    cur.execute('''SELECT user_id
            FROM "Users"
            WHERE email=%s AND password_hash=%s''', 
            (email, str(password_hash)))
    fetched = cur.fetchone()
    cur.close()
    conn.close()

    if fetched == None:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    id = fetched[0]
    token = create_access_token(identity=id)
    refresh_token = create_refresh_token(identity=id)
    response = jsonify({'message': 'Login successful', 'token':token, 'refresh_token':refresh_token, 'error':None})
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
    type = names[2]

    cur.close()
    conn.close()

    return jsonify({'name':name, 'type':type})


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    password_hash, salt = custom_hash(password=data.get('password'))
    
    try:
        conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
        cur = conn.cursor()
    except Exception as error:
        return jsonify({'error':error})
    
    cur.execute('''SELECT email FROM "Users" WHERE email=%s''', (data.get('email'),))
    email_check = cur.fetchone()
    if email_check != None:
        return jsonify({"error": "Email in use"})

    cur.execute('''INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash, salt) 
                VALUES (%s, %s, %s, %s, %s, %s)''', (data.get('fname'), data.get('sname'), data.get('email'), data.get('type'), str(password_hash), salt))
    print('inserted users', data.get('fname'))
    conn.commit()
    cur.execute('''SELECT user_id FROM "Users"
                WHERE email=%s AND password_hash=%s''', (data.get('email'), str(password_hash)))
    id = cur.fetchone()[0]
    print('got id')

    if data.get('type') == 'patient':
        prev_date = data.get('dob')
        new_date = prev_date[6:10] +'-'+ prev_date[3:5] +'-'+ prev_date[0:2]
        cur.execute('''INSERT INTO Patient_Details (patient_id, dob)
                    VALUES (%s, %s)''', (id, new_date))
    else:
        cur.execute('''INSERT INTO Staff_Details (staff_id, verified)
                    VALUES (%s, 'Y')''', (id, ))
    conn.commit()

    cur.close()
    conn.close()

    token = create_access_token(identity=id)
    refresh_token = create_refresh_token(identity=id)
    response = jsonify({'message': 'registration successful', 'token':token, 'refresh_token':refresh_token, 'error':None})
    return response


@app.route('/fetchDates', methods=['GET']) 
@jwt_required()
def fetch_dates():
    priority = request.args.get('priority')
    if not priority or priority == 'null':
        end_booking_session(id)
        return jsonify({'error': 'No appt passed'}), 400
    dates = processing_dates(priority) #outsourced to another file to reduce clutter
    if dates == 'no staff':
        return jsonify({'message':'unsuccessful', 'error':'no staff', 'dates':None})
    else:
        return jsonify({'message':'fetched successfully', 'dates':dates, 'error':None}) 


@app.route('/fetchAppointments', methods=['PUT'])
@jwt_required()
def fetchAppointments():
    data = request.get_json()
    priority = data.get('priority')
    dates = data.get('dates')
    times = data.get('times')
    id = get_jwt_identity()

    if not priority or priority == 'null':
        end_booking_session(id)
        return jsonify({'error': 'No appt passed'}), 400

    print(times)
    print(dates)
    print(priority)

    appointments = fetch_appointments(priority, dates, times, id) #outsourced to another file to reduce clutter

    return jsonify({'message':'fetched successfully', 'appts':appointments, 'error':None}), 201


@app.route('/chooseAppointment', methods=['DELETE'])
@jwt_required()
def chooseAppointment():
    data = request.get_json()
    appt = data.get('appt')
    id = get_jwt_identity()
    if not appt or appt == 'null':
        end_booking_session(id)
        return jsonify({'error': 'No appt passed'}), 400
    

    confirmation = choose_appointment(appt, id)

    return jsonify({'msg':confirmation, 'error':None}), 204


@app.route('/endBookingSession', methods=['DELETE'])
@jwt_required()
def endBookingSession():
    id = get_jwt_identity()

    confirmation = end_booking_session(id)

    return jsonify({'msg':confirmation, 'error':None}), 204


@app.route('/fetchPast', methods=['GET'])
@jwt_required()
def fetchPast():
    id = get_jwt_identity()
    type = request.args.get('type')
    if not type:
        return jsonify({'error': 'No type passed'}), 400

    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    if type == 'patient':

        cur.execute('''SELECT staff_id, appt_time, TO_CHAR(appt_date, 'DD/MM/YYYY'), appt_details
                    FROM appointments
                    WHERE patient_id = %s AND status='completed' ''', (id,))
        result = cur.fetchall()
        if result == []:
            return jsonify({'error':'no appts'})

        ids = tuple([i[0] for i in result])
        cur.execute('''SELECT user_id, f_name, l_name
                    FROM staff_view
                    WHERE verified='Y' AND user_id IN %s''', (ids,))
        staff_list = cur.fetchall()

        staff_dict = {}
        for member in staff_list:
            staff_dict[member[0]] = member[1]+ ' ' +member[2]

        appts = [{'staff_name':staff_dict[i[0]], 'appt_time':i[1], 'appt_date':i[2], 'appt_details':i[3]} for i in result]
        cur.close()
        conn.close()

        return jsonify({'appts':appts}), 200

    
    elif type == 'staff':

        cur.execute('''SELECT patient_id, appt_time, TO_CHAR(appt_date, 'DD/MM/YYYY'), appt_details
                    FROM appointments
                    WHERE staff_id = %s AND status='completed' ''', (id,))
        result = cur.fetchall()
        if result == []:
            return jsonify({'error':'no appts'})

        ids = tuple([i[0] for i in result])
        cur.execute('''SELECT user_id, f_name, l_name
                    FROM patient_view
                    WHERE user_id IN %s''', (ids,))
        patient_list = cur.fetchall()

        patient_dict = {}
        for member in patient_list:
            patient_dict[member[0]] = member[1]+ ' ' +member[2]

        appts = [{'patient_name':patient_dict[i[0]], 'appt_time':i[1], 'appt_date':i[2], 'appt_details':i[3]} for i in result]
        cur.close()
        conn.close()

        return jsonify({'appts':appts}), 200
        


@app.route('/fetchFuture', methods=['GET'])
@jwt_required()
def fetchFuture():
    id = get_jwt_identity()
    type = request.args.get('type')
    if type == 'null':
        return jsonify({'error': 'No type passed'}), 400

    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    if type == 'patient':

        cur.execute('''SELECT staff_id, appt_time, TO_CHAR(appt_date, 'DD/MM/YYYY'), appt_details
                    FROM appointments
                    WHERE patient_id = %s AND status='scheduled' ''', (id,))
        result = cur.fetchall()
        if result == []:
            return jsonify({'error':'no appts'})

        ids = tuple([i[0] for i in result])
        cur.execute('''SELECT user_id, f_name, l_name
                    FROM staff_view
                    WHERE verified='Y' AND user_id IN %s''', (ids,))
        staff_list = cur.fetchall()

        staff_dict = {}
        for member in staff_list:
            staff_dict[member[0]] = member[1]+ ' ' +member[2]

        appts = [{'staff_name':staff_dict[i[0]], 'appt_time':i[1], 'appt_date':i[2], 'appt_details':i[3]} for i in result]
        
    
    elif type == 'staff':

        cur.execute('''SELECT patient_id, appt_time, TO_CHAR(appt_date, 'DD/MM/YYYY'), appt_details
                    FROM appointments
                    WHERE staff_id = %s AND status='scheduled' ''', (id,))
        result = cur.fetchall()
        if result == []:
            return jsonify({'error':'no appts'})

        ids = tuple([i[0] for i in result])
        cur.execute('''SELECT user_id, f_name, l_name
                    FROM patient_view
                    WHERE user_id IN %s''', (ids,))
        patient_list = cur.fetchall()

        patient_dict = {}
        for member in patient_list:
            patient_dict[member[0]] = member[1]+ ' ' +member[2]

        appts = [{'patient_name':patient_dict[i[0]], 'appt_time':i[1], 'appt_date':i[2], 'appt_details':i[3]} for i in result]
        
    cur.close()
    conn.close()
        
    return jsonify({'appts': appts}), 200


@app.route('/fetchApptAmount', methods=['GET'])
@jwt_required()
def fetchApptAmount():
    id = get_jwt_identity()
    type = request.args.get('type')
    print(type)

    conn = psycopg2.connect(host=conn_config[0], dbname=conn_config[1], user=conn_config[2], password=conn_config[3], port=conn_config[4])
    cur = conn.cursor()

    if type == 'patient':
        cur.execute('''SELECT appt_id
                    FROM appointments
                    WHERE status = 'scheduled' AND patient_id = %s ''', (id,))
        amount = len(cur.fetchall())
        print(amount)
        return jsonify({'amount':amount}), 200
    
    elif type == 'staff':
        cur.execute('''SELECT appt_id
                    FROM appointments
                    WHERE status = 'scheduled' AND staff_id = %s ''', (id,))
        amount = len(cur.fetchall())
        
        now = datetime.datetime.now()
        today = now.strftime('%d/%m/%Y')
        cur.execute('''SELECT appt_id
                    FROM appointments
                    WHERE status = 'scheduled' AND staff_id = %s AND appt_date = %s''', (id, today))
        today_amount = len(cur.fetchall())
        print(amount)
        print(today_amount)
        return jsonify({'amount':amount, 'todayAmount':today_amount}), 200
    else:
        return jsonify({'error': 'No type passed'}), 400


@app.route('/refreshJWT', methods=['POST'])
@jwt_required(refresh=True)
def refreshJWT():
    id = get_jwt_identity()
    new_access_token = create_access_token(identity=id)
    return jsonify({'message':'token sent', 'token':new_access_token})



# starts the backend
if __name__ == '__main__':
    app.run(debug=True)