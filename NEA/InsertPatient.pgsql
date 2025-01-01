BEGIN;
INSERT INTO "Users" (f_name, l_name, email, password_hash)
VALUES ('Szymon', 'Galutowski', 'S.Galutowski@gmail.com', 12345)
RETURNING user_id;

INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
VALUES (lastval(), '5/1/2007', '', '');
COMMIT;