BEGIN;

DO $$
DECLARE
    start_time TIME := '09:00';
    end_time TIME := '20:30';
    "current_time" TIME := start_time;
    staff_ids INTEGER[] := ARRAY[3, 4];
    patient_ids INTEGER[] := ARRAY[1, 2];
    appt_date DATE := '2025-01-10';
    staff_index INTEGER := 1;
    patient_index INTEGER := 1;
    appointment_count INTEGER := 1;
BEGIN
    -- Loop through the time slots
    WHILE "current_time" <= end_time LOOP
        -- Alternate between staff members and patients
        INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
        VALUES (
            patient_ids[patient_index], 
            staff_ids[staff_index], 
            appointment_count, -- Assign appointment count as priority
            appt_date, 
            "current_time"::VARCHAR, 
            'scheduled'
        );

        -- Switch staff and patient alternately
        staff_index := 3 - staff_index; -- Flip between 1 and 2
        patient_index := 3 - patient_index; -- Flip between 1 and 2
        
        -- Increment the time by 30 minutes
        "current_time" := "current_time" + INTERVAL '30 minutes';
    END LOOP;
END $$;

COMMIT;
