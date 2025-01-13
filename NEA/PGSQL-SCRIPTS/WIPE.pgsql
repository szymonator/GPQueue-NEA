DO $$ 
BEGIN
    -- Temporarily disable foreign key constraints
    EXECUTE 'SET session_replication_role = replica';

    EXECUTE 'DELETE FROM "Users" WHERE user_id=11';
    EXECUTE 'DELETE FROM patient_details WHERE patient_id=11';

    -- Delete rows from child tables first to respect foreign key constraints
    --EXECUTE 'DELETE FROM Appointments';
    --EXECUTE 'DELETE FROM Patient_Details';
    --EXECUTE 'DELETE FROM Staff_Details';

    -- Delete rows from the parent table last
   -- EXECUTE 'DELETE FROM "Users"';

    -- Re-enable foreign key constraints
    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;