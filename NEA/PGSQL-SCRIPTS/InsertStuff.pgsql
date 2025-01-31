-- BEGIN;
-- INSERT INTO "Users" (f_name, l_name, email, password_hash)
-- VALUES ('Szymon', 'Galutowski', 'S.Galutowski@gmail.com', 12345)
-- RETURNING user_id;

-- INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
-- VALUES (lastval(), '5/1/2007', '', '');
-- COMMIT;

BEGIN;

INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
        VALUES (
            1, 
            2, 
            3, -- Assign appointment count as priority
            '26/01/2025', 
            '18:00',
            'scheduled',
            'Other'
        );
COMMIT;