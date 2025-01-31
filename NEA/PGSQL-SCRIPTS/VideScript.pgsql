-- Begin transaction
BEGIN;

-- Add 48 patients with different names and email addresses
DO $$
DECLARE
    i INTEGER := 1;
BEGIN
    WHILE i <= 48 LOOP
        INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash, salt)
        VALUES (
            'Patient' || i, 
            'Lastname' || i, 
            'patient' || i || '@example.com', 
            'patient', 
            'password_hash_placeholder', 
            'salt_placeholder'
        );
        
        INSERT INTO Patient_Details (patient_id, dob)
        VALUES (
            (SELECT user_id FROM "Users" WHERE email = 'patient' || i || '@example.com'), 
            '1990-01-01'
        );
        i := i + 1;
    END LOOP;
END $$;

-- Add a new staff member
DO $$
BEGIN
    INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash, salt)
    VALUES (
        'NewStaff', 
        'Member', 
        'staffmember@example.com', 
        'staff', 
        'password_hash_placeholder', 
        'salt_placeholder'
    );

    INSERT INTO Staff_Details (staff_id, verified)
    VALUES (
        (SELECT user_id FROM "Users" WHERE email = 'staffmember@example.com'), 
        'Y'
    );
END $$;

-- Add future appointments for every new patient
DO $$
DECLARE
    patient_ids INTEGER[] := ARRAY(SELECT patient_id FROM Patient_Details WHERE patient_id > 1 ORDER BY patient_id);
    staff_ids INTEGER[] := ARRAY[2, (SELECT user_id FROM "Users" WHERE email = 'staffmember@example.com')];
    incrementing_time TIME := '09:00';
    end_time TIME := '20:30';
    appointment_date DATE := '2025-01-29';
    i INTEGER := 1;
    j INTEGER := 1;
BEGIN
    -- Loop through all patients and assign them appointments
    FOR i IN 1..ARRAY_LENGTH(patient_ids, 1) LOOP
        -- Assign a staff member alternately
        INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
        VALUES (
            patient_ids[i],
            staff_ids[j],
            3,
            appointment_date,
            TO_CHAR(incrementing_time, 'HH24:MI'),
            'scheduled',
            'placeholder symptom'
        );

        -- Alternate staff members after every 24 patients
        IF i % 24 = 0 THEN
            j := 3 - j; -- Flip between 1 and 2 (staff_ids[1] and staff_ids[2])
        END IF;

        -- Increment time and reset if exceeding the day
        incrementing_time := incrementing_time + INTERVAL '30 minutes';
        IF incrementing_time > end_time THEN
            incrementing_time := '09:00';
        END IF;
    END LOOP;
END $$;

-- Add 6 past appointments for staff_id = 2 and patient_id = 1
DO $$
DECLARE
    incrementing_time TIME := '09:00';
    appointment_date DATE := '2025-01-20';
    i INTEGER := 1;
BEGIN
    WHILE i <= 6 LOOP
        INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
        VALUES (
            1, 
            2, 
            2, 
            appointment_date, 
            TO_CHAR(incrementing_time, 'HH24:MI'), 
            'completed', 
            'placeholder symptom'
        );
        
        -- Increment the time by 30 minutes
        incrementing_time := incrementing_time + INTERVAL '30 minutes';
        i := i + 1;
    END LOOP;
END $$;

-- Add 6 past appointments for the new staff member and patient_id = 1
DO $$
DECLARE
    incrementing_time TIME := '09:00';
    appointment_date DATE := '2025-01-19';
    new_staff_id INTEGER := (SELECT user_id FROM "Users" WHERE email = 'staffmember@example.com');
    i INTEGER := 1;
BEGIN
    WHILE i <= 6 LOOP
        INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
        VALUES (
            1, 
            new_staff_id, 
            2, 
            appointment_date, 
            TO_CHAR(incrementing_time, 'HH24:MI'), 
            'completed', 
            'placeholder symptom'
        );
        
        -- Increment the time by 30 minutes
        incrementing_time := incrementing_time + INTERVAL '30 minutes';
        i := i + 1;
    END LOOP;
END $$;

-- Commit all changes
COMMIT;
