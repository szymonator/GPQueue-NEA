import './App.css';
import React from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

export{
    Homepage
}

function TopBar() {

    // code that checks if user is staff or patient
    let patientName = 'Szymon Galutowski'
    const navigate = useNavigate();

    const sendToAppts = (event) =>
        //navigate(\appointments);
        console.log('sending to appointments page')

    return(
        <>
        <div className={'topBar'}>
            <img src='https://banner2.cleanpng.com/20180131/roe/av2ouosx2.webp' className={'icon'} />
            <div className={'Column'}>
                <h3>Welcome, {patientName}!</h3>
            </div>
            <div className={'PatientBarBox'} onClick={sendToAppts}>
                <h3>Appointments</h3>
            </div>
            <div className={'PatientBarBox'} onClick={sendToAppts}>
                <h3>Prescriptions</h3>
            </div>
            <div className={'PatientBarBox'} onClick={sendToAppts}>
                <h3>Message</h3>
            </div>
            <div className={'PatientBarBox'} onClick={sendToAppts}>
                <h3>Medical History</h3>
            </div>
            <div className={'PatientBarBox'} onClick={sendToAppts}>
                <h3>Settings/Account</h3>
            </div>
        </div>
        </>
    );
}



function Homepage() {


    return(
        <>
            <TopBar />
        </>
    );
}