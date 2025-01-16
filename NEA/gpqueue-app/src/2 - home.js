import './App.css';
import './smallComponents.js'
import React from "react";
import {useState, useEffect, useRef} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { hubOrSub} from './smallComponents.js';
import { TopBar } from './4 - topBar.js'
import { useCookies } from "./userContexts.js";

export{
    PatientHome,
    StaffHome
}

function PatientHome() {

    const navigate = useNavigate();
    const hasRun = useRef(false);
    const topBar = <TopBar/>
    const [ appointmentAmount, setAppointmentAmount ] = useState(null)

    let { cookies, setCookies } = useCookies();
    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('home', cookies));
            hasRun.current = true
        }})

    //API STUFF TO GET APPOINTMENT AMOUNT WOW! (in a useEffect)
    setAppointmentAmount('X')

    const sendToBook = (event) => {
        console.log('sendToBook')
        navigate('/BookAppointment1');
    }

    const sendToFuture = (event) => {
        console.log('sendToFuture')
    }

    const sendToPast = (event) => {
        console.log('sendToPast')
    }

    return(
        <>
            <>{topBar}</>
            <div style={{ position: "relative", width: "100%" }}>
                <div className="centerPage">
                    <h1>Home</h1>
                    <div className="buttonDiv" onClick={sendToBook}>
                        <h2>Book an Appointment</h2>
                    </div>
                    <h3>You have {appointmentAmount} appointment(s) coming up in the future.</h3>
                    <div className="buttonDiv" onClick={sendToFuture}>
                        <h2>View Future Appointments</h2>
                    </div>
                    <div className="buttonDiv" onClick={sendToPast}>
                        <h2>View Past Appointments</h2>
                    </div>
                </div>
            </div>
        </>

    );
}



function StaffHome() {

    const navigate = useNavigate();
    const hasRun = useRef(false);
    const topBar = <TopBar/>

    let { cookies, setCookies } = useCookies();
    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('staffhome', cookies));
            hasRun.current = true
        }})

    //API STUFF TO GET APPOINTMENT AMOUNT WOW!
    const appointmentAmount = 'X'
    const todaysAppointments = 'X'

    const sendToFuture = (event) => {
        console.log('sendToFuture')
    }

    const sendToPast = (event) => {
        console.log('sendToPast')
    }

    return(
        <>
            <>{topBar}</>
            <div style={{ position: "relative", width: "100%" }}>
                <div className="centerPage">
                    <h1>Home</h1>
                    <h3>You have {appointmentAmount} appointment(s) to tend to in the future.</h3>
                    <h3>{todaysAppointments} of those appointments are today.</h3>
                    <div className="buttonDiv" onClick={sendToFuture}>
                        <h2>View Future Appointments</h2>
                    </div>
                    <div className="buttonDiv" onClick={sendToPast}>
                        <h2>View Past Appointments</h2>
                    </div>
                </div>
            </div>
        </>

    );
}
