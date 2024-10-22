CREATE TABLE IF NOT EXISTS "Users" (
    user_id SERIAL PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) UNIQUE NOT NULL,
    register_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Patient_Details (
    patient_id INTEGER PRIMARY KEY,
    dob DATE NOT NULL,
    medical_history TEXT,
    prescriptions TEXT,
    FOREIGN KEY (patient_id) REFERENCES "Users"(user_id)
);

CREATE TABLE IF NOT EXISTS Staff_Details (
    staff_id INTEGER PRIMARY KEY,
    room_n INTEGER,
    verified VARCHAR(5) NOT NULL CHECK (verified IN ('Y', 'N')),
    FOREIGN KEY (staff_id) REFERENCES "Users"(user_id)
);

CREATE TABLE IF NOT EXISTS Appointments (
    appt_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    priority INTEGER,
    appt_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    appt_details TEXT,
    FOREIGN KEY (patient_id) REFERENCES Patient_Details(patient_id),
    FOREIGN KEY (staff_id) REFERENCES Staff_Details(staff_id)
);

CREATE TABLE IF NOT EXISTS Messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    recipient_id INTEGER NOT NULL,
    subject TEXT,
    msg_text TEXT,
    msg_sent TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('unseen', 'seen')),
    FOREIGN KEY (sender_id) REFERENCES "Users"(user_id),
    FOREIGN KEY (recipient_id) REFERENCES "Users"(user_id)
);

CREATE VIEW Patient_View AS
SELECT 
    u.user_id,
    u.f_name,
    u.l_name,
    u.email,
    u.password_hash,
    u.register_date,
    pd.dob,
    pd.medical_history,
    pd.prescriptions
FROM "Users" u
JOIN Patient_Details pd ON u.user_id = pd.patient_id;

CREATE VIEW Staff_View AS
SELECT 
    u.user_id,
    u.f_name,
    u.l_name,
    u.email,
    u.password_hash,
    u.register_date,
    sd.room_n,
    sd.verified
FROM "Users" u
JOIN Staff_Details sd ON u.user_id = sd.staff_id;

-- Example insertions 
BEGIN;
INSERT INTO "Users" (f_name, l_name, email, password_hash)
VALUES ('Sadiq', 'Ali', 'sadiq.ali@example.com', '329084904')
RETURNING user_id;

INSERT INTO Patient_Details (patient_id, dob, medical_history, prescriptions)
VALUES (
    lastval(),
    '1990-01-01',
    'No major issues',
    'Vitamin D'
);
COMMIT;

-- Insert a staff member
BEGIN;
INSERT INTO "Users" (f_name, l_name, email, password_hash)
VALUES ('Daniel', 'Dalik', 'daniel.dalik@example.com', '748394793')
RETURNING user_id;

INSERT INTO Staff_Details (staff_id, room_n, verified)
VALUES (
    lastval(),
    101,
    'N'
);
COMMIT;