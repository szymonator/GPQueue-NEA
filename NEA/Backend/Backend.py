from threading import Thread, Lock
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import psycopg2

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
        return jsonify(error)
    
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
        return jsonify(error)

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
        return jsonify(error)

    cur.execute('''INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash) 
                VALUES (%s, %s, %s, %s, %s)''', (data.get('fname'), data.get('sname'), data.get('email'), data.get('type'),str(password_hash),))
    print('inserted users', data.get('fname'))
    conn.commit()
    cur.execute('''SELECT user_id FROM "Users"
                WHERE email=%s AND password_hash=%s''', (data.get('email'), str(password_hash)))
    id = cur.fetchone()[0]
    print('got id')
    if data.get('type') == 'patient':
        cur.execute('''INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
                    VALUES (%s, %s, '', '')''', (id, data.get('dob')))
    else:
        cur.execute('''INSERT INTO Staff_Details (staff_id, verified)
                    VALUES (%s, 'N')''', (id, ))
    conn.commit()
    print('finished insertion')

    cur.close()
    conn.close()

    token = create_access_token(identity=id)
    response = jsonify({'message': 'registration successful'})
    response.set_data(value=token)
    return response


# starts the backend
if __name__ == '__main__':
    app.run(debug=True)