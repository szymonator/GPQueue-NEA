-- BEGIN;

-- DO $$
-- DECLARE
--     start_time TIME := '09:00';
--     end_time TIME := '12:00';
--     "incrementing_time" TIME := start_time;
--     staff_ids INTEGER[] := ARRAY[5,3,4];
--     patient_ids INTEGER[] := ARRAY[1,2];
--     appt_date DATE := '2025-01-14';
--     staff_index INTEGER := 1;
--     patient_index INTEGER := 1;
--     appointment_count INTEGER := 3;
-- BEGIN
--     WHILE "incrementing_time" <= end_time LOOP
--         INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
--         VALUES (
--             patient_ids[patient_index], 
--             staff_ids[staff_index], 
--             appointment_count, 
--             appt_date, 
--             LEFT("incrementing_time"::VARCHAR, 5),
--             'scheduled'
--         );

        
--         staff_index := 3 - staff_index; 
--         patient_index := 3 - patient_index; 
        
        
--         "incrementing_time" := "incrementing_time" + INTERVAL '30 minutes';
--     END LOOP;
-- END $$;


-- COMMIT;

-- BEGIN;

-- -- Insert a new user into the Users table
-- INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash, salt)
-- VALUES ('John', 'Doe', 'johndoe@example.com', 'patient', 'hashed_password', '\xDEADBEEF')
-- RETURNING user_id;

-- -- Assume the returned user_id is 7 (replace it with the actual returned id)
-- -- Insert the corresponding record into the Patient_Details table
-- INSERT INTO Patient_Details (patient_id, dob)
-- VALUES (7, '1990-01-01');

-- COMMIT;

-- BEGIN;

-- Insert appointments at 30-minute intervals
DO $$
DECLARE
    incrementing_time TIME := '09:00';
    end_time TIME := '20:30';
BEGIN
    WHILE incrementing_time <= end_time LOOP
        INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
        VALUES (7, 6, 3, '2025-01-26', TO_CHAR(incrementing_time, 'HH24:MI'), 'scheduled');
        
        -- Increment the time by 30 minutes
        incrementing_time := incrementing_time + INTERVAL '30 minutes';
    END LOOP;
END $$;

COMMIT;

-- BEGIN;

-- -- Update appt_time to be in the format hh:mm
-- UPDATE Appointments
-- SET priority = TO_CHAR(TO_TIMESTAMP(appt_time, 'HH24:MI:SS'), 'HH24:MI')
-- WHERE appt_date = '2025-01-26';

-- COMMIT;

-- BEGIN;
-- INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
-- VALUES (1, 6, 1, '2025-01-31', '17:00', 'scheduled', 'scary symptom 3');
-- COMMIT;