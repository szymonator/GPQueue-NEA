import './App.css';
import './smallComponents.js'
import React from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Timer, Back } from './smallComponents.js';
import { PatientTopBar, StaffTopBar } from './4 - topBar.js'
import { useUser } from "./userContext";

export{
    AppointmentsHome
}

function AppointmentsHome() {


    const { cookies } = useUser();

    //API STUFF TO GET APPOINTMENT AMOUNT WOW!
    let appointmentAmount = 'X'

    let TopBar;
    if (cookies.type === 'patient') {
        TopBar = <PatientTopBar />
    } else {
        TopBar = <StaffTopBar />
    }

    const sendToBook = (event) => {
        console.log('sendToBook')
    }

    const sendToFuture = (event) => {
        console.log('sendToFuture')
    }

    const sendToPast = (event) => {
        console.log('sendToPast')
    }

    return(
        <>
        <>{TopBar}</>
        <Back />
        <div className={'centerPage'}>
                <h1>Appointments</h1>
                <div className={'buttonDiv'} onClick={sendToBook} >
                    <h2>Book an Appointment</h2>
                </div>

                <h3>You have {appointmentAmount} appointment(s) coming up in the future.</h3>

                <div className={'buttonDiv'} onClick={sendToFuture}>
                    <h2>View Future Appointments</h2>
                </div>

                <div className={'buttonDiv'} onClick={sendToPast}>
                    <h2>View Past Appointments</h2>
                </div>
        </div>
        <Timer />
        </>
    );
    

}