import React from "react";
import {useState, useEffect} from "react";

export{
    Timer
}

function Timer() {

    const [time, setTime] = useState(new Date());
    const formattedTime = time.toLocaleTimeString()
    const formattedDate = formatDate(time);
    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(timer);
    }, [])

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return(
        <>
            <p style={{marginLeft:'10px'}}>{formattedDate} {formattedTime}</p>
        </>
    );
}