import './App.css';
import './smallComponents.js'
import React from "react";
import {useEffect, useState, useRef} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Timer, Back, hubOrSub } from './smallComponents.js';
import { PatientTopBar, StaffTopBar } from './4 - topBar.js'
import { useUser } from "./userContext";
import { testDates } from './testData.js';

export{
    AppointmentsHome,
    BookAppointment1,
    BookAppointment2,
}

function AppointmentsHome() {

    const navigate = useNavigate();
    const hasRun = useRef(false);

    let { cookies, setCookies } = useUser();
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('appointments', cookies));
            hasRun.current = true
        }},[])

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
            <>{TopBar}</>
            <div style={{ position: "relative", width: "100%" }}>
                <div className="centerPage">
                    <h1>Appointments</h1>
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
            <Timer />
        </>

    );
}



function BookAppointment1() {

    const [ priority, setPriority ] = useState(3);
    const [ reason, setReason ] = useState('');
    const { cookies, setCookies } = useUser();
    const navigate = useNavigate();

    const hasRun = useRef(false);

    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('BookAppointment1', cookies));
            hasRun.current = true
        }},[])


    const sendToNext = (event) => {
        navigate('/BookAppointment2')
    }


    return(
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <Back />
                <div className="centerPage">

                    <h1 style={{'marginTop':'75px'}}>Booking (Part 1)</h1>
                    <h2>Choose your main reason for making an appointment.</h2>
                    <h3>Reason: {reason}</h3>
                    
                    <div className={'Row'}>
                    <div className={'reasonList'}>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Persistent fever'))}>Persistent fever</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Severe sore throat'))}>Severe sore throat</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Ear pain'))}>Ear pain</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Abdominal pain'))}>Abdominal pain</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Concerning lumps'))}>Concerning lumps</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Anxiety/Depression (worsening)'))}>Anxiety/Depression (worsening)</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Unexplained weight loss'))}>Unexplained weight loss</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('UTI or STI symptoms'))}>UTI or STI symptoms</div>
                        <div className={'reason'} onClick={() => (setPriority(1), setReason('Worsening chest infection'))}>Worsening chest infection</div>
                        <div className={'reason'} onClick={() => (setPriority(2), setReason('Sprained joint'))}>Sprained joint</div>
                        <div className={'reason'} onClick={() => (setPriority(2), setReason('Ongoing migraines'))}>Ongoing migraines</div>
                        <div className={'reason'} onClick={() => (setPriority(2), setReason('Skin rashes'))}>Skin rashes</div>
                        <div className={'reason'} onClick={() => (setPriority(2), setReason('Chronic pain needing review'))}>Chronic pain needing review</div>
                        <div className={'reason'} onClick={() => (setPriority(2), setReason('Digestive issues'))}>Digestive issues</div>
                    </div>

                    <div className={'reasonList'}>
                        <div className={'reason'} onClick={() => { setPriority(2); setReason('Sleep problems'); }}>Sleep problems</div>
                        <div className={'reason'} onClick={() => { setPriority(2); setReason('Medication side effects'); }}>Medication side effects</div>
                        <div className={'reason'} onClick={() => { setPriority(2); setReason('Minor infection'); }}>Minor infection</div>
                        <div className={'reason'} onClick={() => { setPriority(2); setReason('Persistent cough'); }}>Persistent cough</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Check up'); }}>Check up</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Medication review'); }}>Medication review</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Blood pressure monitoring'); }}>Blood pressure monitoring</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Routine vaccinations'); }}>Routine vaccinations</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Minor skin conditions'); }}>Minor skin conditions</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Mild joint pain'); }}>Mild joint pain</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('General health advice'); }}>General health advice</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Travel vaccinations'); }}>Travel vaccinations</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Test results review'); }}>Test results review</div>
                        <div className={'reason'} onClick={() => { setPriority(3); setReason('Other'); }}>Other</div>
                    </div>
                    </div>
                    <div className={'buttonDiv'} onClick={sendToNext}>
                        <h3>Continue</h3>
                    </div>
                </div>
            </div>
            <Timer />
        </>
    );
}




function BookAppointment2() {

    const hasRun = useRef(false);
    let { cookies, setCookies } = useUser();

    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('BookAppointment2', cookies));
            hasRun.current = true
        }},[])

    // BIG API STUFF TO FETCH AVAILABLE DAYS DATA FOR 2 MONTHS FORWARDS (INCLUDING THE CURRENT ONE)
    // THEREFORE IF THIS MONTH IS DEC, THEN APPTS FROM JAN AND FEB ARE ALSO FETCHED AS WELL AS DEC

    // BACKEND ALGORITHM SHOULD TAKE INTO ACCOUNT THE DAYS OF THE CURRENT MONTH THAT HAVE PASSED ALREADY.
    // BACKEND SHOULD SEND AN OBJECT IN THE FORM OF SOMETHING LIKE THIS (WHERE TRUE MEANS AT LEAST ONE APPT IS AVAILABLE,
    // AND FALSE MEANS THERE ISN'T ONE):

    const dates = testDates // IMPORTED FROM testData.js

    return(
        <>
        <div style={{ position: "relative", width: "100%" }}>
            <Back />
            <div className="centerPage">

                <div className={'Calendar'}>
                    Lots of smaller divs inside, each being a single date!
                    Each div should have the date number (1,2,3,4...)
                    The month will be displayed alongside the calendar
                </div>

            </div>
        </div>
            <Timer />
        </>
    );
}