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
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Persistent fever')}}>Persistent fever</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Severe sore throat')}}>Severe sore throat</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Ear pain')}}>Ear pain</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Abdominal pain')}}>Abdominal pain</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Concerning lumps')}}>Concerning lumps</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Anxiety/Depression (worsening)')}}>Anxiety/Depression (worsening)</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Unexplained weight loss')}}>Unexplained weight loss</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('UTI or STI symptoms')}}>UTI or STI symptoms</div>
                        <div className={'reason'} onClick={() => {setPriority(1); setReason('Worsening chest infection')}}>Worsening chest infection</div>
                        <div className={'reason'} onClick={() => {setPriority(2); setReason('Sprained joint')}}>Sprained joint</div>
                        <div className={'reason'} onClick={() => {setPriority(2); setReason('Ongoing migraines')}}>Ongoing migraines</div>
                        <div className={'reason'} onClick={() => {setPriority(2); setReason('Skin rashes')}}>Skin rashes</div>
                        <div className={'reason'} onClick={() => {setPriority(2); setReason('Chronic pain needing review')}}>Chronic pain needing review</div>
                        <div className={'reason'} onClick={() => {setPriority(2); setReason('Digestive issues')}}>Digestive issues</div>
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

    const fullDates = testDates // IMPORTED FROM testData.js
    const [ currentDates, setCurrentDates ] = useState(fullDates[0]);

    const now = new Date()
    const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
    const [ month, setMonth ] = useState(months[now.getMonth()])
    
    const [ selection, setSelection] = useState(''); 

    const handleSelect = (date) => {
        if (!selection.includes(date)) {
            setSelection(selection + date+', ')
        } else {
            setSelection(selection.replace(date+', ', ''))
        }}

    const group = useRef(0)

    const handlePrevious = (event) => {
        if (group.current > 0) {
            setCurrentDates(fullDates[group.current-1])
            setMonth(months[Object.entries(fullDates[group.current-1])[0][0].slice(3,5)-1])
            group.current -= 1
        }}

    const handleNext = (event) => {
        if (group.current < 2) {
            setCurrentDates(fullDates[group.current+1])
            setMonth(months[Object.entries(fullDates[group.current+1])[0][0].slice(3,5)-1])
            group.current += 1
        }}

    const handleContinue = (event) => {
        console.log('next page time wowsers!')
    }

    return(
        <>
        <div style={{ position: "relative", width: "100%" }}>
            <Back />
            <h1 style={{'textAlign':'center'}}>Booking (part 2)</h1>
            <h2 style={{'textAlign':'center'}}>Select your preferred days</h2>
            <div className="centerPage" style={{'flexDirection':'row', 'justifyContent':'left', 'gap':'200px'}}>
                <div className={'Calendar'}>
                    {Object.entries(currentDates).map(([date, dateBool]) => (
                    <div key={date} className='day' 
                    onClick={dateBool ? () => handleSelect(date) : undefined} // Only call if available
                    style={{'backgroundColor': dateBool ? "#90ee90" : "#d3d3d3",
                                                'pointerEvents': dateBool ? "auto" : "none",
                                                'cursor': dateBool ? "pointer" : "not-allowed"}}>
                        <p style={{'marginTop':'5px'}}>{date}</p>
                    </div>
                    ))}
                </div>
                    <div style={{'display':'flex', 'flexDirection':'column', 'justifyContent':'center', 'gap':'35px', 'flexWrap':'wrap', 'alignItems':'center'}}>
                        <h3>Current month: {month}</h3>
                        <div style={{'maxWidth':'505px', 'textAlign':'center'}}>
                            <p>Days selected: {selection}</p>
                        </div>
                        <div className={'buttonDiv'} onClick={handlePrevious}>
                            <p>Previous Month</p>
                        </div>
                        <div className={'buttonDiv'} onClick={handleNext}>
                            <p>Next Month</p>
                        </div>
                        <div className={'buttonDiv'} style={{'width':'200px'}} onClick={handleContinue}>
                            <p>Continue</p>
                        </div>
                    </div>
            </div>
        </div>
            <Timer />
        </>
    );
}