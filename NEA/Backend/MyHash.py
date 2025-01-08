import os
import hashlib

def custom_hash(password, salt=None):

    if not salt:
        used_salt = os.urandom(16) # for uniqueness
    else:
        used_salt = salt

    hash_value = hashlib.pbkdf2_hmac('sha256', password.encode(), used_salt, 100000) # very strong recursive hashing algorithm
    hash_value_int = int.from_bytes(hash_value, byteorder='big')

    return hash_value_int, used_salt
