import './App.css';
import './smallComponents.js'
import React from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Timer, hubOrSub} from './smallComponents.js';
import { PatientTopBar, StaffTopBar } from './4 - topBar.js'
import { useUser } from "./userContext";

export{
    Homepage
}



function Homepage() {

    let [buttonColor, setButtonColor] = useState({1:'#00B2CA', 2:'#00B2CA', 3:'#00B2CA'});
    let { cookies, setCookies } = useUser();

    setCookies(hubOrSub('home', cookies));

    //retrieve amount of upcoming appointments, and amount of new messages in inbox
    let appointmentAmount = 'X'
    let messageAmount = 'X'

    const type = cookies.type;
    const name = cookies.name;

    let topBar
    if (type === 'patient') {
        topBar = <PatientTopBar />;
    } else {
        topBar = <StaffTopBar />;
    }

    return(
        <>
            <>{topBar}</>
            <div className={'centerPage'}>
                <h1>Home</h1>
                <div className={'buttonDiv'}>
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
            <Timer />
        </>
    );
}