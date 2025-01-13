import './App.css';
import './smallComponents.js'
import React from "react";
import {useEffect, useState, useRef} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { Timer, Back, hubOrSub } from './smallComponents.js';
import { PatientTopBar, StaffTopBar } from './4 - topBar.js'
import { useCookies, useBooking } from "./userContexts.js";
import { testDates, testAppts } from './testData.js';
import { fetchDates } from './ApiCalls.js';

export{
    AppointmentsHome,
    BookAppointment1,
    BookAppointment2,
    BookAppointment3,
    BookAppointment4,
    Timeout
}

function AppointmentsHome() {

    const navigate = useNavigate();
    const hasRun = useRef(false);

    let { cookies, setCookies } = useCookies();
    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('appointments', cookies));
            hasRun.current = true
        }})

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
    const { cookies, setCookies } = useCookies();
    const { bookingData, setBookingData } = useBooking();
    const tempData = bookingData
    const [ opacity, setOpacity ] = useState(0);
    const navigate = useNavigate();

    const hasRun = useRef(false);

    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('BookAppointment1', cookies));
            if (tempData.reason !== '') {
                setReason(tempData.reason)
            }
            hasRun.current = true
        }}, [setCookies, cookies, tempData.reason])
    

    const sendToNext = (event) => {
        
        if (reason === '') {
            setOpacity(100)
        } else {

            setBookingData({
                priority: priority,
                reason: reason,
                dates: tempData.dates,
                times: tempData.times
            })
            navigate('/BookAppointment2')
        }
        
    }


    return(
        <>
            <div style={{ position: "relative", width: "100%", 'textAlign':'center' }}>
                <Back />
                <h1>Booking (Part 1)</h1>
                <h2>Choose your main reason for making an appointment.</h2>
                <h3>Reason: {reason}</h3>
                <h3 style={{'color':'red', opacity:opacity}}>Please choose a reason before proceeding!</h3>
                <div className="centerPage" style={{'height':'65vh'}}>
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
    const navigate = useNavigate();
    const hasRun = useRef(false);
    let { cookies, setCookies } = useCookies();
    const { bookingData, setBookingData } = useBooking();
    const tempData = bookingData;

    const [selection, setSelection] = useState('');
    const [opacity, setOpacity] = useState(0);
    const [fullDates, setFullDates] = useState(null); // Initialize as null
    const [currentDates, setCurrentDates] = useState(null); // Initialize as null
    const [loading, setLoading] = useState(true); // Track loading state

    if (!cookies.authBool) {
        navigate('/login');
    }

    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('BookAppointment2', cookies));
            if (tempData.dates !== '') {
                setSelection(tempData.dates);
            }

            // Fetch data in useEffect
            fetchDates(bookingData.priority, (callback) => {
                setFullDates(callback['dates']);
                setCurrentDates(callback['dates'][0]); // Set the first month's data as default
                setLoading(false); // Mark loading as complete
            });

            hasRun.current = true;
        }
    }, [setCookies, cookies, tempData.dates, bookingData.priority]);

    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [month, setMonth] = useState(months[now.getMonth()]);

    const handleSelect = (date) => {
        if (!selection.includes(date)) {
            setSelection(selection + date + ', ');
        } else {
            setSelection(selection.replace(date + ', ', ''));
        }
    };

    const group = useRef(0);

    const handlePrevious = () => {
        if (group.current > 0) {
            setCurrentDates(fullDates[group.current - 1]);
            setMonth(months[Object.entries(fullDates[group.current - 1])[0][0].slice(3, 5) - 1]);
            group.current -= 1;
        }
    };

    const handleNext = () => {
        if (group.current < 2) {
            setCurrentDates(fullDates[group.current + 1]);
            setMonth(months[Object.entries(fullDates[group.current + 1])[0][0].slice(3, 5) - 1]);
            group.current += 1;
        }
    };

    const handleContinue = () => {
        if (selection === '') {
            setOpacity(100);
        } else {
            setBookingData({
                priority: tempData.priority,
                reason: tempData.reason,
                dates: selection,
                times: tempData.times,
            });

            navigate('/BookAppointment3');
        }
    };

    // Conditional rendering: Show loading spinner or placeholder until data is fetched
    if (loading || !currentDates) {
        return <div>Loading...</div>; // Show loading indicator
    }

    return (
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <Back />
                <h1 style={{ 'textAlign': 'center' }}>Booking (part 2)</h1>
                <h2 style={{ 'textAlign': 'center' }}>Select your preferred days</h2>
                <div className="centerPage" style={{ 'flexDirection': 'row', 'justifyContent': 'left', 'gap': '200px' }}>
                    <div className={'Calendar'}>
                        {Object.entries(currentDates).map(([date, dateBool]) => (
                            <div key={date} className='day'
                                onClick={dateBool ? () => handleSelect(date) : undefined} // Only call if available
                                style={{
                                    'backgroundColor': dateBool ? "#90ee90" : "#d3d3d3",
                                    'pointerEvents': dateBool ? "auto" : "none",
                                    'cursor': dateBool ? "pointer" : "not-allowed",
                                    'borderRadius': '5px'
                                }}>
                                <p style={{ 'marginTop': '5px' }}>{date}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ 'display': 'flex', 'flexDirection': 'column', 'justifyContent': 'center', 'gap': '10px', 'flexWrap': 'wrap', 'alignItems': 'center' }}>
                        <h3>Current month: {month}</h3>
                        <div style={{ 'maxWidth': '505px', 'textAlign': 'center' }}>
                            <p>Days selected: {selection}</p>
                        </div>
                        <p style={{ 'color': 'red', 'opacity': opacity }}>Please select at least one day before continuing!</p>
                        <div className={'buttonDiv'} onClick={handlePrevious}>
                            <p>Previous Month</p>
                        </div>
                        <div className={'buttonDiv'} onClick={handleNext}>
                            <p>Next Month</p>
                        </div>
                        <div className={'buttonDiv'} style={{ 'width': '200px' }} onClick={handleContinue}>
                            <p>Continue</p>
                        </div>
                    </div>
                </div>
            </div>
            <Timer />
        </>
    );
}





