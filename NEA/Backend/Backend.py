from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import psycopg2
import datetime
import calendar
import os
from dotenv import load_dotenv

from MyHash import custom_hash
from fetch_dates import processing_dates

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
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
                VALUES (%s, %s, %s, %s, %s, %s)''', (data.get('fname'), data.get('sname'), data.get('email'), data.get('type'), password_hash, salt))
    print('inserted users', data.get('fname'))
    conn.commit()
    cur.execute('''SELECT user_id FROM "Users"
                WHERE email=%s AND password_hash=%s''', (data.get('email'), password_hash))
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
    return jsonify(processing_dates(priority)) #outsourced to another file to reduce clutter


@app.route('/fetchAppointments', methods=['PUT'])
@jwt_required()
def fetchAppointments():
    data = request.get_json()

# starts the backend
if __name__ == '__main__':
    app.run(debug=True)