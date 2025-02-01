ALTER DATABASE "GPQueue" SET DateStyle = 'DMY';

CREATE TABLE IF NOT EXISTS "Users" (
    user_id SERIAL PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type VARCHAR(255) NOT NULL CHECK ( user_type IN ('patient', 'staff')),
    password_hash TEXT NOT NULL,
    salt BYTEA NOT NULL,
    refresh_token_hash TEXT,
    refresh_token_salt BYTEA,
    register_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Patient_Details (
    patient_id INTEGER PRIMARY KEY,
    dob DATE NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES "Users"(user_id)
);

CREATE TABLE IF NOT EXISTS Staff_Details (
    staff_id INTEGER PRIMARY KEY,
    verified VARCHAR(5) NOT NULL CHECK (verified IN ('Y', 'N')),
    FOREIGN KEY (staff_id) REFERENCES "Users"(user_id)
);

CREATE TABLE IF NOT EXISTS Appointments (
    appt_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    priority INTEGER NOT NULL,
    appt_date DATE NOT NULL,
    appt_time TIME NOT NULL,
    appt_details TEXT,
    creation_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,
    -- RESERVED IS FOR APPOINTMENTS THAT MAY BE CHOSEN BY THE USER WHILE BOOKING,
    -- SCHEDULED + RESERVED IS FOR APPOINTMENTS THAT MAY BE CHOSEN BY THE USER WHILE BOOKING, 
    -- WHILE THE APPT IS ALREADY SCHEDULED WITH ANOTHER USER
    -- status IN ('scheduled', 'completed', 'reserved', 'scheduled + reserved by <OTHER ID>'))
    FOREIGN KEY (patient_id) REFERENCES Patient_Details(patient_id),
    FOREIGN KEY (staff_id) REFERENCES Staff_Details(staff_id)
);

CREATE VIEW Patient_View AS
SELECT 
    u.user_id,
    u.f_name,
    u.l_name,
    u.email,
    u.password_hash,
    u.register_date,
    u.salt,
    pd.dob
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
    u.salt,
    sd.verified
FROM "Users" u
JOIN Staff_Details sd ON u.user_id = sd.staff_id;