function BookAppointment3() {

    const hasRun = useRef(false);
    let { cookies, setCookies } = useCookies();
    const navigate = useNavigate();
    const { bookingData, setBookingData } = useBooking();
    const tempData = bookingData
    const [ selection, setSelection] = useState(''); 
    const [ opacity, setOpacity ] = useState(0);

    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('BookAppointment3', cookies));
            hasRun.current = true
        }})

    const handleSelect = (time) => {
        if (!selection.includes(time)) {
            setSelection(selection + time+', ')
        } else {
            setSelection(selection.replace(time+', ', ''))
        }}

    const handleContinue = (event) => {
        if (selection === '') {
            setOpacity(100);
        } else {

            setBookingData({
                priority: tempData.priority,
                reason: tempData.reason,
                dates: tempData.dates,
                times: selection,
            })

            navigate('/BookAppointment4')
        }}


    return(
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <Back />
                <h1 style={{'textAlign':'center'}}>Booking (part 3)</h1>
                <h2 style={{'textAlign':'center'}}>Select your preferred timeframes</h2>
                <div className="centerPage" style={{'flexDirection':'row', 'justifyContent':'left', 'alignItems':'center'}}>
                    <div className={'Column'} style={{'display':'flex', 'alignItems':'center', 'flexDirection':'column', 'gap':'20px'}}>
                        <div className={'buttonDiv'} style={{'backgroundColor':'white'}} onClick={() => {handleSelect('9:00-13:00')}}>
                            <h3>9:00 - 13:00</h3>
                        </div>
                        <div className={'buttonDiv'} style={{'backgroundColor':'white'}} onClick={() => {handleSelect('13:00-17:00')}}>
                            <h3>13:00 - 17:00</h3>
                        </div>
                        <div className={'buttonDiv'} style={{'backgroundColor':'white'}} onClick={() => {handleSelect('17:00-21:00')}}>
                            <h3>17:00 - 21:00</h3>
                        </div>
                    </div>
                    <div className={'Column'} style={{'display':'flex', 'alignItems':'center', 'flexDirection':'column', 'gap':'20px'}}>
                        <p>Selection: {selection}</p>
                        <p style={{'color':'red', 'opacity':opacity}}>Please select at least one timeframe!</p>
                        <div className='buttonDiv' onClick={handleContinue}>
                            <h3>Continue</h3>
                        </div>
                    </div>

                </div>
            </div>
            <Timer />
        </>
    );
}



