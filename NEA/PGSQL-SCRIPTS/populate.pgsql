BEGIN;

DO $$
DECLARE
    start_time TIME := '09:00';
    end_time TIME := '12:00';
    "current_time" TIME := start_time;
    staff_ids INTEGER[] := ARRAY[5,3,4];
    patient_ids INTEGER[] := ARRAY[1,2];
    appt_date DATE := '2025-01-14';
    staff_index INTEGER := 1;
    patient_index INTEGER := 1;
    appointment_count INTEGER := 3;
BEGIN
    WHILE "current_time" <= end_time LOOP
        INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
        VALUES (
            patient_ids[patient_index], 
            staff_ids[staff_index], 
            appointment_count, 
            appt_date, 
            LEFT("current_time"::VARCHAR, 5),
            'scheduled'
        );

        
        staff_index := 3 - staff_index; 
        patient_index := 3 - patient_index; 
        
        
        "current_time" := "current_time" + INTERVAL '30 minutes';
    END LOOP;
END $$;


COMMIT;
