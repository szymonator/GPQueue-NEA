import './App.css';
import './smallComponents.js'
import React from "react";
import {useEffect, useRef} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Timer, hubOrSub} from './smallComponents.js';
import { PatientTopBar, StaffTopBar } from './4 - topBar.js'
import { useCookies } from "./userContexts.js";

export{
    Homepage
}



function Homepage() {

    let { cookies, setCookies } = useCookies();
    const hasRun = useRef(false);
    const navigate = useNavigate();
    
    useEffect(() => {
    console.log('at homepage', cookies.authBool)
    if (!cookies.authBool) {
        navigate('/login');
    };
    if (!hasRun.current) {
        setCookies(hubOrSub('home', cookies));
        hasRun.current = true
    }})

    //retrieve amount of upcoming appointments, and amount of new messages in inbox
    let appointmentAmount = 'X'
    let messageAmount = 'X'

    const type = cookies.type;

    let topBar
    if (type === 'patient') {
        topBar = <PatientTopBar />;
    } else {
        topBar = <StaffTopBar />;
    }

    const handleBook = () => {
        navigate('/BookAppointment1');
    }

    return(
        <>
            <>{topBar}</>
            <div style={{ position: "relative", width: "100%" }}>
                <div className={'centerPage'}>
                    <h1>Home</h1>
                    <div className={'buttonDiv'} onClick={handleBook}>
                        <h2>Book an Appointment</h2>
                    </div>

                    <h3>You have {appointmentAmount} appointment(s) coming up in the future.</h3>

                    <div className={'buttonDiv'}>
                        <h2>View Future Appointments</h2>
                    </div>

                    <h3>You have {messageAmount} message(s) in your inbox.</h3>

                    <div className={'buttonDiv'}>
                        <h2>Go to Inbox</h2>
                    </div>
                </div>
                </div>
            <Timer />
        </>
    );
}