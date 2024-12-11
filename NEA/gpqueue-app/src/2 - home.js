import './App.css';
import './timeDisplay.js'
import React from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Timer } from './timeDisplay.js';
import { PatientTopBar, StaffTopBar } from './4 - topBar.js'
import { useUser } from "./userContext";

export{
    Homepage
}



function Homepage() {

    let [buttonColor, setButtonColor] = useState({1:'#00B2CA', 2:'#00B2CA', 3:'#00B2CA'});
    const { cookies } = useUser();

    //retrieve amount of upcoming appointments, and amount of new messages in inbox
    let appointmentAmount = 'X'
    let messageAmount = 'X'

    const handleHover1 = (event) => setButtonColor({1:'#7ee5f2', 2:buttonColor[2], 3:buttonColor[3]})
    const handleNormal1 = (event) => setButtonColor({1:'#00b2ca', 2:buttonColor[2], 3:buttonColor[3]})
    const handleHover2 = (event) => setButtonColor({1:buttonColor[1], 2:'#7ee5f2', 3:buttonColor[3]})
    const handleNormal2 = (event) => setButtonColor({1:buttonColor[1], 2:'#00b2ca', 3:buttonColor[3]})
    const handleHover3 = (event) => setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:'#7ee5f2'})
    const handleNormal3 = (event) => setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:'#00b2ca'})

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

                <div className={'buttonDiv'} style={{backgroundColor:buttonColor[1]}} onMouseEnter={handleHover1} onMouseLeave={handleNormal1}>
                    <h2>Book an Appointment</h2>
                </div>

                <h3>You have {appointmentAmount} appointment(s) coming up in the future.</h3>

                <div className={'buttonDiv'} style={{backgroundColor:buttonColor[2]}} onMouseEnter={handleHover2} onMouseLeave={handleNormal2}>
                    <h2>View Future Appointments</h2>
                </div>

                <h3>You have {messageAmount} message(s) in your inbox.</h3>

                <div className={'buttonDiv'} style={{backgroundColor:buttonColor[3]}} onMouseEnter={handleHover3} onMouseLeave={handleNormal3}>
                    <h2>Go to Inbox</h2>
                </div>

            </div>
            <Timer />
        </>
    );
}