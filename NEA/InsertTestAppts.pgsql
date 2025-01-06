BEGIN;

-- Insert Users (patients and staff)
INSERT INTO "Users" (f_name, l_name, email, user_type, password_hash) 
VALUES
    ('John', 'Doe', 'john.doe@example.com', 'patient', 1234),
    ('Jane', 'Smith', 'jane.smith@example.com', 'patient', 2345),
    ('Bob', 'Johnson', 'bob.johnson@example.com', 'staff', 3456),
    ('Alice', 'Williams', 'alice.williams@example.com', 'staff', 4567),
    ('Charlie', 'Brown', 'charlie.brown@example.com', 'staff', 5678);

-- Insert Patient Details (with matching user_id for patients)
INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
VALUES
    (1, '1990-05-15', 'Hypertension', 'Lisinopril'),
    (2, '1985-08-20', 'Diabetes', 'Metformin');

-- Insert Staff Details (with matching user_id for staff)
INSERT INTO Staff_Details (staff_id, verified)
VALUES
    (3, 'Y'),
    (4, 'Y'),
    (5, 'N');

-- Insert Appointments (with matching patient_id and staff_id)
INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
VALUES
    (1, 3, 1, '2025-01-15', '09:00', 'scheduled'),
    (2, 4, 2, '2025-01-15', '10:30', 'scheduled'),
    (1, 5, 3, '2025-01-16', '14:00', 'scheduled'),
    (2, 3, 1, '2025-01-16', '15:30', 'scheduled'),
    (1, 4, 2, '2025-01-17', '09:00', 'scheduled'),
    (2, 5, 1, '2025-01-17', '11:30', 'scheduled'),
    (1, 3, 3, '2025-01-18', '13:00', 'scheduled'),
    (2, 4, 2, '2025-01-18', '16:00', 'scheduled'),
    (1, 5, 1, '2025-01-19', '10:00', 'scheduled'),
    (2, 3, 3, '2025-01-19', '11:30', 'scheduled');

-- More appointments for February and March 2025 (following the same structure)
-- February 2025
INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
VALUES
    (1, 3, 1, '2025-02-01', '09:00', 'scheduled'),
    (2, 4, 2, '2025-02-01', '10:30', 'scheduled'),
    (1, 5, 3, '2025-02-02', '14:00', 'scheduled'),
    (2, 3, 1, '2025-02-02', '15:30', 'scheduled'),
    (1, 4, 2, '2025-02-03', '09:00', 'scheduled'),
    (2, 5, 1, '2025-02-03', '11:30', 'scheduled');

-- March 2025
INSERT INTO Appointments (patient_id, staff_id, priority, appt_date, appt_time, status)
VALUES
    (1, 3, 1, '2025-03-01', '09:00', 'scheduled'),
    (2, 4, 2, '2025-03-01', '10:30', 'scheduled'),
    (1, 5, 3, '2025-03-02', '14:00', 'scheduled'),
    (2, 3, 1, '2025-03-02', '15:30', 'scheduled'),
    (1, 4, 2, '2025-03-03', '09:00', 'scheduled'),
    (2, 5, 1, '2025-03-03', '11:30', 'scheduled');

COMMIT;
