-- Begin transaction
BEGIN;

-- Add an appointment at 18:30 today for the staff member with id = 2
INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
VALUES (
    1, -- No patient assigned for this appointment
    2,    -- Staff member with id = 2
    3,    -- Priority
    CURRENT_DATE, -- Today's date
    '19:00', -- Appointment time
    'scheduled', -- Status
    'placeholder symptom'
);

-- Add an appointment tomorrow for the patient with id = 1
INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
VALUES (
    1,    -- Patient with id = 1
    2,    -- Staff member with id = 2
    2,    -- Priority
    CURRENT_DATE + INTERVAL '1 day', -- Tomorrow's date
    '10:30', -- Appointment time
    'scheduled', -- Status
    'placeholder symptom'
);

-- Add an appointment next week for the patient with id = 1
INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status, appt_details)
VALUES (
    1,    -- Patient with id = 1
    2,    -- Staff member with id = 2
    2,    -- Priority
    CURRENT_DATE + INTERVAL '7 days', -- Next week's date
    '10:30', -- Appointment time
    'scheduled', -- Status
    'placeholder symptom'
);

-- Commit transaction
COMMIT;
