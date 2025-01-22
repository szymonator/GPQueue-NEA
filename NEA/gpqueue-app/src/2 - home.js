import './App.css';
import './smallComponents.js'
import React from "react";
import {useState, useEffect, useRef} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Back, hubOrSub} from './smallComponents.js';
import { TopBar } from './4 - topBar.js'
import { useCookies } from "./userContexts.js";
import { fetchFuture, fetchPast, fetchApptAmount } from './ApiCalls.js';

export{
    PatientHome,
    StaffHome,
    PastAppts,
    FutureAppts
}

function PatientHome() {

    const navigate = useNavigate();
    const hasRun = useRef(false);
    const [ appointmentAmount, setAppointmentAmount ] = useState('X')

    let { cookies, setCookies } = useCookies();
    useEffect(() => {
        if (!hasRun.current) {
            if (!cookies.authBool) {navigate('/login')};
            setCookies(hubOrSub('home', cookies));
            hasRun.current = true
            fetchApptAmount(cookies.type, (callback) =>{
                setAppointmentAmount(callback)
                console.log(callback)
            })
        }}, [cookies, setCookies, navigate])

    //API STUFF TO GET APPOINTMENT AMOUNT WOW! (in a useEffect)

    const sendToBook = (event) => {
        console.log('sendToBook')
        navigate('/BookAppointment1');
    }

    const sendToFuture = (event) => {
        console.log('sendToFuture')
        navigate('/FutureAppointments')
    }

    const sendToPast = (event) => {
        console.log('sendToPast')
        navigate('/PastAppointments')
    }

    return(
        <>
            <TopBar/>
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
    const { cookies, setCookies } = useCookies();
    const [ appointmentAmount, setAppointmentAmount ] = useState(0);
    const [ amountToday, setAmountToday ] = useState(0);

    
    useEffect(() => {
        if (!hasRun.current) {
            if (!cookies.authBool) {navigate('/login')};
            setCookies(hubOrSub('StaffHome', cookies));
            hasRun.current = true
        fetchApptAmount(cookies.type, (callback) =>{
            setAppointmentAmount(callback[0])
            setAmountToday(callback[1])
        })
        }}, [cookies, setCookies, navigate])

    //API STUFF TO GET APPOINTMENT AMOUNT WOW!

    const sendToFuture = (event) => {
        console.log('sendToFuture', cookies.type)
        navigate('/FutureAppointments')
    }

    const sendToPast = (event) => {
        console.log('sendToPast', cookies.type)

        navigate('/PastAppointments')
    }

    return(
        <>
            <TopBar/>
            <div style={{ position: "relative", width: "100%" }}>
                <div className="centerPage">
                    <h1>Home</h1>
                    <h3>You have {appointmentAmount} appointment(s) to tend to in the future.</h3>
                    <h3>{amountToday} of those appointments are today.</h3>
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



function FutureAppts(){

    const navigate = useNavigate();
    const hasRun = useRef(false);
    const { cookies, setCookies } = useCookies();
    const [ fullFutureAppts, setFullFutureAppts ] = useState([]);
    const [ index, setIndex ] = useState(0)
    const [ currentFutureAppts, setCurrentFutureAppts ] = useState([]);
    let buttons = <></>

    
    useEffect(() => {
        if (!hasRun.current) {
            if (!cookies.authBool) {navigate('/login')};
            setCookies(hubOrSub('FutureAppointments', cookies));
            hasRun.current = true
            fetchFuture(cookies.type, (callback) => {
                let temp = []
                for (let n = 0; n<(callback.length/3); n++) {
                    temp.push(callback.slice(n*3,3*n+3))
                }
                setFullFutureAppts(temp)
                setCurrentFutureAppts(temp[0])
            })
        
        }
        }, [cookies, setCookies, navigate])

    

    const handleNext = (event) => {
        if (index < fullFutureAppts.length-1){
            setIndex((index) => index + 1)
            setCurrentFutureAppts(fullFutureAppts[index+1])
        }
    }

    const handlePrevious = (event) => {
        if (index > 0){
            setIndex((index) => index - 1)
            setCurrentFutureAppts(fullFutureAppts[index-1])
        }
    }
    
    if (fullFutureAppts.length <= 1){
        buttons = <></>
    } else {
        buttons = <div style={{'display':'flex', 'flexDirection':'row', 'gap':'200px'}}>
                            <div className={'buttonDiv'} onClick={handlePrevious}><p>Previous</p></div>
                            <div className={'buttonDiv'} onClick={handleNext}><p>Next</p></div>
                        </div>
    }

    if (!currentFutureAppts.length) {
        return(<>
            <TopBar/>
            <div style={{ position: "relative", width: "100%" }}>
            <Back/>
                <div className="centerPage">
                    <h1>Future Appointments</h1>
                    <h2>You have no appointments in the future.</h2>
                </div>
            </div>
        </>);
    }
    return(
        <>
            <TopBar/>
            <div style={{ position: "relative", width: "100%" }}>
            <Back/>
                <div className="centerPage">
                    <h1>Future Appointments</h1>
                    <div style={{'display':'flex', 'flexDirection':'column', 'gap':'10px', 'width':'1200px'}}>
                        {currentFutureAppts.map((appt, index) => (
                            <div key={index} style={{'borderStyle':'solid'}}>
                                <h3>&nbsp;&nbsp;&nbsp;&nbsp;  Appointment Time: {appt['appt_time']} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Appointment Date: {appt['appt_date']}</h3>
                                <h3>&nbsp;&nbsp;&nbsp;&nbsp;  {cookies.type === 'patient' ? 'Staff: Dr ' + appt['staff_name']: 'Patient: ' + appt['patient_name']} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; Details: {appt['appt_details']}</h3>
                            </div>
                        ))}
                        {buttons}
                    </div>
                </div>
            </div>
        </>
    );
}
    

function PastAppts(){

    const navigate = useNavigate();
    const hasRun = useRef(false);
    const { cookies, setCookies } = useCookies();
    const [ fullPastAppts, setFullPastAppts ] = useState([]);
    const [ index, setIndex ] = useState(0)
    const [ currentPastAppts, setCurrentPastAppts ] = useState([]);
    let buttons = <></>

    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('PastAppointments', cookies));
            hasRun.current = true

            fetchPast(cookies.type, (callback) => {
                let temp = []
                for (let n = 0; n<(callback.length/3); n++) {
                    temp.push(callback.slice(n*3,3*n+3))
                }
                setFullPastAppts(temp)
                setCurrentPastAppts(temp[0])
            })
        }

        }, [cookies, setCookies])


    const handleNext = (event) => {
        if (index < fullPastAppts.length-1){
            setIndex((index) => index + 1)
            setCurrentPastAppts(fullPastAppts[index+1])
        }
    }

    const handlePrevious = (event) => {
        if (index > 0){
            setIndex((index) => index - 1)
            setCurrentPastAppts(fullPastAppts[index-1])
        }
    }


    if (fullPastAppts.length <= 1){
        buttons = <></>
    } else {
        buttons = <div style={{'display':'flex', 'flexDirection':'row', 'gap':'200px'}}>
                            <div className={'buttonDiv'} onClick={handlePrevious}><p>Previous</p></div>
                            <div className={'buttonDiv'} onClick={handleNext}><p>Next</p></div>
                        </div>
    }

    if (!currentPastAppts.length) {
        return(<>
            <TopBar/>
            <div style={{ position: "relative", width: "100%" }}>
            <Back/>
                <div className="centerPage">
                    <h1>Past Appointments</h1>
                    <h2>You have no previous appointments.</h2>
                </div>
            </div>
        </>);
    }

    return(
        <>
            <TopBar/>
            <div style={{ position: "relative", width: "100%" }}>
            <Back/>
                <div className="centerPage">
                    <h1>Past Appointments</h1>
                    <div style={{'display':'flex', 'flexDirection':'column', 'gap':'10px', 'width':'1200px'}}>
                        {currentPastAppts.map((appt, index) => (
                            <div key={index} style={{'borderStyle':'solid'}}>
                                <h3>&nbsp;&nbsp;&nbsp;&nbsp;  Appointment Time: {appt['appt_time']} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Appointment Date: {appt['appt_date']}</h3>
                                <h3>&nbsp;&nbsp;&nbsp;&nbsp;  {cookies.type === 'patient' ? 'Staff: Dr ' + appt['staff_name']: 'Patient: ' + appt['patient_name']} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; Details: {appt['appt_details']}</h3>
                            </div>
                        ))}
                        {buttons}
                    </div>
                </div>
            </div>
        </>
    );
    
}
