DO $$ 
BEGIN
    EXECUTE 'SET session_replication_role = replica';

    -- EXECUTE 'DELETE FROM "Users" WHERE user_id=5';
    -- EXECUTE 'DELETE FROM staff_details WHERE staff_id=5';

    -- EXECUTE 'DELETE FROM Appointments';
    --EXECUTE 'DELETE FROM Patient_Details';
    --EXECUTE 'DELETE FROM Staff_Details';

   -- EXECUTE 'DELETE FROM "Users"';

    EXECUTE 'SET session_replication_role = DEFAULT';
END $$;