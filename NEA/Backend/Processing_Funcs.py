import psycopg2

def Hash():
    return '12345'

def register_patient(details):
    
    fname = details['fname']
    sname = details['sname']
    email = details['email']
    password_hash = Hash(details['password'])
    dob = details['dob']