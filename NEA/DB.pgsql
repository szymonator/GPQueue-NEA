CREATE TABLE IF NOT EXISTS "Users" (
    user_id SERIAL PRIMARY KEY,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type VARCHAR(255) NOT NULL CHECK ( user_type IN ('patient', 'staff')),
    password_hash INTEGER NOT NULL,
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
    patient_id INTEGER NOT NULL,
    staff_id INTEGER NOT NULL,
    msg_direction VARCHAR(20) NOT NULL CHECK (msg_direction IN ('s->p', 'p->s')),
    subject TEXT,
    msg_text TEXT,
    msg_sent TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL CHECK (status IN ('unseen', 'seen')),
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
    sd.verified
FROM "Users" u
JOIN Staff_Details sd ON u.user_id = sd.staff_id;