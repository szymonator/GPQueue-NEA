import './App.css';
import './smallComponents.js'
import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useCookies } from "./userContexts.js";
import { Timer } from './smallComponents.js';

export{
    TopBar
}

function TopBar() {

    let { cookies } = useCookies();
    const patientName = cookies.name;
    const navigate = useNavigate();

    const sendHome = (event) => {
        navigate('/home');
    }

    return(
        <>
        <div className={'topBar'}>
            <img src='https://i.imgur.com/v2qKKWO.png' className={'icon'} onClick={sendHome} alt={'Logo'}/>
            <h2>Welcome, {patientName}!</h2>
            <Timer/>

        </div>
        </>
    );
}