BEGIN;

-- Insert Users (2 patients and 3 staff)
INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash, salt)
VALUES
    ('John', 'Doe', 'johndoe@example.com', 'patient', 'hash12345', decode('aabbcc', 'hex')), -- Patient 1
    ('Jane', 'Smith', 'janesmith@example.com', 'patient', 'hash67890', decode('ddeeff', 'hex')), -- Patient 2
    ('Dr. Alice', 'Johnson', 'alicejohnson@example.com', 'staff', 'hashabcde', decode('112233', 'hex')), -- Staff 1
    ('Dr. Bob', 'Brown', 'bobbrown@example.com', 'staff', 'hashfghij', decode('445566', 'hex')), -- Staff 2
    ('Dr. Clara', 'Evans', 'claraevans@example.com', 'staff', 'hashklmno', decode('778899', 'hex')); -- Staff 3


INSERT INTO Patient_Details (patient_id, dob)
SELECT user_id, '1990-01-15' FROM "Users" WHERE email = 'johndoe@example.com';

INSERT INTO Patient_Details (patient_id, dob)
SELECT user_id, '1985-06-22' FROM "Users" WHERE email = 'janesmith@example.com';


INSERT INTO Staff_Details (staff_id, verified)
SELECT user_id, 'Y' FROM "Users" WHERE email = 'alicejohnson@example.com';

INSERT INTO Staff_Details (staff_id, verified)
SELECT user_id, 'Y' FROM "Users" WHERE email = 'bobbrown@example.com';

INSERT INTO Staff_Details (staff_id, verified)
SELECT user_id, 'Y' FROM "Users" WHERE email = 'claraevans@example.com';

COMMIT;