function BookAppointment4() {

    const hasRun = useRef(false);
    let { cookies, setCookies } = useCookies();
    const navigate = useNavigate();
    const { bookingData, setBookingData } = useBooking();
    const tempData = bookingData

    if (!cookies.authBool) {navigate('/login')};
    useEffect(() => {
        if (!hasRun.current) {
            setCookies(hubOrSub('BookAppointment3', cookies));
            hasRun.current = true
        }})


    // MAGIC API STUFF TO CALL ALL THE FINAL APPOINTMENT DATA BY SENDING THE CONTENTS OF tempData TO THE BACKEND.
    // APPOINTMENTS RETURNED SHOULD BE RETURNED LIKE testAppts FROM testData.js
    const [ apptsList, setApptsList ] = useState(testAppts.slice(1))

    const [ currentAppt, setCurrentAppt ] = useState(testAppts[0])
    const [ countdown, setCountdown ] = useState(120);
    const [ rerolls, setRerolls ] = useState(apptsList.length);

    useEffect(() => {

        const interval = setInterval(() => {
            setCountdown( (countdown) => countdown - 1)
        }, 1000)

        if (countdown < 1) {

            // API STUFF TO TELL BACKEND TO REMOVE THE TAKEN APPTS FROM THE 'POSSIBLES' AREA.
            navigate('/timeout')
        }

        return () => clearInterval(interval);
    })

    const handleReroll = () => {
        if (rerolls > 0) {
            setCountdown(120)
            setRerolls( (rerolls) => rerolls - 1 )
            setCurrentAppt(apptsList[0])
            setApptsList(apptsList.slice(1))
            console.log(apptsList.length)
        }
    }

    const handleNext = () => {
        console.log('not implemented yet nerd')

        // SEND currentAppt TO THE BACKEND FOR THEM TO SAVE IN THE DB

        navigate('/appointments')
    }

    const handleExit = () => {
        // // API STUFF TO TELL BACKEND TO REMOVE THE TAKEN APPTS FROM THE 'POSSIBLES' AREA.

        setBookingData({priority: null,
            reason: '',
            dates: '',
            times: '',})

        navigate('/home')
    }


    return(
        <>
            <div style={{ position: "relative", width: "100%" }}>
                <div className={'buttonDiv'} onClick={handleExit} style={{'width':'200px'}}><h3>Exit to Home</h3></div>
                <h1 style={{'textAlign':'center'}}>Summary - Booking (part 4)</h1>
                <h2 style={{'textAlign':'center'}}>Confirm this appointment choice or reroll</h2>
                <div className="centerPage" style={{'flexDirection':'center', 'justifyContent':'center', 'alignItems':'center', 'gap':'0px'}}>

                    <h3>Date: {currentAppt['dates']}</h3>
                    <h3>Time: {currentAppt['timeslot']}</h3>
                    <h3>Doctor: Dr {currentAppt['staff_name']}</h3>
                    <p style={{'color':'red'}}>You have {String(Math.floor(countdown/60)) +':'+String(countdown%60).padStart(2, '0')} left to lock your choice in, or to reroll for another appointment time.</p>
                    <p>Rerolls left: {rerolls}</p>
                    <div style={{'display':'flex', 'flexDirection':'row' ,'gap':'5px', 'justifyContent':'center', 'alignItems':'center'}}>
                        <div className={'buttonDiv'} onClick={handleNext}><h3>Continue</h3></div>
                        <div className={'buttonDiv'} onClick={handleReroll} style={{'pointerEvents': (rerolls===0)? 'none' : 'auto', 'cursor': (rerolls===0)? 'none' : 'pointer'}}><h3>Reroll</h3></div>
                    </div>
                </div>
            </div>
            <Timer />
        </>
    );
}




function Timeout() {

    const navigate = useNavigate();
    const handleClick = () => {navigate('/home')}

    return(
        <>
            <div>
                <div className={'centerPage'} style={{'display':'flex', 'flexDirection':'column', 'alignItems':'center', 'justifyContent':'center'}}>
                    <h1>You took too long to make a choice, try again with different options.</h1>
                    <div className={'buttonDiv'} onClick={handleClick}><h1>Go to the Homepage</h1></div>
                </div>
                <Timer/>
            </div>
        </>
    );
}