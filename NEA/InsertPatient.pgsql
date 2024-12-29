BEGIN;
INSERT INTO "Users" (f_name, l_name, email, password_hash)
VALUES (fname, sname, email, pwdhash)
RETURNING user_id;

INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
VALUES (lastval(), date, '', '')
COMMIT;