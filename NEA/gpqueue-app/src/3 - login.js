import './App.css';
import React from "react";
import {useState} from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, data, resolvePath } from "react-router-dom";
import { useCookies } from './userContexts';
import { uponLogin, uponRegister } from './ApiCalls';


export{
    Login,
    Register,
    StaffApproval,
}

function Login() {

    const navigate = useNavigate();
    const { setCookies } = useCookies();
    const [ opacity, setOpacity ] = useState(0);

    function handleSubmit(event) {

        event.preventDefault()
        const form = event.target;
        const email = form.elements.email.value;
        const password = form.elements.password.value;

        if (!email || !password){
            setOpacity(1)
        } else {
            setOpacity(0)
        }
    
        console.log('Form submitted', { Email: email, Password: password });

        
        uponLogin(email, password, (callback) => {
            if (callback === 'failed') {
                setOpacity(1)
            } else {
                setOpacity(0)
                console.log('User name received:', callback['name']); 
                setCookies({
                    type: callback['type'],
                    name: callback['name'],
                    prevPageStack: [],
                    currentPage: null,
                    authBool: true
                });

                if (callback['type'] === 'patient') {
                    navigate('/home')
                } else if (callback['type'] === 'staff') {
                    navigate('/StaffHome')
                }
        }});
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
            <h2 style={{'color':'red', 'opacity':opacity}}>Invalid email or password, please try again.</h2>
        </div>
    );
}



function Register() {

    const [opacity1, setOpacity1] = useState(0);
    const [opacity2, setOpacity2] = useState(0);
    const [opacity3, setOpacity3] = useState(0);
    const { setCookies } = useCookies();
    const navigate = useNavigate();

    function handleSubmit(event) {

        event.preventDefault()
        const form = event.target;
        const clickedButton = event.nativeEvent.submitter; // Identify the clicked button
        const type = clickedButton.getAttribute('data-type');

        // Set the user type based on the button clicked
        let password = form.elements.password.value;
        let cpassword = form.elements.cpassword.value;
        if (password === cpassword){
            setOpacity1(0);
            setOpacity2(0);
            let email = form.elements.email.value;
            let fname = form.elements.fname.value;
            let sname = form.elements.sname.value;
            let dob = form.elements.dob.value;
            console.log(fname)
            let temp_details = {
                'fname': fname,
                'sname': sname,
                'email': email,
                'password': password,
                'dob': dob,
                'type': type
            };

            if (fname !== '' && sname !== '' && email !== '' && password !== '' && validDate(dob) && cpassword !== '' && validEmail(email) && validPassword(password)) {
                console.log("Registration submitted", temp_details)

                uponRegister(fname, sname, email, type, password, dob, (error) => {

                    if (!error) {
                        setOpacity3(1)
                        return 
                    }
                    
                    setOpacity3(0)

                    setCookies({
                        type: type,
                        name: fname+' '+sname,
                        prevPageStack: [],
                        currentPage: null,
                        authBool: true
                    });

                    console.log(type)
                    if (type === 'patient') {
                        navigate("/home");
                    } else {
                        navigate("/staffApproval")
                    }
                }) //API STUFF TO REGISTER USER
                
            } else {
                setOpacity2(1);
            }
        } else {
            setOpacity1(1);
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
        </div>
        </div>
        <button type='submit' data-type='patient' >Register!</button>
        <button style={{'position':'absolute', 'right':0, 'bottom':0, 'zIndex': 10}} type='submit' data-type='staff' >Register as Staff</button>
        </form>
        <h3 style={{color: 'red', opacity: opacity1, textAlign:'center'}}>Passwords do not match, try again.</h3>
        <h3 style={{color: 'red', opacity: opacity2, textAlign:'center'}}>Please make sure all fields are filled in correctly.</h3>
        <h3 style={{color: 'red', opacity: opacity3, textAlign:'center'}}>Email already in use.</h3>
        </>
    );
}

function StaffApproval() {
    return(
        <div className={'centerPage'}>
            <img src='https://i.imgur.com/v2qKKWO.png' alt='Logo' style={{width:'400px', height:'400px', marginTop:'50px'}} />
            <h1>Please wait for your supervisor to approve your registration.</h1>
            <h1>When it is approved, you will be able to log in by going back to the login page.</h1>
        </div>
    );
}

function validDate(dateString) { //returns true/false
                
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/; // #iHateRegex
    const match = dateString.match(dateRegex);
    console.log(match) // match = ["32/01/2007","32","01","2007"] when i input match[0]
    
    if (!match) {
        return false;
    }

    const day = parseInt(match[1], 10);  // just converts the value, currently a str, into a base 10 int
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    const date = new Date(year, month - 1, day); // checks if date is valid, 0 based indexing for months
    return (
        date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    );
}

function validEmail(emailString){

    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
    const match = emailString.match(emailRegex)
    console.log(match)

    return match
}

function validPassword(passwordString){

    const specialRegex = /[!@#$%^&**(){}'":;£§~_+=`,.<>?/]/
    const capitalRegex = /[A-Z]/
    const lowerRegex = /[a-z]/
    const numberRegex = /[0-9]/
    const match1 = passwordString.match(specialRegex)
    const match2 = passwordString.match(capitalRegex)
    const match3 = passwordString.match(lowerRegex)
    const match4 = passwordString.match(numberRegex)
    return match1 && match2 && match3 && match4 && passwordString.length > 10 
}