import React from "react";
import {useState, useEffect} from "react";

export{
    Timer
}

function Timer() {

    const city = {name: 'London', timezone:'Europe/London'}

    const [time, setTime] = useState(new Date());
    const formattedTime = time.toLocaleTimeString("en-UK", {timeZone: city.timezone})
    
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()));
    }, 1000)

    return(
        <>
            <p style={{marginLeft:'10px'}}>{formattedTime}</p>
        </>
    );
}