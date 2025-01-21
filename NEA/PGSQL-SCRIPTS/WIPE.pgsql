DO $$ 
BEGIN
    EXECUTE 'SET session_replication_role = replica';

    EXECUTE 'DELETE FROM "Users" WHERE user_id=11';
    EXECUTE 'DELETE FROM patient_details WHERE patient_id=11';

    --EXECUTE 'DELETE FROM Appointments';
    --EXECUTE 'DELETE FROM Patient_Details';
    --EXECUTE 'DELETE FROM Staff_Details';

   -- EXECUTE 'DELETE FROM "Users"';

    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;