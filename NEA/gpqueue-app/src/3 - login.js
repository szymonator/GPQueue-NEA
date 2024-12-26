import './App.css';
import React, { useEffect } from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
// eslint-disable-next-line
import { Homepage } from './2 - home';
import { useCookies } from './userContexts';
import Stack from './stack';

export{
    Login,
    Register,
    StaffApproval,
}

function Login() {

    const navigate = useNavigate();
    const { setCookies } = useCookies();

    function handleSubmit(event) {

        event.preventDefault()
        const form = event.target;
        let email = form.elements.email.value;
        let password = form.elements.password.value;
    
        console.log('Form submitted', { Email: email, Password: password });

        //API AUTHENTICATION STUFF, AS ONE DOES
        let type = 'patient'
        let name = 'Szymon Galutowski'
        let id = '1625'

        setCookies({
            type: type,
            name: name,
            id: id,
            prevPageStack: [],
            currentPage: null
        });

        navigate('/home')
    }

    return(
        <div className={'App-header'}>
            <h1>Welcome to GPQueue!</h1>
            <nav>
                <p>If you do not have an account, register <Link to="/register">here</Link>!</p>
            </nav>
            <h2>Login:</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <p>Email:</p><input name="email"></input>
                <p>Password:</p><input name="password"></input>
                </div>
                <button type='submit'>Login!</button>
            </form>
        </div>
    );
}




function Register() {

    //let [details, setDetails] = useState({Email:'', Password:'', fName:'', sName:'', DOB:'', pNumber:null, staff:false});
    let [opacity, setOpacity] = useState(0);
    let [type, setType] = useState('patient');
    const { setCookies } = useCookies();
    const navigate = useNavigate();

    function applyPatient() {
        setType('patient');
    }

    function applyStaff() {
        setType('staff');
    }

    function handleSubmit(event) {

        event.preventDefault()
        const form = event.target;
        let password = form.elements.password.value;
        let cpassword = form.elements.cpassword.value;
        if (password === cpassword){
            setOpacity(0);
            let email = form.elements.email.value;
            // TO DO - WHEN API INTEGRATED, MAKE A CHECK SO THAT THE SAME EMAIL & NUMBER ISN'T USED TWICE
            let fname = form.elements.fname.value;
            let sname = form.elements.sname.value;
            let dob = form.elements.dob.value;
            let pnumber = form.elements.pnumber.value;
            let temp_details = {
                Email: email,
                Password: password,
                fName: fname,
                sName: sname,
                DOB: dob,
                pNumber: pnumber,
                type: type
            };
            //setDetails(temp_details);
            console.log("Registration submitted", temp_details)

            //API STUFF TO REGISTER USER, AND FETCH ID
            let id = '1625'
            fname = 'Szymon'
            sname = 'Galutowksi'

            setCookies({
                type: type,
                name: fname+' '+sname,
                id: id,
                prevPageStack: [],
                currentPage: null
            });

            if (type === 'patient') {
                navigate("/home");
            } else {
                navigate("/staffApproval")
            }

        } else {
            setOpacity(1);
        }
        
    }


    return(
        <>
        <div className={'App-header'}>
            <h1>Welcome to GPQueue!</h1>
            <nav>
            <p>If you do not have an account, login <Link to="/login">here</Link>!</p>
            </nav>
            <h2>Register:</h2>
        </div>
        <form onSubmit={handleSubmit} className={'App'}>
        <div className={'Row'}>
        <div className={'Column'}>
            <p>Email:</p><input name="email"></input>
            <p>Password:</p><input name="password"></input>
            <p>(Your password must be larger than 10 characters and include capitals, numbers, and special characters)</p>
            <p>Confirm Password:</p><input name="cpassword"></input>

        </div>
        <div className={'Column'}>
            <p>First Name:</p><input name='fname'></input>
            <p>Surname:</p><input name='sname'></input>
            <p>Date of Birth (DD/MM/YYYY):</p><input name='dob'></input>
            <p>Phone Number (optional):</p><input name='pnumber'></input>
        </div>
        </div>
        <button type='submit' onClick={applyPatient}>Register!</button>
        <button style={{position:'absolute', right:0, bottom:0}} type='submit_as_staff' onClick={applyStaff}>Register as Staff</button>
        </form>
        <h3 style={{color: 'red', opacity: opacity, textAlign:'center'}}>Passwords do not match, try again.</h3>
        </>
    );
}


function StaffApproval() {
    return(
        <div className={'centerPage'}>
            <img src="https://banner2.cleanpng.com/20180131/roe/av2ouosx2.webp" alt='Logo' style={{width:'400px', height:'400px', marginTop:'50px'}} />
            <h1>Please wait for your supervisor to approve your registration.</h1>
            <h1>When it is approved, you will be able to log in by going back to the login page.</h1>
        </div>
    );
}