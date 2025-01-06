import './App.css';
import './smallComponents.js'
import React from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useCookies } from "./userContexts.js";

export{
    PatientTopBar,
    StaffTopBar
};

function PatientTopBar() {

    let { cookies } = useCookies();
    const patientName = cookies.name;
    let [buttonColor, setButtonColor] = useState({1:'#00B2CA', 2:'#00B2CA', 3:'#00B2CA', 4:'#00B2CA', 5:'#00B2CA'});
    const navigate = useNavigate();

    const handleHover1 = (event) => {setButtonColor({1:'#7ee5f2', 2:buttonColor[2], 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleNormal1 = (event) => {setButtonColor({1:'#00b2ca', 2:buttonColor[2], 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleHover2 = (event) => {setButtonColor({1:buttonColor[1], 2:'#7ee5f2', 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleNormal2 = (event) => {setButtonColor({1:buttonColor[1], 2:'#00b2ca', 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleHover3 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:'#7ee5f2', 4:buttonColor[4], 5:buttonColor[5]});}
    const handleNormal3 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:'#00b2ca', 4:buttonColor[4], 5:buttonColor[5]});}
    const handleHover4 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:buttonColor[3], 4:'#7ee5f2', 5:buttonColor[5]});}
    const handleNormal4 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:buttonColor[3], 4:'#00b2ca', 5:buttonColor[5]});}
    const handleHover5 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:buttonColor[3], 4:buttonColor[4], 5:'#7ee5f2'});}
    const handleNormal5 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:buttonColor[3], 4:buttonColor[4], 5:'#00b2ca'});}

    const sendHome = (event) => {
        navigate('/home');
    }

    const sendToAppts = (event) => {
        navigate('/appointments');
        console.log('sending to appointments page')
    }

    const sendToPresc = (event) => {
        console.log('sending to prescriptions page')
    }

    const sendToMsgs = (event) => {
        //navigate(\prescriptions);
        console.log('sending to messages page')
    }

    const sendToMedH = (event) => {
        //navigate(\history);
        console.log('sending to medical history page')
    }

    const sendToAcc = (event) => {
        //navigate(\account)
        console.log('sending to account')
    }

    return(
        <>
        <div className={'topBar'}>
            <img src='https://i.imgur.com/v2qKKWO.png' className={'icon'} onClick={sendHome} alt={'Logo'}/>
            <div className={'Column'} style={{textAlign: 'center', marginTop: '18px'}}>
                <h3>Welcome, {patientName}!</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[1]}} onMouseEnter={handleHover1} onMouseLeave={handleNormal1} onClick={sendToAppts}>
                <h3>Appointments</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[2]}} onMouseEnter={handleHover2} onMouseOut={handleNormal2} onClick={sendToPresc}>
                <h3>Prescriptions</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[3]}} onMouseEnter={handleHover3} onMouseLeave={handleNormal3} onClick={sendToMsgs}>
                <h3>Message</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[4]}} onMouseEnter={handleHover4} onMouseLeave={handleNormal4} onClick={sendToMedH}>
                <h3>Medical History</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[5]}} onMouseEnter={handleHover5} onMouseLeave={handleNormal5} onClick={sendToAcc}>
                <h3>Settings/Account</h3>
            </div>
        </div>
        </>
    );
}




function StaffTopBar() {

    const { cookies } = useCookies();
    const staffName = cookies.name;
    let [buttonColor, setButtonColor] = useState({1:'#00B2CA', 2:'#00B2CA', 3:'#00B2CA', 4:'#00B2CA', 5:'#00B2CA'});
    const navigate = useNavigate();

    const handleHover1 = (event) => {setButtonColor({1:'#7ee5f2', 2:buttonColor[2], 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleNormal1 = (event) => {setButtonColor({1:'#00b2ca', 2:buttonColor[2], 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleHover2 = (event) => {setButtonColor({1:buttonColor[1], 2:'#7ee5f2', 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleNormal2 = (event) => {setButtonColor({1:buttonColor[1], 2:'#00b2ca', 3:buttonColor[3], 4:buttonColor[4], 5:buttonColor[5]});}
    const handleHover3 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:'#7ee5f2', 4:buttonColor[4], 5:buttonColor[5]});}
    const handleNormal3 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:'#00b2ca', 4:buttonColor[4], 5:buttonColor[5]});}
    const handleHover4 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:buttonColor[3], 4:'#7ee5f2', 5:buttonColor[5]});}
    const handleNormal4 = (event) => {setButtonColor({1:buttonColor[1], 2:buttonColor[2], 3:buttonColor[3], 4:'#00b2ca', 5:buttonColor[5]});}

    const sendHome = (event) => {
        //navigate(/home);
        console.log("Sending home")
    }

    const sendToSchedule = (event) => {
        //navigate('/schedule');
        console.log('sending to schedule page')
    }

    const sendToMessages = (event) => {
        console.log('sending to messages page')
    }

    const sendToPatientLookup = (event) => {
        //navigate(/prescriptions);
        console.log('sending to patient lookup page')
    }

    const sendToAcc = (event) => {
        //navigate(/account)
        console.log('sending to account')
    }

    return(
        <>
        <div className={'topBar'}>
            <img src='https://banner2.cleanpng.com/20180131/roe/av2ouosx2.webp' className={'icon'} onClick={sendHome} alt={'Logo'}/>
            <div className={'Column'} style={{textAlign: 'center', marginTop: '18px'}}>
                <h3>Welcome, {staffName}!</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[1]}} onMouseEnter={handleHover1} onMouseLeave={handleNormal1} onClick={sendToSchedule}>
                <h3>Schedule</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[2]}} onMouseEnter={handleHover2} onMouseOut={handleNormal2} onClick={sendToMessages}>
                <h3>Messages</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[3]}} onMouseEnter={handleHover3} onMouseLeave={handleNormal3} onClick={sendToPatientLookup}>
                <h3>Patient Lookup</h3>
            </div>
            <div className={'PatientBarBox'} style={{backgroundColor:buttonColor[4]}} onMouseEnter={handleHover4} onMouseLeave={handleNormal4} onClick={sendToAcc}>
                <h3>Settings/Account</h3>
            </div>
        </div>
        </>
    );
}