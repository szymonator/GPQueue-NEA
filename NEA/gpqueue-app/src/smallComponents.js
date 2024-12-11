import React from "react";
import {useState, useEffect, useNavigate} from "react";
import { useUser } from "./userContext";
import Stack from "./stack";

export{
    Timer,
    Back,
    hubOrSub,
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


function Back() {

    let { cookies, setCookies } = useUser();
    const navigate = useNavigate();

    const handleClick = (event) => {
        let prevPage = cookies.prevPageStack.pop()
        let newCookies = {
            type: cookies.type,
            name: cookies.name,
            id: cookies.id,
            prevPageStack: cookies.prevPageStack, //TODO - HYDRATE STACK AND POP FROM TOP, THEN DEHYDRATE IT BACK
            currentPage: prevPage
        }
        setCookies(newCookies)
        navigate('/'+prevPage)
    }

    return(
        <>
        <div className={'Back'} onClick={handleClick}>
            <h3>Back</h3>
        </div>
        </>
    );

}

function hubOrSub(pageName, cookies) { //UPON CALLING THIS FUNCTION, PASS IN THE PAGE NAME AND THE COOKIES FROM USEUSER()
    
    //WE HAVE 2 TYPES OF PAGE, A HUB AND A SUB.
    // A HUB IS A PAGE WITH NO BACK BUTTONS, SUCH AS THE HOMEPAGE
    // A SUB IS A PAGE WITH A BACK BUTTON
    // UPON ENTERING A HUB, THE STACK MUST BE WIPED

    const hubOrSubDict = {
        'home':'hub',
        'appointments':'hub',
        'futureAppointments':'sub',
        'pastAppointments':'sub'
    }

    let prevPageStack = new Stack();
    prevPageStack.items = cookies.prevPageStack || [];

    let pageType = hubOrSubDict[pageName];
    if (pageType === 'hub') {
        cookies.prevPageStack.purge()
        cookies.prevPageStack.push(pageName)
    } else {
        cookies.prevPageStack.push(pageName)
    }

    return {
        type: cookies.type,
        name: cookies.name,
        id: cookies.id,
        prevPageStack: prevPageStack.items,
        currentPage: pageName
    }
}