import React from "react";
import {useState, useEffect, memo} from "react";
import { useUser } from "./userContext";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import Stack from "./stack";

export{
    Timer,
    Back,
    hubOrSub,
}

const Timer = memo(function Timer() {

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
            <p className={'Timer'}>{formattedDate} {formattedTime}</p>
        </>
    );
});


function Back() {

    let navigate = useNavigate();
    let { cookies, setCookies } = useUser();
    const prevPageStack = new Stack();

    const handleClick = (event) => {

        prevPageStack.items = cookies.prevPageStack || [];
        //let currentPage = prevPageStack.pop()
        let prevPage = prevPageStack.pop()

        let newCookies = {
            type: cookies.type,
            name: cookies.name,
            id: cookies.id,
            prevPageStack: prevPageStack.items, 
            currentPage: prevPage,
            backUsed: true
        }

        console.log('prevPage')
        setCookies(newCookies);
        navigate('/'+prevPage);
    }

    return(
        <>
        <div onClick={handleClick}>
        <div className={'Back'} >
            <h3>Back</h3>
        </div>
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
        'pastAppointments':'sub',
        'BookAppointment1':'sub',
        'BookAppointment2':'sub',
        'BookAppointment3':'sub',
    }

    let prevPageStack = new Stack();
    prevPageStack.items = cookies.prevPageStack || []; //stack hydration
    let prevPage = cookies.currentPage

    //let oldPageType = hubOrSubDict[prevPage];
    const newPageType = hubOrSubDict[pageName];

    if (newPageType === 'hub') {
        prevPageStack.purge()
    } else if (newPageType === 'sub' && !cookies.backUsed) {
        prevPageStack.push(prevPage)
    }

    let backBool
    if (cookies.backUsed) {
        backBool = false;
    }

    console.log(prevPageStack.items, pageName)

    return {
        type: cookies.type,
        name: cookies.name,
        id: cookies.id,
        prevPageStack: prevPageStack.items, //technically stack dehydration
        currentPage: pageName,
        backUsed: backBool,
    }
}
