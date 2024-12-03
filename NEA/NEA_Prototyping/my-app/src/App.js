import './App.css';
import { useState, useEffect} from 'react';

function EntryBox() {

  const [name, setName] = useState('unknown');

  const nameChangeHandler = (evnt) =>{
    const nameValue = evnt.target.value; 
    setName(nameValue);
 }
  
  return (
    <>
    <label>Enter your name!   <input onChange={nameChangeHandler}></input></label>
    <p></p>
    <h3>Your name is {name}?</h3>
    </>
  );
}

function App() {
  return (
    <>
    <head>
      <title>Prototype</title>
    </head>
    <body>
    <div>
      <div className='topBar'>
      <h1>This is a website prototype!</h1>
      </div>
    <div className='explain'>
      <p>This very small website is simply a prototype, so that I am able to display my ability to use HTML and CSS to create a website. Of course, I will be learning a lot as I go along.</p>
      <EntryBox></EntryBox>
    </div>
    </div>
    </body>
    </>
  );
}
export default App;