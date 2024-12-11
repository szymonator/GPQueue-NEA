import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./userContext";
import {Login, Register} from "./3 - login"
import { Homepage } from './2 - home';

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}


